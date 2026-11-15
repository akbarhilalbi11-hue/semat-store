import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { orders, orderItems } from '#lib/server/db/schema.js';

export async function load({ params }) {
	const invoice = String(params.invoice || '').trim();
	const [order] = await db
		.select()
		.from(orders)
		.where(eq(orders.invoiceNumber, invoice))
		.limit(1);

	if (!order) {
		throw error(404, 'Invoice pembayaran tidak ditemukan.');
	}

	const items = await db
		.select()
		.from(orderItems)
		.where(eq(orderItems.orderId, order.id));

	return { order, items };
}