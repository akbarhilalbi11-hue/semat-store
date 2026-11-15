import { b as escape_html, c as head, s as ensure_array_like } from "../../../chunks/server.js";
// src/routes/cara-pemesanan/+page.svelte
function _page($$renderer) {
	head("durl5b", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Cara Pemesanan — SEMAT</title>`);
		});
	});
	$$renderer.push(`<section class="py-5"><div class="container" style="max-width: 820px;"><span class="catalog-kicker mb-2">Panduan Transaksi</span> <h1 class="display-6 fw-bold mb-4">Alur pemesanan dari katalog hingga simulasi bayar</h1> <div class="d-flex flex-column gap-3"><!--[-->`);
	const each_array = ensure_array_like([
		{
			step: "01",
			title: "Pilih Produk & Varian Warna",
			desc: "Buka katalog, saring berdasarkan ukuran kartu atau material, lalu pilih warna varian yang sesuai."
		},
		{
			step: "02",
			title: "Tentukan Titik Pengiriman di Peta",
			desc: "Saat checkout, geser pin peta Leaflet atau gunakan pencarian alamat otomatis untuk menghitung jarak dan ongkos kirim."
		},
		{
			step: "03",
			title: "Pilih Layanan Kurir & Saluran Bayar",
			desc: "Pilih layanan Reguler, Ekspres, atau Instan, lalu pilih metode Virtual Account, QRIS, atau E-Wallet."
		},
		{
			step: "04",
			title: "Jalankan Simulasi Pembayaran",
			desc: "Gunakan tombol demo pembayaran pada halaman instruksi untuk menguji proses validasi pesanan secara langsung."
		}
	]);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let item = each_array[$$index];
		$$renderer.push(`<div class="surface-card p-4 d-flex gap-3 align-items-start"><span class="badge btn-taupe px-2.5 py-1.5">${escape_html(item.step)}</span> <div><h2 class="h6 font-heading fw-semibold mb-1">${escape_html(item.title)}</h2> <p class="small text-secondary-warm mb-0">${escape_html(item.desc)}</p></div></div>`);
	}
	$$renderer.push(`<!--]--></div></div></section>`);
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map