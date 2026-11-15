<script>
	import { CheckCircle2, QrCode, ShieldCheck, AlertCircle } from 'lucide-svelte';
	import { formatRupiah } from '#lib/utils/format.js';

	let { data } = $props();
	let order = $state(data.order);
	let isProcessing = $state(false);
	let errorMsg = $state('');

	async function authorizeQrisPayment() {
		isProcessing = true;
		errorMsg = '';
		try {
			const res = await fetch('/api/payment/webhook', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					order_id: order.invoiceNumber,
					gross_amount: order.totalAmount,
					transaction_status: 'settlement'
				})
			});
			const result = await res.json();
			if (!res.ok || !result.ok) {
				errorMsg = result.error || 'Gagal memvalidasi pembayaran.';
			} else {
				order = { ...order, status: 'paid' };
			}
		} catch {
			errorMsg = 'Koneksi jaringan terputus saat memverifikasi pembayaran.';
		} finally {
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Otorisasi QRIS {order.invoiceNumber} — SEMAT</title>
</svelte:head>

<section class="py-5">
	<div class="container" style="max-width: 440px;">
		<div class="surface-card p-4">
			<div class="d-flex justify-content-between align-items-center pb-3 mb-3 hairline-bottom">
				<div class="d-flex align-items-center gap-2">
					<QrCode size={18} />
					<strong class="font-heading">QRIS Payment Gateway</strong>
				</div>
				<span class="badge btn-taupe">NMID: ID1026384920192</span>
			</div>

			{#if order.status === 'paid'}
				<div class="text-center py-4">
					<div
						class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
						style="width: 54px; height: 54px; background-color: var(--status-success-bg); color: var(--status-success-text);"
					>
						<CheckCircle2 size={28} />
					</div>
					<h1 class="h4 font-heading fw-bold mb-1">Pembayaran Terverifikasi</h1>
					<p class="small text-secondary-warm mb-3">
						Transaksi <strong>{order.invoiceNumber}</strong> sebesar <strong>{formatRupiah(order.totalAmount)}</strong> telah otomatis dikonfirmasi ke halaman checkout.
					</p>
					<a href="/checkout?invoice={order.invoiceNumber}" class="btn btn-primary btn-sm w-100">
						Lihat Status Invoice
					</a>
				</div>
			{:else if order.status === 'expired' || order.status === 'cancelled'}
				<div class="text-center py-4">
					<AlertCircle size={32} class="text-danger mb-2" />
					<h1 class="h5 font-heading fw-bold mb-1">Tagihan Tidak Aktif</h1>
					<p class="small text-secondary-warm mb-0">
						Invoice {order.invoiceNumber} sudah kedaluwarsa atau dibatalkan.
					</p>
				</div>
			{:else}
				<div class="surface-subtle p-3 rounded mb-3">
					<span class="small text-secondary-warm d-block">Merchant Penerima</span>
					<strong class="d-block mb-2">SEMAT STUDIO INDONESIA</strong>
					<div class="d-flex justify-content-between align-items-center pt-2 hairline-top">
						<span class="small text-secondary-warm">Total Bayar</span>
						<span class="price-tabular fs-5 fw-bold">{formatRupiah(order.totalAmount)}</span>
					</div>
				</div>

				<div class="small mb-3">
					<span class="text-secondary-warm d-block mb-1">Invoice: <strong>{order.invoiceNumber}</strong></span>
					<span class="text-secondary-warm d-block">Pemesan: <strong>{order.recipientName}</strong></span>
				</div>

				{#if errorMsg}
					<div class="p-2.5 rounded mb-3 small" style="background-color: var(--status-danger-bg); color: var(--status-danger-text);">
						{errorMsg}
					</div>
				{/if}

				<button
					type="button"
					class="btn btn-primary w-100 py-2.5 d-inline-flex align-items-center justify-content-center gap-2"
					onclick={authorizeQrisPayment}
					disabled={isProcessing}
				>
					<ShieldCheck size={17} />
					<span>{isProcessing ? 'Memvalidasi ke Server...' : `Konfirmasi Bayar ${formatRupiah(order.totalAmount)}`}</span>
				</button>
			{/if}
		</div>
	</div>
</section>