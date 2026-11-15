<svelte:head>
	<title>Cara Pemesanan — SEMAT</title>
</svelte:head>

<section class="py-5">
	<div class="container" style="max-width: 820px;">
		<span class="catalog-kicker mb-2">Panduan Transaksi</span>
		<h1 class="display-6 fw-bold mb-4">Alur pemesanan dari katalog hingga simulasi bayar</h1>

		<div class="d-flex flex-column gap-3">
			{#each [
				{ step: '01', title: 'Pilih Produk & Varian Warna', desc: 'Buka katalog, saring berdasarkan ukuran kartu atau material, lalu pilih warna varian yang sesuai.' },
				{ step: '02', title: 'Tentukan Titik Pengiriman di Peta', desc: 'Saat checkout, geser pin peta Leaflet atau gunakan pencarian alamat otomatis untuk menghitung jarak dan ongkos kirim.' },
				{ step: '03', title: 'Pilih Layanan Kurir & Saluran Bayar', desc: 'Pilih layanan Reguler, Ekspres, atau Instan, lalu pilih metode Virtual Account, QRIS, atau E-Wallet.' },
				{ step: '04', title: 'Jalankan Simulasi Pembayaran', desc: 'Gunakan tombol demo pembayaran pada halaman instruksi untuk menguji proses validasi pesanan secara langsung.' }
			] as item}
				<div class="surface-card p-4 d-flex gap-3 align-items-start">
					<span class="badge btn-taupe px-2.5 py-1.5">{item.step}</span>
					<div>
						<h2 class="h6 font-heading fw-semibold mb-1">{item.title}</h2>
						<p class="small text-secondary-warm mb-0">{item.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>