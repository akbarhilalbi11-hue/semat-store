import crypto from 'node:crypto';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.js';
import { orders } from '#lib/server/db/schema.js';

export async function POST({ request }) {
	try {
		const payload = await request.json();
		const invoiceNumber = String(payload.order_id || payload.invoiceNumber || '').trim();
		const grossAmount = Number(payload.gross_amount || payload.amount || 0);
		const transactionStatus = String(
			payload.transaction_status || payload.status || 'settlement'
		).toLowerCase();

		if (!invoiceNumber) {
			return json({ ok: false, error: 'Nomor invoice tidak ditemukan.' }, { status: 400 });
		}

		// Validasi signature otomatis jika terhubung dengan Midtrans Server Key
		if (env.MIDTRANS_SERVER_KEY && payload.signature_key) {
			const rawSig = `${invoiceNumber}${payload.status_code}${payload.gross_amount}${env.MIDTRANS_SERVER_KEY}`;
			const expectedSig = crypto.createHash('sha512').update(rawSig).digest('hex');
			if (expectedSig !== payload.signature_key) {
				return json({ ok: false, error: 'Signature webhook tidak valid.' }, { status: 403 });
			}
		}

		const [order] = await db
			.select()
			.from(orders)
			.where(eq(orders.invoiceNumber, invoiceNumber))
			.limit(1);

		if (!order) {
			return json({ ok: false, error: 'Pesanan tidak ditemukan.' }, { status: 404 });
		}

		if (order.status === 'expired' || order.status === 'cancelled') {
			return json(
				{ ok: false, error: `Pesanan sudah berstatus ${order.status}.` },
				{ status: 400 }
			);
		}

		// Validasi otomatis kesesuaian nominal tagihan
		if (grossAmount > 0 && Math.round(grossAmount) !== Math.round(order.totalAmount)) {
			return json(
				{
					ok: false,
					error: `Nominal pembayaran (${grossAmount}) tidak cocok dengan tagihan (${order.totalAmount}).`
				},
				{ status: 400 }
			);
		}

		if (
			transactionStatus === 'settlement' ||
			transactionStatus === 'capture' ||
			transactionStatus === 'paid'
		) {
			if (order.status !== 'paid') {
				const now = new Date();
				await db
					.update(orders)
					.set({
						status: 'paid',
						paidAt: now,
						updatedAt: now
					})
					.where(eq(orders.id, order.id));
			}

			return json({
				ok: true,
				invoiceNumber: order.invoiceNumber,
				status: 'paid',
				message: 'Pembayaran berhasil tervalidasi otomatis.'
			});
		}

		return json({ ok: true, invoiceNumber: order.invoiceNumber, status: order.status });
	} catch (err) {
		console.error('Payment webhook error:', err);
		return json({ ok: false, error: 'Gagal memproses validasi pembayaran.' }, { status: 500 });
	}
}