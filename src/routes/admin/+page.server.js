import fs from 'node:fs/promises';
import path from 'node:path';
import { fail } from '@sveltejs/kit';
import { eq, desc, asc, inArray, sql } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import {
	categories,
	products,
	productVariants,
	productImages,
	orders,
	orderItems,
	users,
	addresses,
	cartItems,
	wishlists
} from '#lib/server/db/schema.js';

function slugify(text) {
	return String(text || '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

function formatAddressRecord(addr) {
	if (!addr) return '';
	const parts = [
		addr.addressDetail,
		addr.district ? `Kec. ${addr.district}` : '',
		addr.city,
		addr.province,
		addr.postalCode
	].filter(Boolean);
	return parts.join(', ');
}

/**
 * Menyimpan data URL gambar ke static/products/uploads saat lokal,
 * atau mengembalikan data URL terkompresi jika filesystem read-only (Vercel)
 */
async function persistUploadedDataUrl(dataUrl, slug) {
	const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,(.+)$/i);
	if (!match) return dataUrl;

	const rawExt = match[1].toLowerCase();
	const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
	const base64Body = match[2];

	try {
		const uploadDir = path.join(process.cwd(), 'static', 'products', 'uploads');
		await fs.mkdir(uploadDir, { recursive: true });
		const fileName = `${slug}-${Date.now()}.${ext}`;
		const filePath = path.join(uploadDir, fileName);
		await fs.writeFile(filePath, Buffer.from(base64Body, 'base64'));
		return `/products/uploads/${fileName}`;
	} catch {
		// Pada lingkungan serverless read-only (Vercel), simpan langsung sebagai data URL di kolom TEXT
		return dataUrl;
	}
}

export async function load({ locals }) {
	const [
		allCategories,
		allProducts,
		allVariants,
		allImages,
		allOrders,
		allOrderItems,
		allUsers,
		allAddresses
	] = await Promise.all([
		db.select().from(categories).orderBy(asc(categories.id)),
		db.select().from(products).orderBy(desc(products.id)),
		db.select().from(productVariants).orderBy(asc(productVariants.id)),
		db.select().from(productImages).where(eq(productImages.isPrimary, true)),
		db.select().from(orders).orderBy(desc(orders.createdAt)),
		db.select().from(orderItems),
		db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				whatsapp: users.whatsapp,
				role: users.role,
				createdAt: users.createdAt
			})
			.from(users)
			.orderBy(desc(users.createdAt)),
		db.select().from(addresses)
	]);

	const userMap = new Map(allUsers.map((u) => [u.id, u]));
	const catMap = new Map(allCategories.map((c) => [c.id, c]));
	const imgMap = new Map(allImages.map((img) => [img.productId, img.url]));
	const addressById = new Map(allAddresses.map((a) => [a.id, a]));

	const addressesByUser = new Map();
	for (const a of allAddresses) {
		if (!addressesByUser.has(a.userId)) addressesByUser.set(a.userId, []);
		addressesByUser.get(a.userId).push(a);
	}

	const variantsByProduct = new Map();
	for (const v of allVariants) {
		if (!variantsByProduct.has(v.productId)) variantsByProduct.set(v.productId, []);
		variantsByProduct.get(v.productId).push(v);
	}

	const itemsByOrder = new Map();
	for (const it of allOrderItems) {
		if (!itemsByOrder.has(it.orderId)) itemsByOrder.set(it.orderId, []);
		itemsByOrder.get(it.orderId).push(it);
	}

	const validRevenueStatuses = new Set(['paid', 'processing', 'shipped', 'completed']);
	let totalRevenue = 0;
	let totalPaidOrders = 0;
	let pendingActionOrders = 0;

	const statusBreakdown = {
		pending_payment: { count: 0, amount: 0 },
		paid: { count: 0, amount: 0 },
		processing: { count: 0, amount: 0 },
		shipped: { count: 0, amount: 0 },
		completed: { count: 0, amount: 0 },
		cancelled: { count: 0, amount: 0 },
		expired: { count: 0, amount: 0 }
	};

	const productSalesMap = new Map();
	const customerStatsMap = new Map();

	for (const order of allOrders) {
		const st = order.status || 'pending_payment';
		if (statusBreakdown[st]) {
			statusBreakdown[st].count += 1;
			statusBreakdown[st].amount += order.totalAmount || 0;
		}

		if (st === 'paid' || st === 'processing') {
			pendingActionOrders += 1;
		}

		const cStat = customerStatsMap.get(order.userId) || { totalOrders: 0, totalSpent: 0 };
		cStat.totalOrders += 1;
		if (validRevenueStatuses.has(st)) {
			cStat.totalSpent += order.totalAmount || 0;
		}
		customerStatsMap.set(order.userId, cStat);

		if (validRevenueStatuses.has(st)) {
			totalRevenue += order.totalAmount || 0;
			totalPaidOrders += 1;

			const oItems = itemsByOrder.get(order.id) || [];
			for (const it of oItems) {
				const key = it.productNameSnapshot;
				const prev = productSalesMap.get(key) || {
					productName: key,
					unitsSold: 0,
					revenue: 0,
					orderCount: 0
				};
				prev.unitsSold += it.quantity || 0;
				prev.revenue += it.subtotal || 0;
				prev.orderCount += 1;
				productSalesMap.set(key, prev);
			}
		}
	}

	const productSalesReport = Array.from(productSalesMap.values()).sort(
		(a, b) => b.revenue - a.revenue
	);

	const enrichedOrders = allOrders.map((o) => {
		const linkedAddr = o.addressId ? addressById.get(o.addressId) : null;
		const userSavedAddrs = addressesByUser.get(o.userId) || [];
		const fallbackAddr = linkedAddr || userSavedAddrs[0] || null;
		const resolvedAddress =
			o.shippingAddress ||
			o.shippingAddressSnapshot ||
			formatAddressRecord(fallbackAddr) ||
			'Alamat pengiriman belum dilengkapi';

		return {
			...o,
			resolvedAddress,
			customer: userMap.get(o.userId) || { name: 'Pelanggan', email: '-', whatsapp: '-' },
			items: itemsByOrder.get(o.id) || []
		};
	});

	const customers = allUsers
		.filter((u) => u.role !== 'admin')
		.map((u) => {
			const uAddrs = addressesByUser.get(u.id) || [];
			const stats = customerStatsMap.get(u.id) || { totalOrders: 0, totalSpent: 0 };
			return {
				...u,
				primaryAddress: formatAddressRecord(uAddrs[0]) || 'Belum menyimpan alamat',
				addressCount: uAddrs.length,
				totalOrders: stats.totalOrders,
				totalSpent: stats.totalSpent
			};
		});

	const enrichedProducts = allProducts.map((p) => {
		const vars = variantsByProduct.get(p.id) || [];
		const totalStock = vars.reduce((sum, v) => sum + (v.stock || 0), 0);
		return {
			...p,
			categoryName: catMap.get(p.categoryId)?.name || 'Umum',
			primaryImage: imgMap.get(p.id) || vars[0]?.imageUrl || '/products/placeholder.svg',
			variants: vars,
			totalStock
		};
	});

	const productCountByCategory = new Map();
	for (const p of allProducts) {
		productCountByCategory.set(p.categoryId, (productCountByCategory.get(p.categoryId) || 0) + 1);
	}

	return {
		admin: locals.user,
		summary: {
			totalRevenue,
			totalOrders: allOrders.length,
			totalPaidOrders,
			pendingActionOrders,
			totalProducts: allProducts.length,
			totalCustomers: customers.length,
			lowStockVariants: allVariants.filter((v) => v.stock <= 5).length
		},
		statusBreakdown,
		productSalesReport,
		orders: enrichedOrders,
		customers,
		categories: allCategories.map((c) => ({
			...c,
			productCount: productCountByCategory.get(c.id) || 0
		})),
		products: enrichedProducts
	};
}

export const actions = {
	createCategory: async ({ request }) => {
		const fd = await request.formData();
		const name = String(fd.get('name') || '').trim();
		const rawSlug = String(fd.get('slug') || '').trim();
		const description = String(fd.get('description') || '').trim();

		if (name.length < 2) {
			return fail(400, { tab: 'categories', error: 'Nama kategori minimal 2 karakter.' });
		}

		const slug = slugify(rawSlug || name);
		const existing = await db
			.select({ id: categories.id })
			.from(categories)
			.where(eq(categories.slug, slug))
			.limit(1);

		if (existing.length > 0) {
			return fail(409, {
				tab: 'categories',
				error: `Slug kategori "${slug}" sudah digunakan. Gunakan nama lain.`
			});
		}

		await db.insert(categories).values({
			name,
			slug,
			description: description || `Koleksi ${name} resmi SEMAT.`
		});

		return { tab: 'categories', success: `Kategori "${name}" berhasil ditambahkan.` };
	},

	deleteCategory: async ({ request }) => {
		const fd = await request.formData();
		const categoryId = Number(fd.get('categoryId'));

		const used = await db
			.select({ id: products.id })
			.from(products)
			.where(eq(products.categoryId, categoryId))
			.limit(1);

		if (used.length > 0) {
			return fail(400, {
				tab: 'categories',
				error: 'Kategori tidak dapat dihapus karena masih memiliki produk.'
			});
		}

		await db.delete(categories).where(eq(categories.id, categoryId));
		return { tab: 'categories', success: 'Kategori berhasil dihapus.' };
	},

	createProduct: async ({ request }) => {
		let createdProductId = null;
		try {
			const fd = await request.formData();
			const categoryId = Number(fd.get('categoryId'));
			const name = String(fd.get('name') || '').trim();
			const rawSlug = String(fd.get('slug') || '').trim();
			const subtitle = String(fd.get('subtitle') || '').trim();
			const description = String(fd.get('description') || '').trim();
			const productType = String(fd.get('productType') || 'vertikal').trim();
			const cardSizeSpec = String(fd.get('cardSizeSpec') || 'CR80 (85.6 × 54 mm)').trim();
			const material = String(fd.get('material') || '').trim();
			const basePrice = Number(fd.get('basePrice') || 0);
			const isFeatured = fd.get('isFeatured') === 'on';

			const colorName = String(fd.get('colorName') || '').trim();
			const colorHex = String(fd.get('colorHex') || '#1F1E1B').trim();
			const sku = String(fd.get('sku') || '').trim().toUpperCase();
			const stock = Math.max(0, Number(fd.get('stock') || 0));
			const priceDelta = Number(fd.get('priceDelta') || 0);

			const imageMode = String(fd.get('imageMode') || 'upload').trim();
			const uploadedImageData = String(fd.get('uploadedImageData') || '').trim();
			const customImageUrl = String(fd.get('customImageUrl') || '').trim();
			const presetImageUrl = String(
				fd.get('presetImageUrl') || '/products/kulit-vertikal-tan.svg'
			).trim();

			if (!categoryId || name.length < 3 || !material || basePrice <= 0) {
				return fail(400, {
					tab: 'products',
					error: 'Kategori, nama produk, material, dan harga dasar wajib diisi dengan benar.'
				});
			}
			if (!colorName || !sku) {
				return fail(400, {
					tab: 'products',
					error: 'Nama warna varian pertama dan kode SKU wajib diisi.'
				});
			}

			const slug = slugify(rawSlug || name);

			let finalImageUrl = presetImageUrl;
			if (imageMode === 'upload') {
				if (!uploadedImageData.startsWith('data:image/')) {
					return fail(400, {
						tab: 'products',
						error: 'Silakan pilih file gambar produk terlebih dahulu sampai pratinjau muncul.'
					});
				}
				finalImageUrl = await persistUploadedDataUrl(uploadedImageData, slug);
			} else if (imageMode === 'url') {
				if (
					!customImageUrl ||
					(!customImageUrl.startsWith('http://') &&
						!customImageUrl.startsWith('https://') &&
						!customImageUrl.startsWith('/'))
				) {
					return fail(400, {
						tab: 'products',
						error: 'Masukkan tautan URL gambar yang valid (diawali https:// atau /).'
					});
				}
				finalImageUrl = customImageUrl;
			}

			const dupSlug = await db
				.select({ id: products.id })
				.from(products)
				.where(eq(products.slug, slug))
				.limit(1);

			if (dupSlug.length > 0) {
				return fail(409, {
					tab: 'products',
					error: `Slug produk "${slug}" sudah dipakai. Hapus produk lama di daftar kanan atau ubah nama produk.`
				});
			}

			const dupSku = await db
				.select({ id: productVariants.id })
				.from(productVariants)
				.where(eq(productVariants.sku, sku))
				.limit(1);

			if (dupSku.length > 0) {
				return fail(409, {
					tab: 'products',
					error: `Kode SKU "${sku}" sudah terdaftar pada produk lain.`
				});
			}

			await db.execute(sql`ALTER TABLE product_images ALTER COLUMN url TYPE text`);
			await db.execute(sql`ALTER TABLE product_variants ALTER COLUMN image_url TYPE text`);

			const [createdProduct] = await db
				.insert(products)
				.values({
					categoryId,
					name,
					slug,
					subtitle: subtitle || `${name} — ${material}`,
					description:
						description ||
						`${name} dirancang presisi untuk ukuran ${cardSizeSpec} menggunakan material ${material}.`,
					productType,
					cardSizeSpec,
					material,
					basePrice,
					isActive: true,
					isFeatured
				})
				.returning();

			createdProductId = createdProduct.id;

			await db.insert(productVariants).values({
				productId: createdProduct.id,
				name: colorName,
				colorName,
				colorHex,
				sku,
				stock,
				priceDelta,
				imageUrl: finalImageUrl
			});

			await db.insert(productImages).values({
				productId: createdProduct.id,
				url: finalImageUrl,
				altText: `${name} — ${colorName}`,
				isPrimary: true
			});

			return {
				tab: 'products',
				success: `Produk baru "${name}" beserta gambar katalognya berhasil ditambahkan.`
			};
		} catch (err) {
			if (createdProductId) {
				await db.delete(products).where(eq(products.id, createdProductId)).catch(() => {});
			}
			console.error('createProduct error:', err);
			return fail(400, {
				tab: 'products',
				error: `Gagal menyimpan produk: ${err?.message || 'Terjadi kesalahan pada server.'}`
			});
		}
	},

	deleteProduct: async ({ request }) => {
		try {
			const fd = await request.formData();
			const productId = Number(fd.get('productId'));

			if (!productId) {
				return fail(400, { tab: 'products', error: 'ID produk tidak valid.' });
			}

			await db.execute(sql`ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL`);
			await db.execute(sql`ALTER TABLE order_items ALTER COLUMN variant_id DROP NOT NULL`);

			const variantRows = await db
				.select({ id: productVariants.id })
				.from(productVariants)
				.where(eq(productVariants.productId, productId));
			const variantIds = variantRows.map((v) => v.id);

			await db
				.update(orderItems)
				.set({ productId: null, variantId: null })
				.where(eq(orderItems.productId, productId));

			if (variantIds.length > 0) {
				await db
					.update(orderItems)
					.set({ variantId: null })
					.where(inArray(orderItems.variantId, variantIds));
				await db.delete(cartItems).where(inArray(cartItems.variantId, variantIds));
			}

			await db.delete(cartItems).where(eq(cartItems.productId, productId));
			await db.delete(wishlists).where(eq(wishlists.productId, productId));
			await db.delete(productImages).where(eq(productImages.productId, productId));
			await db.delete(productVariants).where(eq(productVariants.productId, productId));
			await db.delete(products).where(eq(products.id, productId));

			return {
				tab: 'products',
				success: 'Produk beserta seluruh variannya berhasil dihapus permanen dari katalog.'
			};
		} catch (err) {
			console.error('deleteProduct error:', err);
			return fail(400, {
				tab: 'products',
				error: `Gagal menghapus produk: ${err?.message || 'Terjadi kendala database.'}`
			});
		}
	},

	updateVariantStock: async ({ request }) => {
		const fd = await request.formData();
		const variantId = Number(fd.get('variantId'));
		const stock = Math.max(0, Number(fd.get('stock') || 0));

		await db.update(productVariants).set({ stock }).where(eq(productVariants.id, variantId));

		return { tab: 'products', success: 'Stok varian berhasil diperbarui.' };
	},

	toggleProductActive: async ({ request }) => {
		const fd = await request.formData();
		const productId = Number(fd.get('productId'));
		const nextActive = fd.get('nextActive') === 'true';

		await db.update(products).set({ isActive: nextActive }).where(eq(products.id, productId));

		return {
			tab: 'products',
			success: nextActive
				? 'Produk diaktifkan kembali di katalog.'
				: 'Produk disembunyikan dari katalog.'
		};
	},

	updateOrderStatus: async ({ request }) => {
		const fd = await request.formData();
		const orderId = Number(fd.get('orderId'));
		const status = String(fd.get('status') || '').trim();
		const trackingNumber = String(fd.get('trackingNumber') || '').trim();

		if (!orderId || !status) {
			return fail(400, { tab: 'orders', error: 'Data pesanan tidak valid.' });
		}

		await db
			.update(orders)
			.set({
				status,
				trackingNumber: trackingNumber || null
			})
			.where(eq(orders.id, orderId));

		return { tab: 'orders', success: 'Status pesanan dan nomor resi berhasil diperbarui.' };
	}
};