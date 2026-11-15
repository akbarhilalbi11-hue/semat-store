<footer class="hairline-top mt-5" style="background-color: var(--bg-subtle);">
	<div class="container py-5">
		<div class="row g-4 justify-content-between">
			<!-- Kolom 1: Identitas Katalog -->
			<div class="col-12 col-lg-5">
				<span class="catalog-kicker mb-2">Katalog Perlengkapan Identitas</span>
				<h5 class="font-heading fw-bold mb-3">SEMAT — Studio Holder Kartu & Lanyard</h5>
				<p class="small text-secondary-warm mb-3" style="max-width: 42ch;">
					Menyediakan pelindung kartu pengenal ukuran standar ISO CR80 (54 × 86 mm) dan B2 dalam material kulit sapi nabati, akrilik bening 2 mm, serta retractable reel berpegas baja.
				</p>
				<p class="small text-secondary-warm mb-0">
					Workshop & Titik Kirim: Pamulang, Tangerang Selatan, Banten.
				</p>
			</div>

			<!-- Kolom 2: Navigasi Katalog -->
			<div class="col-6 col-md-3 col-lg-2">
				<h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">
					Koleksi
				</h6>
				<ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
					<li><a href="/katalog" class="text-decoration-none text-secondary-warm">Semua Produk</a></li>
					<li><a href="/katalog?kategori=kulit" class="text-decoration-none text-secondary-warm">Kulit Nabati</a></li>
					<li><a href="/katalog?kategori=akrilik" class="text-decoration-none text-secondary-warm">Akrilik & Mika</a></li>
					<li><a href="/katalog?kategori=reel" class="text-decoration-none text-secondary-warm">Retractable Reel</a></li>
					<li><a href="/katalog?kategori=paket-lanyard" class="text-decoration-none text-secondary-warm">Paket Lanyard</a></li>
				</ul>
			</div>

			<!-- Kolom 3: Informasi Layanan -->
			<div class="col-6 col-md-3 col-lg-2">
				<h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">
					Panduan
				</h6>
				<ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
					<li><a href="/cara-pemesanan" class="text-decoration-none text-secondary-warm">Cara Pemesanan</a></li>
					<li><a href="/faq" class="text-decoration-none text-secondary-warm">Tanya Jawab (FAQ)</a></li>
					<li><a href="/tentang" class="text-decoration-none text-secondary-warm">Tentang SEMAT</a></li>
					<li><a href="/kontak" class="text-decoration-none text-secondary-warm">Kontak & Lokasi</a></li>
				</ul>
			</div>

			<!-- Kolom 4: Simulasi Pembayaran & Kurir -->
			<div class="col-12 col-md-6 col-lg-3">
				<h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">
					Metode & Pengiriman
				</h6>
				<div class="d-flex flex-wrap gap-1 mb-3">
					{#each ['VA BCA', 'VA Mandiri', 'VA BNI', 'VA BRI', 'QRIS', 'GoPay', 'OVO', 'DANA'] as metode}
						<span class="badge fw-normal text-dark border" style="background-color: var(--bg-surface); border-color: var(--border-hairline) !important;">
							{metode}
						</span>
					{/each}
				</div>
				<p class="small text-secondary-warm mb-0">
					Tarif pengiriman dihitung presisi berdasarkan koordinat jarak titik kirim.
				</p>
			</div>
		</div>

		<div class="hairline-top mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 small text-secondary-warm">
			<span>© {new Date().getFullYear()} SEMAT Katalog. Proyek Simulasi E-Commerce Akademik.</span>
			<span>Seluruh transaksi bersifat simulasi demo.</span>
		</div>
	</div>
</footer>