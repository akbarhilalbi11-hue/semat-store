<script>
	import { page } from '$app/state';
</script>

<section class="py-5 my-4">
	<div class="container" style="max-width: 560px;">
		<div class="surface-card p-4 p-md-5 text-center">
			<span class="catalog-kicker mb-2">Kode Status {page.status}</span>
			<h1 class="h3 font-heading fw-bold mb-3">
				{#if page.status === 403}
					Akses Halaman Ditolak
				{:else if page.status === 404}
					Halaman Tidak Ditemukan
				{:else}
					Terjadi Kesalahan Sistem
				{/if}
			</h1>
			<p class="small text-secondary-warm mb-4">
				{page.error?.message || 'Permintaan tidak dapat diproses saat ini.'}
			</p>
			<div class="d-flex justify-content-center gap-2">
				<a href="/" class="btn btn-primary btn-sm">Kembali ke Beranda</a>
				<a href="/katalog" class="btn btn-outline-hairline btn-sm">Buka Katalog</a>
			</div>
		</div>
	</div>
</section>