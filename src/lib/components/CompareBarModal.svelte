<script>
	import { Scale, X, ArrowUpRight } from 'lucide-svelte';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';
	import { formatRupiah, formatProductType } from '#lib/utils/format.js';

	function closeCompareModal() {
		if (typeof window !== 'undefined' && window.bootstrap) {
			const el = document.getElementById('compareProductsModal');
			if (el) window.bootstrap.Modal.getOrCreateInstance(el).hide();
		}
	}
</script>

<!-- Bilah Mengambang di Bawah Layar saat ada 1–3 produk dipilih -->
{#if shopUI.compareList.length > 0}
	<div
		class="position-fixed bottom-0 start-0 end-0 p-2 p-md-3"
		style="z-index: 1030; pointer-events: none;"
	>
		<div class="container">
			<div
				class="surface-card p-2 p-md-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
				style="pointer-events: auto; box-shadow: var(--shadow-overlay); border-color: var(--border-strong);"
			>
				<div class="d-flex align-items-center gap-2 flex-wrap">
					<span class="badge btn-taupe d-inline-flex align-items-center gap-1 py-1.5 px-2.5">
						<Scale size={14} />
						<span>Bandingkan ({shopUI.compareList.length}/3)</span>
					</span>

					<div class="d-flex align-items-center gap-2 flex-wrap">
						{#each shopUI.compareList as item}
							<span class="badge bg-light text-dark border d-inline-flex align-items-center gap-1.5 py-1 px-2 fw-normal">
								<span class="text-truncate" style="max-width: 140px;">{item.name}</span>
								<button
									type="button"
									class="btn-close"
									style="font-size: 0.55rem;"
									aria-label="Hapus {item.name}"
									onclick={() => shopUI.toggleCompare(item)}
								></button>
							</span>
						{/each}
					</div>
				</div>

				<div class="d-flex align-items-center gap-2 ms-auto">
					<button
						type="button"
						class="btn btn-outline-hairline btn-sm"
						onclick={() => shopUI.clearCompare()}
					>
						Kosongkan
					</button>
					<button
						type="button"
						class="btn btn-primary btn-sm"
						disabled={shopUI.compareList.length < 2}
						data-bs-toggle="modal"
						data-bs-target="#compareProductsModal"
					>
						{shopUI.compareList.length < 2 ? 'Pilih min. 2 produk' : 'Bandingkan Sekarang'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Tabel Perbandingan Berdampingan -->
<div
	class="modal fade"
	id="compareProductsModal"
	tabindex="-1"
	aria-labelledby="compareProductsModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-header hairline-bottom">
				<div>
					<span class="catalog-kicker d-block">Lembar Spesifikasi Berdampingan</span>
					<h5 class="modal-title font-heading fw-semibold mb-0" id="compareProductsModalLabel">
						Perbandingan Produk ({shopUI.compareList.length} Item)
					</h5>
				</div>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
			</div>

			<div class="modal-body p-0">
				{#if shopUI.compareList.length > 0}
					<div class="table-responsive">
						<table class="table table-bordered align-middle mb-0">
							<thead>
								<tr>
									<th style="width: 180px; background-color: var(--bg-subtle);" class="small text-secondary-warm">
										Parameter
									</th>
									{#each shopUI.compareList as item}
										<th class="p-3" style="min-width: 220px;">
											<div class="d-flex justify-content-between align-items-start gap-2 mb-2">
												<img
													src={item.primaryImage}
													alt={item.name}
													class="rounded border object-fit-cover"
													style="width: 72px; height: 72px; background-color: var(--bg-subtle);"
												/>
												<button
													type="button"
													class="btn btn-outline-hairline btn-sm p-1"
													aria-label="Hapus dari tabel"
													onclick={() => shopUI.toggleCompare(item)}
												>
													<X size={14} />
												</button>
											</div>
											<div class="font-heading fw-semibold small">{item.name}</div>
										</th>
									{/each}
								</tr>
							</thead>
							<tbody class="small">
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Harga Mulai</th>
									{#each shopUI.compareList as item}
										<td class="price-tabular">{formatRupiah(item.minPrice)}</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Kategori & Tipe</th>
									{#each shopUI.compareList as item}
										<td>{item.category?.name} — {formatProductType(item.productType)}</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Material Utama</th>
									{#each shopUI.compareList as item}
										<td>{item.material}</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Spesifikasi Kartu</th>
									{#each shopUI.compareList as item}
										<td>{item.cardSizeSpec}</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Pilihan Warna</th>
									{#each shopUI.compareList as item}
										<td>
											<div class="d-flex flex-wrap gap-1.5">
												{#each item.variants || [] as v}
													<span class="badge bg-light text-dark border fw-normal d-inline-flex align-items-center gap-1">
														<span
															class="rounded-circle"
															style="width: 9px; height: 9px; background-color: {v.colorHex}; display: inline-block;"
														></span>
														{v.colorName}
													</span>
												{/each}
											</div>
										</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Total Stok</th>
									{#each shopUI.compareList as item}
										<td>{item.totalStock} unit</td>
									{/each}
								</tr>
								<tr>
									<th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Tindakan</th>
									{#each shopUI.compareList as item}
										<td>
											<a
												href="/produk/{item.slug}"
												class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
												onclick={closeCompareModal}
											>
												<span>Lihat Detail</span>
												<ArrowUpRight size={14} />
											</a>
										</td>
									{/each}
								</tr>
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>