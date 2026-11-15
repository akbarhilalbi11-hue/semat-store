<script>
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { SlidersHorizontal, RotateCcw, Search } from 'lucide-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { formatProductType } from '#lib/utils/format.js';

	let { data } = $props();

	let searchText = $state('');
	let minHargaInput = $state('');
	let maxHargaInput = $state('');

	$effect(() => {
		searchText = data.filters.q || '';
		minHargaInput = data.filters.minHarga ? String(data.filters.minHarga) : '';
		maxHargaInput = data.filters.maxHarga ? String(data.filters.maxHarga) : '';
	});

	let isLoading = $derived(Boolean(navigating.to && navigating.to.url.pathname === '/katalog'));

	/**
	 * Membangun URL katalog yang mempertahankan filter aktif lainnya
	 * @param {Record<string, string | number | null>} updates
	 */
	function buildCatalogHref(updates) {
		const params = new URLSearchParams();
		const merged = {
			q: data.filters.q,
			kategori: data.filters.kategori,
			tipe: data.filters.tipe,
			warna: data.filters.warna,
			material: data.filters.material,
			minHarga: data.filters.minHarga,
			maxHarga: data.filters.maxHarga,
			urut: data.filters.urut,
			page: 1,
			...updates
		};

		for (const [key, val] of Object.entries(merged)) {
			if (
				val !== '' &&
				val !== null &&
				val !== undefined &&
				val !== 0 &&
				!(key === 'page' && Number(val) === 1) &&
				!(key === 'urut' && val === 'terbaru')
			) {
				params.set(key, String(val));
			}
		}

		const qs = params.toString();
		return qs ? `/katalog?${qs}` : '/katalog';
	}

	function applyUpdates(updates) {
		goto(buildCatalogHref(updates), { keepFocus: true, noScroll: true });
	}

	function handlePriceSubmit(e) {
		e.preventDefault();
		applyUpdates({
			minHarga: Number(minHargaInput) || '',
			maxHarga: Number(maxHargaInput) || ''
		});
	}

	function handleSearchSubmit(e) {
		e.preventDefault();
		applyUpdates({ q: searchText.trim() });
	}

	const productTypes = ['vertikal', 'horizontal', 'reel', 'paket', 'aksesori'];

	let hasActiveFilter = $derived(
		Boolean(
			data.filters.q ||
				data.filters.kategori ||
				data.filters.tipe ||
				data.filters.warna ||
				data.filters.material ||
				data.filters.minHarga ||
				data.filters.maxHarga
		)
	);
</script>

<svelte:head>
	<title>Katalog Produk — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<!-- Header Halaman Katalog -->
		<div class="pb-4 mb-4 hairline-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
			<div>
				<span class="catalog-kicker">Indeks Lengkap</span>
				<h1 class="h2 fw-bold mb-1">Katalog Holder Kartu & Lanyard</h1>
				<p class="small text-secondary-warm mb-0">
					Menampilkan {data.items.length} dari {data.pagination.totalItems} produk sesuai kriteria.
				</p>
			</div>

			<!-- Kontrol Urutan & Tombol Filter Mobile -->
			<div class="d-flex align-items-center gap-2">
				<button
					type="button"
					class="btn btn-outline-hairline btn-sm d-lg-none d-inline-flex align-items-center gap-2"
					data-bs-toggle="offcanvas"
					data-bs-target="#mobileFilterOffcanvas"
				>
					<SlidersHorizontal size={15} />
					<span>Filter</span>
				</button>

				<label for="sortSelect" class="small text-secondary-warm text-nowrap d-none d-sm-inline">Urutkan:</label>
				<select
					id="sortSelect"
					class="form-select form-select-sm"
					style="min-width: 210px;"
					value={data.filters.urut}
					onchange={(e) => applyUpdates({ urut: e.currentTarget.value })}
				>
					<option value="terbaru">Terbaru di Katalog</option>
					<option value="harga_asc">Harga: Terendah ke Tertinggi</option>
					<option value="harga_desc">Harga: Tertinggi ke Terendah</option>
					<option value="nama_asc">Nama: A – Z</option>
				</select>
			</div>
		</div>

		<div class="row g-4">
			<!-- Sidebar Filter Desktop -->
			<aside class="col-12 col-lg-3 d-none d-lg-block">
				<div class="surface-card p-3 p-xl-4">
					<div class="d-flex justify-content-between align-items-center pb-2 mb-3 hairline-bottom">
						<span class="font-heading fw-semibold">Filter Katalog</span>
						{#if hasActiveFilter}
							<a
								href="/katalog"
								data-sveltekit-keepfocus
								data-sveltekit-noscroll
								class="text-decoration-none text-taupe small d-inline-flex align-items-center gap-1"
							>
								<RotateCcw size={13} />
								<span>Reset</span>
							</a>
						{/if}
					</div>

					<!-- Pencarian Kata Kunci -->
					<form onsubmit={handleSearchSubmit} class="mb-4">
						<label for="desktopCatalogSearch" class="form-label small text-secondary-warm">Kata Kunci</label>
						<div class="input-group input-group-sm">
							<input
								id="desktopCatalogSearch"
								type="text"
								class="form-control"
								placeholder="Misal: B2, kulit, RFID..."
								bind:value={searchText}
							/>
							<button type="submit" class="btn btn-outline-hairline" aria-label="Cari">
								<Search size={14} />
							</button>
						</div>
					</form>

					<!-- Kategori (Tautan SvelteKit Asli) -->
					<div class="mb-4">
						<span class="form-label small text-secondary-warm d-block mb-2">Kategori</span>
						<div class="d-flex flex-column gap-1.5 small">
							<a
								href={buildCatalogHref({ kategori: '' })}
								data-sveltekit-keepfocus
								data-sveltekit-noscroll
								class="btn btn-sm text-start px-2 py-1 {data.filters.kategori === ''
									? 'btn-primary'
									: 'btn-outline-hairline border-0'}"
							>
								Semua Kategori
							</a>
							{#each data.categories as cat}
								<a
									href={buildCatalogHref({ kategori: cat.slug })}
									data-sveltekit-keepfocus
									data-sveltekit-noscroll
									class="btn btn-sm text-start px-2 py-1 {data.filters.kategori === cat.slug
										? 'btn-primary'
										: 'btn-outline-hairline border-0'}"
								>
									{cat.name}
								</a>
							{/each}
						</div>
					</div>

					<!-- Tipe / Orientasi -->
					<div class="mb-4">
						<span class="form-label small text-secondary-warm d-block mb-2">Tipe & Orientasi</span>
						<div class="d-flex flex-wrap gap-1.5">
							{#each productTypes as t}
								<a
									href={buildCatalogHref({ tipe: data.filters.tipe === t ? '' : t })}
									data-sveltekit-keepfocus
									data-sveltekit-noscroll
									class="btn btn-sm py-1 px-2 {data.filters.tipe === t ? 'btn-primary' : 'btn-outline-hairline'}"
									style="font-size: 0.78rem;"
								>
									{formatProductType(t)}
								</a>
							{/each}
						</div>
					</div>

					<!-- Warna Varian -->
					<div class="mb-4">
						<span class="form-label small text-secondary-warm d-block mb-2">Warna Varian</span>
						<div class="d-flex flex-wrap gap-2">
							{#each data.availableColors as c}
								<a
									href={buildCatalogHref({ warna: data.filters.warna === c.name ? '' : c.name })}
									data-sveltekit-keepfocus
									data-sveltekit-noscroll
									class="btn btn-sm d-inline-flex align-items-center gap-1.5 py-1 px-2 {data.filters.warna === c.name
										? 'btn-primary'
										: 'btn-outline-hairline'}"
									style="font-size: 0.75rem;"
								>
									<span
										class="rounded-circle border"
										style="width: 10px; height: 10px; background-color: {c.hex}; display: inline-block;"
									></span>
									<span>{c.name}</span>
								</a>
							{/each}
						</div>
					</div>

					<!-- Material -->
					<div class="mb-4">
						<label for="materialFilter" class="form-label small text-secondary-warm">Material</label>
						<select
							id="materialFilter"
							class="form-select form-select-sm"
							value={data.filters.material}
							onchange={(e) => applyUpdates({ material: e.currentTarget.value })}
						>
							<option value="">Semua Material</option>
							{#each data.availableMaterials as mat}
								<option value={mat}>{mat}</option>
							{/each}
						</select>
					</div>

					<!-- Rentang Harga -->
					<form onsubmit={handlePriceSubmit}>
						<span class="form-label small text-secondary-warm d-block mb-2">Rentang Harga (Rp)</span>
						<div class="row g-2 mb-2">
							<div class="col-6">
								<input
									type="number"
									min="0"
									step="1000"
									class="form-control form-control-sm"
									placeholder="Min"
									bind:value={minHargaInput}
									aria-label="Harga minimum"
								/>
							</div>
							<div class="col-6">
								<input
									type="number"
									min="0"
									step="1000"
									class="form-control form-control-sm"
									placeholder="Maks"
									bind:value={maxHargaInput}
									aria-label="Harga maksimum"
								/>
							</div>
						</div>
						<button type="submit" class="btn btn-outline-hairline btn-sm w-100">
							Terapkan Harga
						</button>
					</form>
				</div>
			</aside>

			<!-- Grid Daftar Produk -->
			<div class="col-12 col-lg-9">
				{#if isLoading}
					<div class="row g-3 g-md-4">
						{#each Array(4) as _}
							<div class="col-12 col-sm-6 col-xl-4">
								<div class="surface-card p-3 placeholder-glow">
									<div class="placeholder w-100 mb-3 rounded" style="height: 200px;"></div>
									<div class="placeholder col-6 mb-2"></div>
									<div class="placeholder col-10 mb-3"></div>
									<div class="placeholder col-4"></div>
								</div>
							</div>
						{/each}
					</div>
				{:else if data.items.length === 0}
					<div class="surface-card p-5 text-center">
						<h3 class="h5 font-heading fw-semibold mb-2">Tidak ada produk yang cocok</h3>
						<p class="small text-secondary-warm mb-4">
							Coba longgarkan pilihan warna, material, atau rentang harga untuk melihat koleksi lainnya.
						</p>
						<a href="/katalog" class="btn btn-primary btn-sm">
							Hapus Semua Filter
						</a>
					</div>
				{:else}
					<div class="row g-3 g-md-4">
						{#each data.items as product (product.id)}
							<div class="col-12 col-sm-6 col-xl-4">
								<ProductCard {product} />
							</div>
						{/each}
					</div>

					<!-- Pagination -->
					{#if data.pagination.totalPages > 1}
						<nav class="mt-5 pt-3 hairline-top d-flex justify-content-between align-items-center" aria-label="Navigasi halaman katalog">
							<span class="small text-secondary-warm">
								Halaman {data.pagination.page} dari {data.pagination.totalPages}
							</span>
							<ul class="pagination pagination-sm mb-0">
								<li class="page-item {data.pagination.page <= 1 ? 'disabled' : ''}">
									<a
										href={buildCatalogHref({ page: Math.max(1, data.pagination.page - 1) })}
										data-sveltekit-keepfocus
										class="page-link text-dark"
									>
										Sebelumnya
									</a>
								</li>
								{#each Array(data.pagination.totalPages) as _, idx}
									{@const pageNum = idx + 1}
									<li class="page-item {data.pagination.page === pageNum ? 'active' : ''}">
										<a
											href={buildCatalogHref({ page: pageNum })}
											data-sveltekit-keepfocus
											class="page-link {data.pagination.page === pageNum ? 'bg-dark border-dark text-white' : 'text-dark'}"
										>
											{pageNum}
										</a>
									</li>
								{/each}
								<li class="page-item {data.pagination.page >= data.pagination.totalPages ? 'disabled' : ''}">
									<a
										href={buildCatalogHref({ page: Math.min(data.pagination.totalPages, data.pagination.page + 1) })}
										data-sveltekit-keepfocus
										class="page-link text-dark"
									>
										Berikutnya
									</a>
								</li>
							</ul>
						</nav>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Offcanvas Filter Mobile -->
<div class="offcanvas offcanvas-start" tabindex="-1" id="mobileFilterOffcanvas" aria-labelledby="mobileFilterLabel">
	<div class="offcanvas-header hairline-bottom">
		<h5 class="offcanvas-title font-heading fw-semibold" id="mobileFilterLabel">Filter Katalog</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup"></button>
	</div>
	<div class="offcanvas-body">
		<div class="mb-4">
			<span class="form-label small text-secondary-warm d-block mb-2">Kategori</span>
			<div class="d-flex flex-wrap gap-1.5">
				<a
					href={buildCatalogHref({ kategori: '' })}
					class="btn btn-sm {data.filters.kategori === '' ? 'btn-primary' : 'btn-outline-hairline'}"
					data-bs-dismiss="offcanvas"
				>
					Semua
				</a>
				{#each data.categories as cat}
					<a
						href={buildCatalogHref({ kategori: cat.slug })}
						class="btn btn-sm {data.filters.kategori === cat.slug ? 'btn-primary' : 'btn-outline-hairline'}"
						data-bs-dismiss="offcanvas"
					>
						{cat.name}
					</a>
				{/each}
			</div>
		</div>

		<div class="mb-4">
			<span class="form-label small text-secondary-warm d-block mb-2">Tipe</span>
			<div class="d-flex flex-wrap gap-1.5">
				{#each productTypes as t}
					<a
						href={buildCatalogHref({ tipe: data.filters.tipe === t ? '' : t })}
						class="btn btn-sm {data.filters.tipe === t ? 'btn-primary' : 'btn-outline-hairline'}"
						data-bs-dismiss="offcanvas"
					>
						{formatProductType(t)}
					</a>
				{/each}
			</div>
		</div>

		{#if hasActiveFilter}
			<a href="/katalog" class="btn btn-outline-hairline btn-sm w-100" data-bs-dismiss="offcanvas">
				Reset Semua Filter
			</a>
		{/if}
	</div>
</div>