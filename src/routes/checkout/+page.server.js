import { fail, redirect } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import {
	products,
	productVariants,
	productImages,
	addresses,
	orders,
	orderItems
} from '#lib/server/db/schema.js';

const DEFAULT_COORDS = {
	lat: -6.3428,
	lng: 106.7383
};

const DEFAULT_PAYMENT_METHOD = 'Hubungi lewat WhatsApp';

function extractRows(result) {
	if (Array.isArray(result)) return result;
	return result?.rows || [];
}

function formatOrderAddress(order) {
	if (!order) return '';
	if (order.shippingAddress) return order.shippingAddress;
	const parts = [
		order.shippingAddressDetail,
		order.shippingDistrict && order.shippingDistrict !== '-'
			? `Kec. ${order.shippingDistrict}`
			: '',
		order.shippingCity,
		order.shippingProvince,
		order.shippingPostalCode && order.shippingPostalCode !== '-'
			? order.shippingPostalCode
			: ''
	].filter(Boolean);
	return parts.join(', ');
}

function extractPaymentMethod(order) {
	if (!order) return DEFAULT_PAYMENT_METHOD;
	if (order.paymentMethod) return order.paymentMethod;
	const match = String(order.notes || '').match(/Metode:\s*([^|]+)/i);
	return match ? match[1].trim() : DEFAULT_PAYMENT_METHOD;
}

async function detectCartHasUserIdColumn() {
	const colRes = await db.execute(
		sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'cart_items'`
	);
	const cols = extractRows(colRes);
	return cols.some((c) => c.column_name === 'user_id');
}

async function getUserCartDetailed(userId) {
	const hasUserIdCol = await detectCartHasUserIdColumn();

	const rawCartRes = hasUserIdCol
		? await db.execute(
				sql`SELECT id, product_id, variant_id, quantity FROM cart_items WHERE user_id = ${userId} ORDER BY id ASC`
			)
		: await db.execute(
				sql`SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity
					FROM cart_items ci
					INNER JOIN carts c ON ci.cart_id = c.id
					WHERE c.user_id = ${userId}
					ORDER BY ci.id ASC`
			);

	const rawRows = extractRows(rawCartRes);
	if (rawRows.length === 0) {
		return { items: [], subtotal: 0, totalQuantity: 0 };
	}

	const [allProducts, allVariants, allImages] = await Promise.all([
		db.select().from(products),
		db.select().from(productVariants),
		db.select().from(productImages).where(eq(productImages.isPrimary, true))
	]);

	const productMap = new Map(allProducts.map((p) => [p.id, p]));
	const variantMap = new Map(allVariants.map((v) => [v.id, v]));
	const imgMap = new Map(allImages.map((img) => [img.productId, img.url]));

	const items = [];
	for (const row of rawRows) {
		const variant = variantMap.get(Number(row.variant_id));
		const product = productMap.get(Number(row.product_id || variant?.productId));
		if (!product || !variant) continue;

		const unitPrice = (product.basePrice || 0) + (variant.priceDelta || 0);
		const quantity = Number(row.quantity || 1);

		items.push({
			cartItemId: Number(row.id),
			quantity,
			productId: product.id,
			productName: product.name,
			productSlug: product.slug,
			basePrice: product.basePrice,
			variantId: variant.id,
			colorName: variant.colorName,
			colorHex: variant.colorHex,
			sku: variant.sku,
			priceDelta: variant.priceDelta || 0,
			stock: variant.stock || 0,
			unitPrice,
			subtotal: unitPrice * quantity,
			imageUrl: variant.imageUrl || imgMap.get(product.id) || '/products/placeholder.svg'
		});
	}

	const subtotal = items.reduce((sum, it) => sum + it.subtotal, 0);
	const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);

	return { items, subtotal, totalQuantity };
}

async function clearUserCart(userId) {
	const hasUserIdCol = await detectCartHasUserIdColumn();
	if (hasUserIdCol) {
		await db.execute(sql`DELETE FROM cart_items WHERE user_id = ${userId}`);
	} else {
		await db.execute(
			sql`DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ${userId})`
		);
	}
}

export async function load({ locals, url }) {
	if (!locals.user) {
		throw redirect(303, '/masuk?redirect=/checkout');
	}

	const invoiceParam = url.searchParams.get('invoice')?.trim();
	let activeOrder = null;

	if (invoiceParam) {
		const [foundOrder] = await db
			.select()
			.from(orders)
			.where(and(eq(orders.invoiceNumber, invoiceParam), eq(orders.userId, locals.user.id)))
			.limit(1);

		if (foundOrder) {
			const items = await db
				.select()
				.from(orderItems)
				.where(eq(orderItems.orderId, foundOrder.id));
			activeOrder = {
				...foundOrder,
				shippingAddress: formatOrderAddress(foundOrder),
				paymentMethod: extractPaymentMethod(foundOrder),
				items
			};
		}
	}

	const [cart, savedAddresses] = await Promise.all([
		getUserCartDetailed(locals.user.id),
		db.select().from(addresses).where(eq(addresses.userId, locals.user.id))
	]);

	return {
		user: locals.user,
		cart,
		savedAddresses,
		activeOrder
	};
}

export const actions = {
	createOrder: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/masuk?redirect=/checkout');
		}

		try {
			const fd = await request.formData();
			const recipientName = String(fd.get('recipientName') || '').trim();
			const recipientPhone = String(fd.get('recipientPhone') || '').trim();
			const addressDetail = String(fd.get('addressDetail') || '').trim();
			const district = String(fd.get('district') || '').trim();
			const city = String(fd.get('city') || '').trim();
			const province = String(fd.get('province') || '').trim();
			const postalCode = String(fd.get('postalCode') || '').trim();
			const saveToProfile = fd.get('saveToProfile') === 'on';
			const paymentMethod = DEFAULT_PAYMENT_METHOD;
			const orderNotes = String(fd.get('orderNotes') || '').trim();

			if (!recipientName || !recipientPhone || !addressDetail || !city || !province) {
				return fail(400, {
					error: 'Nama penerima, nomor WhatsApp, alamat lengkap, kota, dan provinsi wajib diisi.'
				});
			}

			const cart = await getUserCartDetailed(locals.user.id);
			if (cart.items.length === 0) {
				return fail(400, {
					error: 'Keranjang belanja Anda kosong. Tambahkan produk terlebih dahulu sebelum checkout.'
				});
			}

			for (const item of cart.items) {
				if (item.stock < item.quantity) {
					return fail(400, {
						error: `Stok "${item.productName} (${item.colorName})" tersisa ${item.stock} unit. Sesuaikan jumlah di keranjang.`
					});
				}
			}

			if (saveToProfile) {
				try {
					await db.insert(addresses).values({
						userId: locals.user.id,
						label: 'Alamat Pengiriman',
						recipientName,
						recipientPhone,
						addressDetail,
						district: district || '-',
						city,
						province,
						postalCode: postalCode || '-',
						latitude: DEFAULT_COORDS.lat,
						longitude: DEFAULT_COORDS.lng
					});
				} catch {
					// Abaikan jika skema alamat berbeda agar pembuatan pesanan tetap berlanjut
				}
			}

			const now = new Date();
			const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
				now.getDate()
			).padStart(2, '0')}`;
			const randSuffix = String(Math.floor(100 + Math.random() * 900));
			const invoiceNumber = `INV-${ymd}-${randSuffix}`;

			const totalAmount = cart.subtotal;
			const combinedNotes = orderNotes
				? `${orderNotes} | Metode: ${paymentMethod}`
				: `Metode: ${paymentMethod}`;
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

			const [newOrder] = await db
				.insert(orders)
				.values({
					invoiceNumber,
					userId: locals.user.id,
					status: 'pending_payment',
					recipientName,
					recipientPhone,
					shippingProvince: province,
					shippingCity: city,
					shippingDistrict: district || '-',
					shippingPostalCode: postalCode || '-',
					shippingAddressDetail: addressDetail,
					shippingLandmark: orderNotes || null,
					shippingLatitude: DEFAULT_COORDS.lat,
					shippingLongitude: DEFAULT_COORDS.lng,
					distanceMeters: 0,
					shippingService: 'Konfirmasi via WhatsApp',
					shippingEtd: '-',
					shippingCost: 0,
					subtotal: cart.subtotal,
					totalAmount,
					notes: combinedNotes,
					expiresAt
				})
				.returning();

			for (const item of cart.items) {
				await db.insert(orderItems).values({
					orderId: newOrder.id,
					productId: item.productId,
					variantId: item.variantId,
					productNameSnapshot: item.productName,
					variantNameSnapshot: item.colorName,
					skuSnapshot: item.sku,
					unitPrice: item.unitPrice,
					quantity: item.quantity,
					subtotal: item.subtotal
				});

				await db
					.update(productVariants)
					.set({ stock: Math.max(0, item.stock - item.quantity) })
					.where(eq(productVariants.id, item.variantId));
			}

			await clearUserCart(locals.user.id);

			const createdItems = await db
				.select()
				.from(orderItems)
				.where(eq(orderItems.orderId, newOrder.id));

			return {
				createdOrder: {
					...newOrder,
					shippingAddress: formatOrderAddress(newOrder),
					paymentMethod,
					items: createdItems
				}
			};
		} catch (err) {
			console.error('createOrder error:', err);
			return fail(400, {
				error: `Gagal membuat pesanan: ${err?.message || 'Terjadi kendala pada server.'}`
			});
		}
	}
};