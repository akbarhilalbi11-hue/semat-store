<script>
	import { ArrowUpRight, Ruler, Layers, ShieldCheck, ArrowRight } from 'lucide-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { formatRupiah } from '#lib/utils/format.js';

	let { data } = $props();
	let spotlightProduct = $derived(data.featuredProducts?.[0] || data.latestProducts?.[0] || null);
</script>

<!-- Hero Asimetris Katalog Fisik -->
<section class="py-4 py-lg-5 hairline-bottom">
	<div class="container">
		<div class="row g-4 g-lg-5 align-items-center">
			<div class="col-12 col-lg-7">
				<span class="catalog-kicker mb-2">Edisi Katalog 2026 — {data.totalProducts} Seri Aktif</span>
				<h1 class="display-5 fw-bold mb-3" style="line-height: 1.12;">
					Pelindung kartu pengenal yang dirancang untuk pemakaian kerja & acara harian.
				</h1>
				<p class="lead text-secondary-warm mb-4" style="max-width: 54ch; font-size: 1.05rem;">
					Dari casing akrilik bening 2 mm untuk akses tap RFID kantor hingga sleeve kulit sapi nabati jahit tangan dengan pengait lanyard kuningan.
				</p>
				<div class="d-flex flex-wrap align-items-center gap-2">
					<a href="/katalog" class="btn btn-primary d-inline-flex align-items-center gap-2">
						<span>Jelajahi Semua Katalog</span>
						<ArrowUpRight size={17} />
					</a>
					<a href="/katalog?kategori=paket-lanyard" class="btn btn-outline-hairline">
						Lihat Paket Panitia & Kantor
					</a>
				</div>

				<!-- Tiga Indikator Spesifikasi Ringkas -->
				<div class="row g-3 mt-4 pt-3 hairline-top small">
					<div class="col-12 col-sm-4">
						<div class="d-flex align-items-start gap-2">
							<Ruler size={16} class="text-taupe flex-shrink-0 mt-1" />
							<div>
								<strong class="d-block">Presisi CR80 & B2</strong>
								<span class="text-secondary-warm">Ukuran 54×86 mm & 70×105 mm</span>
							</div>
						</div>
					</div>
					<div class="col-12 col-sm-4">
						<div class="d-flex align-items-start gap-2">
							<Layers size={16} class="text-taupe flex-shrink-0 mt-1" />
							<div>
								<strong class="d-block">Sekat Anti-Bentrok</strong>
								<span class="text-secondary-warm">Dua kartu RFID tap terpisah</span>
							</div>
						</div>
					</div>
					<div class="col-12 col-sm-4">
						<div class="d-flex align-items-start gap-2">
							<ShieldCheck size={16} class="text-taupe flex-shrink-0 mt-1" />
							<div>
								<strong class="d-block">Pengait Uji Tarik</strong>
								<span class="text-secondary-warm">Kabel baja 60 cm & ring kuningan</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Kolom Kanan: Sorotan Produk Unggulan dari Database -->
			<div class="col-12 col-lg-5">
				{#if spotlightProduct}
					<div class="surface-card overflow-hidden">
						<div class="row g-0">
							<div class="col-5 col-sm-5" style="background-color: var(--bg-subtle);">
								<img
									src={spotlightProduct.primaryImage}
									alt={spotlightProduct.name}
									class="w-100 h-100 object-fit-cover"
									style="min-height: 220px;"
								/>
							</div>
							<div class="col-7 col-sm-7 p-3 p-md-4 d-flex flex-column justify-content-between">
								<div>
									<span class="badge mb-2" style="background-color: var(--accent-taupe-soft); color: var(--text-primary);">
										Sorotan Katalog
									</span>
									<h2 class="h5 font-heading fw-semibold mb-1">{spotlightProduct.name}</h2>
									<p class="small text-secondary-warm mb-2">{spotlightProduct.material}</p>
									<p class="small text-secondary-warm mb-0" style="font-size: 0.78rem;">
										{spotlightProduct.cardSizeSpec}
									</p>
								</div>

								<div class="mt-3 pt-3 hairline-top d-flex align-items-center justify-content-between">
									<span class="price-tabular">{formatRupiah(spotlightProduct.minPrice)}</span>
									<a href="/produk/{spotlightProduct.slug}" class="btn btn-primary btn-sm">
										Lihat Produk
									</a>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Navigasi Kategori Katalog -->
<section class="py-5 hairline-bottom" style="background-color: var(--bg-subtle);">
	<div class="container">
		<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
			<div>
				<span class="catalog-kicker">Indeks Kategori</span>
				<h2 class="h3 fw-bold mb-0">Telusuri berdasarkan jenis perlengkapan</h2>
			</div>
			<a href="/katalog" class="small text-decoration-none text-dark fw-medium d-inline-flex align-items-center gap-1">
				<span>Buka semua filter</span>
				<ArrowRight size={15} />
			</a>
		</div>

		<div class="row g-3">
			{#each data.categories as cat}
				<div class="col-12 col-sm-6 col-lg">
					<a href="/katalog?kategori={cat.slug}" class="text-decoration-none text-dark d-block h-100">
						<div class="surface-card p-3 h-100 d-flex flex-column justify-content-between">
							<div class="d-flex align-items-center gap-3 mb-2">
								<img
									src={cat.coverImage}
									alt={cat.name}
									class="rounded border object-fit-cover flex-shrink-0"
									style="width: 52px; height: 52px; background-color: var(--bg-subtle);"
								/>
								<div>
									<h3 class="h6 font-heading fw-semibold mb-0">{cat.name}</h3>
									<span class="small text-secondary-warm">{cat.productCount} model</span>
								</div>
							</div>
							<p class="small text-secondary-warm mb-0" style="font-size: 0.8rem;">
								{cat.description}
							</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Produk Unggulan -->
<section class="py-5 hairline-bottom">
	<div class="container">
		<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
			<div>
				<span class="catalog-kicker">Pilihan Utama</span>
				<h2 class="h3 fw-bold mb-0">Seri paling banyak dipakai tim kantor & kampus</h2>
			</div>
			<a href="/katalog" class="btn btn-outline-hairline btn-sm">
				Lihat seluruh {data.totalProducts} produk
			</a>
		</div>

		<div class="row g-3 g-md-4">
			{#each data.featuredProducts as product (product.id)}
				<div class="col-12 col-sm-6 col-lg-3">
					<ProductCard {product} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Koleksi Terbaru -->
<section class="py-5">
	<div class="container">
		<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
			<div>
				<span class="catalog-kicker">Rilis Terbaru</span>
				<h2 class="h3 fw-bold mb-0">Varian terbaru di studio SEMAT</h2>
			</div>
			<span class="small text-secondary-warm">Klik bulatan warna pada kartu untuk pratinjau varian</span>
		</div>

		<div class="row g-3 g-md-4">
			{#each data.latestProducts as product (product.id)}
				<div class="col-12 col-sm-6 col-lg-4">
					<ProductCard {product} />
				</div>
			{/each}
		</div>
	</div>
</section>