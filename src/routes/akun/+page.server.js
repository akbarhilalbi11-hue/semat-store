import { fail, redirect } from '@sveltejs/kit';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import {
	users,
	addresses,
	orders,
	orderItems,
	productVariants
} from '#lib/server/db/schema.js';

function formatOrderAddress(order) {
	if (!order) return '';
	if (order.shippingAddress) return order.shippingAddress;
	return [
		order.shippingAddressDetail,
		order.shippingDistrict && order.shippingDistrict !== '-'
			? `Kec. ${order.shippingDistrict}`
			: '',
		order.shippingCity,
		order.shippingProvince,
		order.shippingPostalCode && order.shippingPostalCode !== '-'
			? order.shippingPostalCode
			: ''
	]
		.filter(Boolean)
		.join(', ');
}

function extractPaymentMethod(order) {
	if (!order) return 'QRIS / Virtual Account';
	if (order.paymentMethod) return order.paymentMethod;
	const match = String(order.notes || '').match(/Metode:\s*([^|]+)/i);
	return match ? match[1].trim() : 'QRIS / Virtual Account';
}

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/masuk?redirect=/akun');
	}

	const [profileRows, userAddresses, rawOrders] = await Promise.all([
		db.select().from(users).where(eq(users.id, locals.user.id)).limit(1),
		db.select().from(addresses).where(eq(addresses.userId, locals.user.id)),
		db.select().from(orders).where(eq(orders.userId, locals.user.id))
	]);

	const profile = profileRows[0] || locals.user;

	// Tandai otomatis pesanan pending_payment yang sudah melewati batas waktu
	const nowMs = Date.now();
	for (const ord of rawOrders) {
		if (
			ord.status === 'pending_payment' &&
			ord.expiresAt &&
			new Date(ord.expiresAt).getTime() < nowMs
		) {
			await db
				.update(orders)
				.set({ status: 'expired', updatedAt: new Date() })
				.where(eq(orders.id, ord.id));
			ord.status = 'expired';
		}
	}

	const orderIds = rawOrders.map((o) => o.id);
	const allOrderItems =
		orderIds.length > 0
			? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
			: [];

	const itemsByOrder = new Map();
	for (const item of allOrderItems) {
		const list = itemsByOrder.get(item.orderId) || [];
		list.push(item);
		itemsByOrder.set(item.orderId, list);
	}

	const userOrders = rawOrders
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.map((ord) => ({
			...ord,
			resolvedAddress: formatOrderAddress(ord),
			paymentMethod: extractPaymentMethod(ord),
			items: itemsByOrder.get(ord.id) || []
		}));

	const validStatuses = new Set(['paid', 'processing', 'shipped', 'completed']);
	const totalSpent = userOrders
		.filter((o) => validStatuses.has(o.status))
		.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

	const activeOrdersCount = userOrders.filter((o) =>
		['pending_payment', 'paid', 'processing', 'shipped'].includes(o.status)
	).length;

	return {
		profile: {
			id: profile.id,
			name: profile.name,
			email: profile.email,
			whatsapp: profile.whatsapp || '',
			createdAt: profile.createdAt
		},
		addresses: userAddresses,
		orders: userOrders,
		stats: {
			totalOrders: userOrders.length,
			activeOrdersCount,
			totalSpent
		}
	};
}

export const actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/masuk?redirect=/akun');

		const fd = await request.formData();
		const name = String(fd.get('name') || '').trim();
		const whatsapp = String(fd.get('whatsapp') || '').trim();

		if (!name) {
			return fail(400, { tab: 'profile', error: 'Nama lengkap wajib diisi.' });
		}

		await db
			.update(users)
			.set({
				name,
				whatsapp: whatsapp || null
			})
			.where(eq(users.id, locals.user.id));

		return {
			tab: 'profile',
			success: 'Informasi profil berhasil diperbarui.'
		};
	},

	addAddress: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/masuk?redirect=/akun');

		const fd = await request.formData();
		const label = String(fd.get('label') || 'Rumah / Kantor').trim();
		const recipientName = String(fd.get('recipientName') || '').trim();
		const recipientPhone = String(fd.get('recipientPhone') || '').trim();
		const addressDetail = String(fd.get('addressDetail') || '').trim();
		const district = String(fd.get('district') || '').trim();
		const city = String(fd.get('city') || '').trim();
		const province = String(fd.get('province') || '').trim();
		const postalCode = String(fd.get('postalCode') || '').trim();

		if (!recipientName || !recipientPhone || !addressDetail || !city || !province) {
			return fail(400, {
				tab: 'addresses',
				error: 'Nama penerima, nomor WhatsApp, alamat lengkap, kota, dan provinsi wajib diisi.'
			});
		}

		await db.insert(addresses).values({
			userId: locals.user.id,
			label,
			recipientName,
			recipientPhone,
			addressDetail,
			district: district || '-',
			city,
			province,
			postalCode: postalCode || '-',
			latitude: -6.3465,
			longitude: 106.7442
		});

		return {
			tab: 'addresses',
			success: 'Alamat baru berhasil ditambahkan ke buku alamat.'
		};
	},

	deleteAddress: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/masuk?redirect=/akun');

		const fd = await request.formData();
		const addressId = Number(fd.get('addressId'));
		if (!addressId) {
			return fail(400, { tab: 'addresses', error: 'ID alamat tidak valid.' });
		}

		await db
			.delete(addresses)
			.where(and(eq(addresses.id, addressId), eq(addresses.userId, locals.user.id)));

		return {
			tab: 'addresses',
			success: 'Alamat berhasil dihapus.'
		};
	},

	confirmReceived: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/masuk?redirect=/akun');

		const fd = await request.formData();
		const orderId = Number(fd.get('orderId'));

		const [order] = await db
			.select()
			.from(orders)
			.where(and(eq(orders.id, orderId), eq(orders.userId, locals.user.id)))
			.limit(1);

		if (!order) {
			return fail(404, { tab: 'orders', error: 'Pesanan tidak ditemukan.' });
		}

		if (order.status !== 'shipped') {
			return fail(400, {
				tab: 'orders',
				error: 'Hanya pesanan berstatus Dalam Pengiriman yang dapat dikonfirmasi selesai.'
			});
		}

		const now = new Date();
		await db
			.update(orders)
			.set({
				status: 'completed',
				completedAt: now,
				updatedAt: now
			})
			.where(eq(orders.id, order.id));

		return {
			tab: 'orders',
			success: `Pesanan ${order.invoiceNumber} telah dikonfirmasi diterima dan selesai.`
		};
	},

	cancelOrder: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/masuk?redirect=/akun');

		const fd = await request.formData();
		const orderId = Number(fd.get('orderId'));

		const [order] = await db
			.select()
			.from(orders)
			.where(and(eq(orders.id, orderId), eq(orders.userId, locals.user.id)))
			.limit(1);

		if (!order) {
			return fail(404, { tab: 'orders', error: 'Pesanan tidak ditemukan.' });
		}

		if (order.status !== 'pending_payment') {
			return fail(400, {
				tab: 'orders',
				error: 'Pesanan yang sudah dibayar atau diproses tidak dapat dibatalkan.'
			});
		}

		// Kembalikan stok varian produk yang sebelumnya dikunci
		const items = await db
			.select()
			.from(orderItems)
			.where(eq(orderItems.orderId, order.id));

		for (const item of items) {
			if (item.variantId) {
				await db
					.update(productVariants)
					.set({
						stock: sql`${productVariants.stock} + ${item.quantity}`
					})
					.where(eq(productVariants.id, item.variantId));
			}
		}

		const now = new Date();
		await db
			.update(orders)
			.set({
				status: 'cancelled',
				cancelledAt: now,
				updatedAt: now
			})
			.where(eq(orders.id, order.id));

		return {
			tab: 'orders',
			success: `Pesanan ${order.invoiceNumber} dibatalkan dan stok produk telah dikembalikan.`
		};
	}
};