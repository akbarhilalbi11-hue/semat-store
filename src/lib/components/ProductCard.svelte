<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Eye, Scale, Heart } from 'lucide-svelte';
	import { formatRupiah, formatProductType } from '#lib/utils/format.js';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';

	let { product } = $props();

	let selectedVariantId = $state(null);
	let isHovered = $state(false);

	$effect(() => {
		if (selectedVariantId === null && product.variants?.length > 0) {
			selectedVariantId = product.variants[0].id;
		}
	});

	let activeVariant = $derived(
		product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0] || null
	);

	let displayPrice = $derived(
		activeVariant ? product.basePrice + activeVariant.priceDelta : product.minPrice
	);

	let displayImage = $derived.by(() => {
		if (activeVariant?.imageUrl) {
			if (isHovered && product.secondaryImage && activeVariant.id === product.variants?.[0]?.id) {
				return product.secondaryImage;
			}
			return activeVariant.imageUrl;
		}
		return isHovered ? product.secondaryImage : product.primaryImage;
	});

	let inCompare = $derived(shopUI.isInCompare(product.id));
	let isWishlisted = $derived((page.data.wishlistIds || []).includes(product.id));

	async function toggleWishlist() {
		const res = await fetch('/api/wishlist', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ productId: product.id })
		});
		const result = await res.json();
		if (res.status === 401 || result.requiresAuth) {
			shopUI.notify('Masuk ke akun untuk menyimpan wishlist.', 'warning');
			goto(`/masuk?redirect=${encodeURIComponent(page.url.pathname)}`);
			return;
		}
		if (res.ok && result.ok) {
			await invalidateAll();
			shopUI.notify(result.message);
		}
	}
</script>

<article
	class="surface-card h-100 d-flex flex-column overflow-hidden product-card"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<div class="position-relative" style="background-color: var(--bg-subtle); aspect-ratio: 1 / 1;">
		<a href="/produk/{product.slug}" class="d-block w-100 h-100 text-decoration-none">
			<img
				src={displayImage}
				alt={product.images?.[0]?.altText || product.name}
				class="w-100 h-100 object-fit-cover product-card-img"
				loading="lazy"
				onerror={(e) => {
					e.currentTarget.src = '/products/placeholder.svg';
				}}
			/>
		</a>

		<div class="position-absolute top-0 start-0 p-2 d-flex flex-wrap gap-1">
			<span class="badge bg-white text-dark border fw-normal" style="font-size: 0.7rem;">
				{formatProductType(product.productType)}
			</span>
			{#if product.totalStock === 0}
				<span class="badge" style="background-color: var(--status-danger-bg); color: var(--status-danger-text); font-size: 0.7rem;">
					Stok Habis
				</span>
			{:else if product.totalStock <= 5}
				<span class="badge" style="background-color: var(--status-warning-bg); color: var(--status-warning-text); font-size: 0.7rem;">
					Sisa {product.totalStock}
				</span>
			{/if}
		</div>

		<div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1">
			<button
				type="button"
				class="btn btn-sm border p-1.5 shadow-sm {isWishlisted ? 'btn-taupe' : 'bg-white'}"
				title={isWishlisted ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
				aria-label="Wishlist {product.name}"
				onclick={toggleWishlist}
			>
				<Heart size={15} strokeWidth={1.75} fill={isWishlisted ? 'currentColor' : 'none'} />
			</button>

			<button
				type="button"
				class="btn btn-sm bg-white border p-1.5 shadow-sm"
				title="Lihat cepat spesifikasi produk"
				aria-label="Lihat cepat {product.name}"
				onclick={() => shopUI.openQuickView(product)}
			>
				<Eye size={15} strokeWidth={1.75} />
			</button>

			<button
				type="button"
				class="btn btn-sm border p-1.5 shadow-sm {inCompare ? 'btn-taupe' : 'bg-white'}"
				title={inCompare ? 'Hapus dari perbandingan' : 'Bandingkan produk'}
				aria-label="Bandingkan {product.name}"
				onclick={() => shopUI.toggleCompare(product)}
			>
				<Scale size={15} strokeWidth={1.75} />
			</button>
		</div>
	</div>

	<div class="p-3 d-flex flex-column flex-grow-1 justify-content-between">
		<div>
			<span class="catalog-kicker d-block mb-1" style="font-size: 0.68rem;">
				{product.category?.name}
			</span>
			<h3 class="h6 font-heading fw-semibold mb-1">
				<a href="/produk/{product.slug}" class="text-decoration-none text-dark">
					{product.name}
				</a>
			</h3>
			<p class="small text-secondary-warm mb-3" style="font-size: 0.8125rem; line-height: 1.45;">
				{product.subtitle}
			</p>
		</div>

		<div>
			{#if product.variants && product.variants.length > 0}
				<div class="d-flex align-items-center justify-content-between mb-3">
					<div class="d-flex align-items-center gap-1.5" role="group" aria-label="Pilih warna varian">
						{#each product.variants as variant}
							<button
								type="button"
								class="swatch-btn {activeVariant?.id === variant.id ? 'active' : ''}"
								style="background-color: {variant.colorHex};"
								title="{variant.colorName} (Stok: {variant.stock})"
								aria-label="Warna {variant.colorName}"
								onclick={() => (selectedVariantId = variant.id)}
							></button>
						{/each}
					</div>
					<span class="small text-secondary-warm" style="font-size: 0.75rem;">
						{activeVariant?.colorName}
					</span>
				</div>
			{/if}

			<div class="hairline-top pt-2 d-flex align-items-center justify-content-between gap-2">
				<span class="price-tabular fs-6">{formatRupiah(displayPrice)}</span>
				<a href="/produk/{product.slug}" class="btn btn-outline-hairline btn-sm px-2.5 py-1 small">
					Detail
				</a>
			</div>
		</div>
	</div>
</article>

<style>
	.product-card {
		transition: border-color 0.2s ease;
	}
	.product-card:hover {
		border-color: var(--border-strong);
	}
	.product-card-img {
		transition: transform 0.35s ease;
	}
	.product-card:hover .product-card-img {
		transform: scale(1.025);
	}
	.swatch-btn {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid rgba(31, 30, 27, 0.28);
		padding: 0;
		cursor: pointer;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.swatch-btn.active {
		transform: scale(1.15);
		box-shadow: 0 0 0 2px #ffffff, 0 0 0 3.5px #1f1e1b;
	}
</style>