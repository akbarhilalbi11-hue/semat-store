<script>
	import { Heart } from 'lucide-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Wishlist Saya — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<div class="pb-3 mb-4 hairline-bottom">
			<span class="catalog-kicker">Koleksi Tersimpan</span>
			<h1 class="h2 fw-bold mb-0">Wishlist Produk</h1>
		</div>

		{#if data.requiresLogin}
			<div class="surface-card p-5 text-center" style="max-width: 520px; margin: 0 auto;">
				<div class="surface-subtle d-inline-flex p-3 mb-3">
					<Heart size={24} class="text-taupe" />
				</div>
				<h2 class="h5 font-heading fw-semibold mb-2">Masuk untuk melihat wishlist Anda</h2>
				<p class="small text-secondary-warm mb-4">
					Simpan variasi card holder favorit agar mudah dibandingkan atau dipesan kapan saja.
				</p>
				<a href="/masuk?redirect=/wishlist" class="btn btn-primary btn-sm px-4">
					Masuk ke Akun
				</a>
			</div>
		{:else if data.items.length === 0}
			<div class="surface-card p-5 text-center">
				<h2 class="h5 font-heading fw-semibold mb-2">Belum ada produk di wishlist</h2>
				<p class="small text-secondary-warm mb-4">
					Klik ikon hati pada kartu produk di katalog untuk menyimpannya di daftar ini.
				</p>
				<a href="/katalog" class="btn btn-primary btn-sm">Jelajahi Katalog</a>
			</div>
		{:else}
			<div class="row g-3 g-md-4">
				{#each data.items as product (product.id)}
					<div class="col-12 col-sm-6 col-lg-3">
						<ProductCard {product} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>