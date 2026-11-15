<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-svelte';
	import { formatRupiah } from '#lib/utils/format.js';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';

	let { cart = { items: [], totalQuantity: 0, subtotal: 0 }, user = null } = $props();
	let busyItemId = $state(null);

	async function changeQuantity(itemId, nextQty) {
		if (busyItemId !== null) return;
		busyItemId = itemId;
		try {
			const res = await fetch('/api/cart', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ itemId, quantity: nextQty })
			});
			const result = await res.json();
			if (res.ok && result.ok) {
				await invalidateAll();
			} else {
				shopUI.notify(result.message || 'Gagal memperbarui keranjang.', 'warning');
			}
		} finally {
			busyItemId = null;
		}
	}

	function proceedToCheckout() {
		if (typeof window !== 'undefined' && window.bootstrap) {
			const el = document.getElementById('miniCartOffcanvas');
			if (el) window.bootstrap.Offcanvas.getOrCreateInstance(el).hide();
		}

		if (!user) {
			shopUI.notify('Silakan masuk atau daftar terlebih dahulu. Keranjang Anda akan otomatis digabung.');
			goto('/masuk?redirect=/checkout');
			return;
		}
		goto('/checkout');
	}
</script>

<div
	class="offcanvas offcanvas-end"
	tabindex="-1"
	id="miniCartOffcanvas"
	aria-labelledby="miniCartOffcanvasLabel"
>
	<div class="offcanvas-header hairline-bottom">
		<div>
			<span class="catalog-kicker d-block">Ringkasan Belanja ({cart.totalQuantity} item)</span>
			<h5 class="offcanvas-title font-heading fw-semibold mb-0" id="miniCartOffcanvasLabel">
				Keranjang Anda
			</h5>
		</div>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup keranjang"></button>
	</div>

	<div class="offcanvas-body d-flex flex-column justify-content-between p-0">
		{#if !cart.items || cart.items.length === 0}
			<div class="my-auto text-center px-4 py-5">
				<div class="surface-subtle d-inline-flex p-3 mb-3">
					<ShoppingBag size={24} strokeWidth={1.5} class="text-secondary-warm" />
				</div>
				<h6 class="font-heading fw-semibold mb-2">Keranjang masih kosong</h6>
				<p class="small text-secondary-warm mb-4">
					Pilih holder kulit nabati, casing akrilik B2, atau paket lanyard untuk kebutuhan kantor dan panitia acara.
				</p>
				<a
					href="/katalog"
					class="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
					data-bs-dismiss="offcanvas"
				>
					<span>Lihat Katalog Produk</span>
					<ArrowRight size={15} />
				</a>
			</div>
		{:else}
			<div class="overflow-auto p-3 d-flex flex-column gap-2.5 flex-grow-1">
				{#each cart.items as item (item.id)}
					<div class="surface-card p-2.5 d-flex gap-2.5 align-items-start">
						<img
							src={item.imageUrl}
							alt={item.productName}
							class="rounded border object-fit-cover flex-shrink-0"
							style="width: 64px; height: 64px; background-color: var(--bg-subtle);"
						/>
						<div class="min-w-0 flex-grow-1">
							<div class="d-flex justify-content-between align-items-start gap-1">
								<a
									href="/produk/{item.productSlug}"
									class="small fw-semibold text-dark text-decoration-none text-truncate"
									data-bs-dismiss="offcanvas"
								>
									{item.productName}
								</a>
								<button
									type="button"
									class="btn btn-sm p-0 text-secondary-warm"
									disabled={busyItemId === item.id}
									onclick={() => changeQuantity(item.id, 0)}
									aria-label="Hapus {item.productName}"
								>
									<Trash2 size={14} />
								</button>
							</div>

							<div class="d-flex align-items-center gap-1.5 small text-secondary-warm mb-2" style="font-size: 0.75rem;">
								<span
									class="rounded-circle border"
									style="width: 10px; height: 10px; background-color: {item.colorHex}; display: inline-block;"
								></span>
								<span>{item.variantName}</span>
							</div>

							<div class="d-flex justify-content-between align-items-center">
								<div class="btn-group btn-group-sm" role="group">
									<button
										type="button"
										class="btn btn-outline-hairline px-2 py-0"
										disabled={busyItemId === item.id}
										onclick={() => changeQuantity(item.id, item.quantity - 1)}
										aria-label="Kurangi jumlah"
									>
										<Minus size={12} />
									</button>
									<span class="btn btn-outline-hairline px-2.5 py-0 price-tabular disabled text-dark opacity-100" style="font-size: 0.78rem;">
										{item.quantity}
									</span>
									<button
										type="button"
										class="btn btn-outline-hairline px-2 py-0"
										disabled={busyItemId === item.id || item.quantity >= item.stock}
										onclick={() => changeQuantity(item.id, item.quantity + 1)}
										aria-label="Tambah jumlah"
									>
										<Plus size={12} />
									</button>
								</div>

								<span class="price-tabular small">{formatRupiah(item.lineTotal)}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="p-3 hairline-top" style="background-color: var(--bg-surface);">
				<div class="d-flex justify-content-between align-items-center mb-1">
					<span class="small text-secondary-warm">Subtotal Produk</span>
					<span class="price-tabular fs-5">{formatRupiah(cart.subtotal)}</span>
				</div>
				<p class="small text-secondary-warm mb-3" style="font-size: 0.75rem;">
					Ongkos kirim dihitung otomatis berdasarkan jarak peta saat checkout.
				</p>
				<button
					type="button"
					class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
					onclick={proceedToCheckout}
				>
					<span>{user ? 'Lanjut ke Checkout' : 'Masuk & Lanjut Checkout'}</span>
					<ArrowRight size={16} />
				</button>
			</div>
		{/if}
	</div>
</div>