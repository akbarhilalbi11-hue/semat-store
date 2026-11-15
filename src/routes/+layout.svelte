<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import '../styles/app.scss';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import MiniCartOffcanvas from '#lib/components/MiniCartOffcanvas.svelte';
	import QuickViewModal from '#lib/components/QuickViewModal.svelte';
	import CompareBarModal from '#lib/components/CompareBarModal.svelte';
	import ToastContainer from '#lib/components/ToastContainer.svelte';

	let { children, data } = $props();

	let isStandaloneArea = $derived(
		page.url.pathname.startsWith('/admin') ||
			page.url.pathname.startsWith('/checkout') ||
			page.url.pathname.startsWith('/bayar')
	);

	onMount(async () => {
		const bs = await import('bootstrap');
		window.bootstrap = bs;
	});
</script>

<svelte:head>
	<title>SEMAT — Katalog Holder ID Card & Lanyard</title>
	<meta
		name="description"
		content="Katalog perlengkapan kartu pengenal: holder kulit nabati, casing akrilik, retractable reel, dan paket lanyard untuk kantor, kampus, dan panitia."
	/>
</svelte:head>

{#if isStandaloneArea}
	<div class="min-vh-100" style="background-color: var(--bg-canvas);">
		{@render children()}
	</div>
	<ToastContainer />
{:else}
	<div class="d-flex flex-column min-vh-100">
		<Navbar
			cartCount={data.cart?.totalQuantity || 0}
			wishlistCount={data.wishlistIds?.length || 0}
			user={data.user}
		/>
		<main class="flex-grow-1">
			{@render children()}
		</main>
		<Footer />
	</div>

	<MiniCartOffcanvas cart={data.cart} user={data.user} />
	<QuickViewModal />
	<CompareBarModal />
	<ToastContainer />
{/if}