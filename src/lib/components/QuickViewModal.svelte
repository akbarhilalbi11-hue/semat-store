<script>
	import { ArrowUpRight, CheckCircle2, XCircle } from 'lucide-svelte';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';
	import { formatRupiah, formatProductType } from '#lib/utils/format.js';

	let product = $derived(shopUI.quickViewProduct);
	let selectedVariantId = $state(null);

	$effect(() => {
		if (product?.variants?.length) {
			selectedVariantId = product.variants[0].id;
		} else {
			selectedVariantId = null;
		}
	});

	let activeVariant = $derived(
		product?.variants?.find((v) => v.id === selectedVariantId) || product?.variants?.[0] || null
	);

	let currentPrice = $derived(
		product ? product.basePrice + (activeVariant?.priceDelta || 0) : 0
	);

	let currentImage = $derived(
		activeVariant?.imageUrl || product?.primaryImage || '/products/placeholder.svg'
	);

	function closeModal() {
		if (typeof window !== 'undefined' && window.bootstrap) {
			const el = document.getElementById('quickViewModal');
			if (el) window.bootstrap.Modal.getOrCreateInstance(el).hide();
		}
	}
</script>

<div
	class="modal fade"
	id="quickViewModal"
	tabindex="-1"
	aria-labelledby="quickViewModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header hairline-bottom">
				<div>
					<span class="catalog-kicker d-block">Pratinjau Spesifikasi</span>
					<h5 class="modal-title font-heading fw-semibold mb-0" id="quickViewModalLabel">
						{product?.name || 'Detail Produk'}
					</h5>
				</div>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup pratinjau"></button>
			</div>

			{#if product}
				<div class="modal-body p-4">
					<div class="row g-4 align-items-start">
						<div class="col-12 col-md-5">
							<div class="surface-subtle overflow-hidden" style="aspect-ratio: 1 / 1;">
								<img
									src={currentImage}
									alt={product.name}
									class="w-100 h-100 object-fit-cover"
									onerror={(e) => {
										e.currentTarget.src = '/products/placeholder.svg';
									}}
								/>
							</div>
						</div>

						<div class="col-12 col-md-7">
							<div class="d-flex flex-wrap gap-2 mb-2">
								<span class="badge bg-light text-dark border">{product.category?.name}</span>
								<span class="badge bg-light text-dark border">{formatProductType(product.productType)}</span>
							</div>

							<p class="price-tabular fs-4 mb-2">{formatRupiah(currentPrice)}</p>
							<p class="small text-secondary-warm mb-3">{product.description}</p>

							<div class="surface-subtle p-3 mb-3 small">
								<div class="d-flex justify-content-between py-1 hairline-bottom">
									<span class="text-secondary-warm">Material</span>
									<span class="fw-medium text-end">{product.material}</span>
								</div>
								<div class="d-flex justify-content-between pt-1">
									<span class="text-secondary-warm">Ukuran Kartu</span>
									<span class="fw-medium text-end">{product.cardSizeSpec}</span>
								</div>
							</div>

							{#if product.variants?.length > 0}
								<div class="mb-3">
									<label class="form-label small text-secondary-warm d-block">
										Varian Warna: <strong class="text-dark">{activeVariant?.colorName}</strong>
									</label>
									<div class="d-flex flex-wrap gap-2">
										{#each product.variants as v}
											<button
												type="button"
												class="btn btn-sm d-inline-flex align-items-center gap-2 {activeVariant?.id === v.id
													? 'btn-primary'
													: 'btn-outline-hairline'}"
												onclick={() => (selectedVariantId = v.id)}
											>
												<span
													class="rounded-circle border"
													style="width: 12px; height: 12px; background-color: {v.colorHex}; display: inline-block;"
												></span>
												<span>{v.colorName}</span>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<div class="d-flex align-items-center gap-2 small mb-4">
								{#if (activeVariant?.stock ?? 0) > 0}
									<CheckCircle2 size={16} class="text-success" />
									<span>Tersedia {activeVariant.stock} unit (SKU: {activeVariant.sku})</span>
								{:else}
									<XCircle size={16} class="text-danger" />
									<span class="text-danger">Varian ini sedang habis</span>
								{/if}
							</div>

							<div class="d-flex flex-wrap gap-2">
								<a
									href="/produk/{product.slug}"
									class="btn btn-primary d-inline-flex align-items-center gap-2"
									onclick={closeModal}
								>
									<span>Buka Halaman Produk Lengkap</span>
									<ArrowUpRight size={16} />
								</a>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>