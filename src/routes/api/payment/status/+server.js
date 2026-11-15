import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { orders } from '#lib/server/db/schema.js';

const NO_CACHE_HEADERS = {
	'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
	Pragma: 'no-cache',
	Expires: '0'
};

export async function GET({ url }) {
	const invoice = url.searchParams.get('invoice')?.trim();
	if (!invoice) {
		return json(
			{ ok: false, error: 'Parameter invoice wajib diisi.' },
			{ status: 400, headers: NO_CACHE_HEADERS }
		);
	}

	const [order] = await db
		.select({
			id: orders.id,
			invoiceNumber: orders.invoiceNumber,
			status: orders.status,
			totalAmount: orders.totalAmount,
			paidAt: orders.paidAt,
			expiresAt: orders.expiresAt
		})
		.from(orders)
		.where(eq(orders.invoiceNumber, invoice))
		.limit(1);

	if (!order) {
		return json(
			{ ok: false, error: 'Invoice tidak ditemukan.' },
			{ status: 404, headers: NO_CACHE_HEADERS }
		);
	}

	if (
		order.status === 'pending_payment' &&
		order.expiresAt &&
		new Date(order.expiresAt).getTime() < Date.now()
	) {
		await db
			.update(orders)
			.set({ status: 'expired', updatedAt: new Date() })
			.where(eq(orders.id, order.id));

		return json(
			{
				ok: true,
				invoiceNumber: order.invoiceNumber,
				status: 'expired',
				totalAmount: order.totalAmount,
				paidAt: null,
				expiresAt: order.expiresAt
			},
			{ headers: NO_CACHE_HEADERS }
		);
	}

	return json(
		{
			ok: true,
			invoiceNumber: order.invoiceNumber,
			status: order.status,
			totalAmount: order.totalAmount,
			paidAt: order.paidAt,
			expiresAt: order.expiresAt
		},
		{ headers: NO_CACHE_HEADERS }
	);
}