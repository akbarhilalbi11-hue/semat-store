<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Heart, Scale, ShoppingBag, CheckCircle2, XCircle, Minus, Plus, ChevronRight } from 'lucide-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { formatRupiah, formatProductType } from '#lib/utils/format.js';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';

	let { data } = $props();
	let product = $derived(data.product);

	let selectedVariantId = $state(null);
	let activeImageUrl = $state('/products/placeholder.svg');
	let quantity = $state(1);
	let isAddingCart = $state(false);
	let isTogglingWish = $state(false);

	let isZoomed = $state(false);
	let zoomOrigin = $state('50% 50%');

	$effect(() => {
		const firstVar = data.product.variants?.[0] || null;
		selectedVariantId = firstVar?.id ?? null;
		activeImageUrl = firstVar?.imageUrl || data.product.primaryImage;
		quantity = 1;
	});

	let activeVariant = $derived(
		product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0] || null
	);

	let currentPrice = $derived(product.basePrice + (activeVariant?.priceDelta || 0));
	let currentStock = $derived(activeVariant?.stock ?? 0);
	let isWishlisted = $derived((page.data.wishlistIds || []).includes(product.id));

	let galleryImages = $derived.by(() => {
		const seen = new Set();
		const list = [];
		for (const img of product.images || []) {
			if (!seen.has(img.url)) {
				seen.add(img.url);
				list.push({ url: img.url, alt: img.altText });
			}
		}
		for (const v of product.variants || []) {
			if (v.imageUrl && !seen.has(v.imageUrl)) {
				seen.add(v.imageUrl);
				list.push({ url: v.imageUrl, alt: `${product.name} — ${v.colorName}` });
			}
		}
		return list.length > 0 ? list : [{ url: '/products/placeholder.svg', alt: product.name }];
	});

	function selectVariant(variant) {
		selectedVariantId = variant.id;
		if (variant.imageUrl) {
			activeImageUrl = variant.imageUrl;
		}
		if (quantity > variant.stock && variant.stock > 0) {
			quantity = variant.stock;
		}
	}

	function handleMouseMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		zoomOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
	}

	async function handleAddToCart() {
		if (!activeVariant || currentStock <= 0 || isAddingCart) return;
		isAddingCart = true;

		try {
			const res = await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					variantId: activeVariant.id,
					quantity
				})
			});
			const result = await res.json();
			if (res.ok && result.ok) {
				await invalidateAll();
				shopUI.notify(result.message);
				if (typeof window !== 'undefined' && window.bootstrap) {
					const el = document.getElementById('miniCartOffcanvas');
					if (el) window.bootstrap.Offcanvas.getOrCreateInstance(el).show();
				}
			} else {
				shopUI.notify(result.message || 'Gagal menambahkan ke keranjang.', 'warning');
			}
		} finally {
			isAddingCart = false;
		}
	}

	async function handleToggleWishlist() {
		if (isTogglingWish) return;
		isTogglingWish = true;
		try {
			const res = await fetch('/api/wishlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId: product.id })
			});
			const result = await res.json();
			if (res.status === 401 || result.requiresAuth) {
				shopUI.notify('Silakan masuk terlebih dahulu untuk menyimpan wishlist.', 'warning');
				goto(`/masuk?redirect=${encodeURIComponent(page.url.pathname)}`);
				return;
			}
			if (res.ok && result.ok) {
				await invalidateAll();
				shopUI.notify(result.message);
			}
		} finally {
			isTogglingWish = false;
		}
	}
</script>

<svelte:head>
	<title>{product.name} — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<!-- Breadcrumb -->
		<nav aria-label="Breadcrumb" class="mb-4">
			<ol class="breadcrumb small mb-0">
				<li class="breadcrumb-item"><a href="/" class="text-decoration-none text-secondary-warm">Beranda</a></li>
				<li class="breadcrumb-item"><a href="/katalog" class="text-decoration-none text-secondary-warm">Katalog</a></li>
				<li class="breadcrumb-item">
					<a href="/katalog?kategori={product.category?.slug}" class="text-decoration-none text-secondary-warm">
						{product.category?.name}
					</a>
				</li>
				<li class="breadcrumb-item active text-dark" aria-current="page">{product.name}</li>
			</ol>
		</nav>

		<div class="row g-4 g-lg-5 align-items-start">
			<!-- Kolom Kiri: Galeri Gambar -->
			<div class="col-12 col-lg-6">
				<div
					class="surface-subtle overflow-hidden position-relative mb-3 zoom-stage"
					style="aspect-ratio: 1 / 1;"
					onmouseenter={() => (isZoomed = true)}
					onmouseleave={() => (isZoomed = false)}
					onmousemove={handleMouseMove}
					role="img"
					aria-label={product.name}
				>
					<img
						src={activeImageUrl}
						alt={product.name}
						class="w-100 h-100 object-fit-cover zoom-img"
						style="transform-origin: {zoomOrigin}; transform: {isZoomed ? 'scale(1.65)' : 'scale(1)'};"
						onerror={(e) => {
							e.currentTarget.src = '/products/placeholder.svg';
						}}
					/>
					<span
						class="position-absolute bottom-0 end-0 m-2 badge bg-white text-dark border fw-normal d-none d-lg-inline"
						style="font-size: 0.7rem;"
					>
						Arahkan kursor untuk perbesar
					</span>
				</div>

				<div class="d-flex gap-2 overflow-auto pb-1">
					{#each galleryImages as img}
						<button
							type="button"
							class="p-0 rounded overflow-hidden flex-shrink-0 border {activeImageUrl === img.url
								? 'border-dark border-2'
								: ''}"
							style="width: 72px; height: 72px; background-color: var(--bg-subtle);"
							onclick={() => (activeImageUrl = img.url)}
							aria-label="Tampilkan {img.alt}"
						>
							<img src={img.url} alt={img.alt} class="w-100 h-100 object-fit-cover" />
						</button>
					{/each}
				</div>
			</div>

			<!-- Kolom Kanan: Informasi, Varian, Spesifikasi, & Aksi -->
			<div class="col-12 col-lg-6">
				<div class="d-flex flex-wrap align-items-center gap-2 mb-2">
					<span class="catalog-kicker">{product.category?.name}</span>
					<span class="text-secondary-warm">•</span>
					<span class="small text-secondary-warm">{formatProductType(product.productType)}</span>
				</div>

				<h1 class="h2 fw-bold mb-2">{product.name}</h1>
				<p class="text-secondary-warm mb-3">{product.subtitle}</p>

				<div class="pb-3 mb-4 hairline-bottom d-flex align-items-baseline justify-content-between">
					<span class="price-tabular display-6 fw-bold" style="font-size: 1.85rem;">
						{formatRupiah(currentPrice)}
					</span>
					{#if activeVariant}
						<span class="small text-secondary-warm">SKU: {activeVariant.sku}</span>
					{/if}
				</div>

				<!-- Pilihan Varian Warna/Tipe -->
				{#if product.variants?.length > 0}
					<div class="mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2 small">
							<span class="text-secondary-warm">
								Pilih Varian Warna: <strong class="text-dark">{activeVariant?.colorName}</strong>
							</span>
							{#if currentStock > 0}
								<span class="d-inline-flex align-items-center gap-1 text-success">
									<CheckCircle2 size={14} />
									<span>Stok {currentStock} unit</span>
								</span>
							{:else}
								<span class="d-inline-flex align-items-center gap-1 text-danger">
									<XCircle size={14} />
									<span>Stok Habis</span>
								</span>
							{/if}
						</div>

						<div class="d-flex flex-wrap gap-2">
							{#each product.variants as variant}
								<button
									type="button"
									class="btn btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 {activeVariant?.id === variant.id
										? 'btn-primary'
										: 'btn-outline-hairline'}"
									onclick={() => selectVariant(variant)}
								>
									<span
										class="rounded-circle border"
										style="width: 14px; height: 14px; background-color: {variant.colorHex}; display: inline-block;"
									></span>
									<span>{variant.colorName}</span>
									{#if variant.priceDelta > 0}
										<span class="opacity-75" style="font-size: 0.72rem;">
											(+{formatRupiah(variant.priceDelta)})
										</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Pemilih Jumlah & Tombol Aksi Desktop (Sejajar Rapi 1 Baris) -->
				<div class="d-flex flex-wrap align-items-center gap-2 mb-4">
					<div class="input-group flex-nowrap" style="width: 148px;">
						<button
							type="button"
							class="btn btn-outline-hairline px-3"
							disabled={quantity <= 1 || currentStock <= 0}
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							aria-label="Kurangi jumlah"
						>
							<Minus size={14} />
						</button>
						<input
							type="text"
							class="form-control text-center price-tabular px-1"
							value={quantity}
							readonly
							aria-label="Jumlah pembelian"
						/>
						<button
							type="button"
							class="btn btn-outline-hairline px-3"
							disabled={quantity >= currentStock || currentStock <= 0}
							onclick={() => (quantity = Math.min(currentStock, quantity + 1))}
							aria-label="Tambah jumlah"
						>
							<Plus size={14} />
						</button>
					</div>

					<button
						type="button"
						class="btn btn-primary flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
						disabled={currentStock <= 0 || isAddingCart}
						onclick={handleAddToCart}
					>
						<ShoppingBag size={17} />
						<span>{isAddingCart ? 'Menyimpan...' : currentStock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}</span>
					</button>

					<button
						type="button"
						class="btn px-3 {isWishlisted ? 'btn-taupe' : 'btn-outline-hairline'}"
						title={isWishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
						aria-label="Simpan ke Wishlist"
						onclick={handleToggleWishlist}
					>
						<Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
					</button>

					<button
						type="button"
						class="btn px-3 {shopUI.isInCompare(product.id) ? 'btn-taupe' : 'btn-outline-hairline'}"
						title="Bandingkan Produk"
						aria-label="Bandingkan Produk"
						onclick={() => shopUI.toggleCompare(product)}
					>
						<Scale size={17} />
					</button>
				</div>

				<!-- Lembar Spesifikasi Teknis -->
				<div class="surface-card p-3 p-md-4 mb-4">
					<h2 class="h6 font-heading fw-semibold mb-3">Spesifikasi Teknis & Ukuran Kartu</h2>
					<dl class="row small mb-0 g-2">
						<dt class="col-5 text-secondary-warm fw-normal">Ukuran Kartu</dt>
						<dd class="col-7 fw-medium mb-1">{product.cardSizeSpec}</dd>

						<dt class="col-5 text-secondary-warm fw-normal">Material Utama</dt>
						<dd class="col-7 fw-medium mb-1">{product.material}</dd>

						<dt class="col-5 text-secondary-warm fw-normal">Orientasi / Tipe</dt>
						<dd class="col-7 fw-medium mb-0">{formatProductType(product.productType)}</dd>
					</dl>
				</div>

				<div>
					<h2 class="h6 font-heading fw-semibold mb-2">Catatan Penggunaan</h2>
					<p class="small text-secondary-warm mb-0" style="line-height: 1.7;">
						{product.description}
					</p>
				</div>
			</div>
		</div>

		<!-- Produk Terkait -->
		{#if data.relatedProducts?.length > 0}
			<div class="mt-5 pt-5 hairline-top">
				<div class="d-flex justify-content-between align-items-end mb-4">
					<div>
						<span class="catalog-kicker">Seri Terkait</span>
						<h2 class="h4 fw-bold mb-0">Perlengkapan pendamping di kategori yang sama</h2>
					</div>
					<a href="/katalog?kategori={product.category?.slug}" class="small text-decoration-none text-dark d-inline-flex align-items-center gap-1">
						<span>Lihat kategori</span>
						<ChevronRight size={15} />
					</a>
				</div>

				<div class="row g-3 g-md-4">
					{#each data.relatedProducts as rel (rel.id)}
						<div class="col-12 col-sm-6 col-lg-3">
							<ProductCard product={rel} />
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Bilah Tambah ke Keranjang Menempel di Bawah Layar Mobile -->
<div
	class="d-md-none position-fixed bottom-0 start-0 end-0 p-2 hairline-top"
	style="background-color: var(--bg-surface); z-index: 1015;"
>
	<div class="d-flex align-items-center justify-content-between gap-2">
		<div>
			<span class="d-block text-secondary-warm" style="font-size: 0.7rem;">{activeVariant?.colorName}</span>
			<span class="price-tabular fw-bold">{formatRupiah(currentPrice)}</span>
		</div>
		<button
			type="button"
			class="btn btn-primary btn-sm px-4 py-2 d-inline-flex align-items-center gap-2"
			disabled={currentStock <= 0 || isAddingCart}
			onclick={handleAddToCart}
		>
			<ShoppingBag size={15} />
			<span>{currentStock > 0 ? 'Tambah ke Keranjang' : 'Habis'}</span>
		</button>
	</div>
</div>

<style>
	.zoom-stage {
		cursor: zoom-in;
	}
	.zoom-img {
		transition: transform 0.15s ease-out;
	}
	@media (max-width: 991.98px) {
		.zoom-stage {
			cursor: default;
		}
		.zoom-img {
			transform: none !important;
		}
	}
</style>