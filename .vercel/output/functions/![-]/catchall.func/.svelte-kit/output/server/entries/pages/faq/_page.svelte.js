import { b as escape_html, c as head, g as attr, m as stringify, s as ensure_array_like, t as attr_class } from "../../../chunks/server.js";
// src/routes/faq/+page.svelte
function _page($$renderer) {
	head("1bex8oj", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Tanya Jawab (FAQ) — SEMAT</title>`);
		});
	});
	$$renderer.push(`<section class="py-5"><div class="container" style="max-width: 820px;"><span class="catalog-kicker mb-2">Pertanyaan Umum</span> <h1 class="display-6 fw-bold mb-4">Informasi ukuran kartu, stok, dan simulasi</h1> <div class="accordion" id="faqAccordion"><!--[-->`);
	const each_array = ensure_array_like([
		{
			id: "q1",
			q: "Apakah holder ukuran CR80 muat untuk KTP, Flazz/e-Money, dan KTM?",
			a: "Ya. Seluruh holder berlabel CR80 memiliki ruang dalam 54 × 86 mm yang dirancang pas untuk kartu standar ISO seperti KTP, kartu akses kantor RFID, kartu commuter, dan KTM."
		},
		{
			id: "q2",
			q: "Apa perbedaan holder 2-slot biasa dengan model Lipat Magnet Dual-Window?",
			a: "Pada holder 2-slot biasa, dua kartu berada berhimpitan sehingga dua kartu RFID berfrekuensi sama bisa saling mengganggu saat ditempel ke mesin reader. Model Lipat Magnet memisahkan kedua kartu saat dibuka 180 derajat."
		},
		{
			id: "q3",
			q: "Apakah transaksi di website ini menggunakan uang sungguhan?",
			a: "Tidak. Website ini adalah proyek simulasi e-commerce akademik. Seluruh kanal pembayaran Virtual Account, QRIS, dan e-wallet menggunakan simulator internal."
		}
	]);
	for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
		let item = each_array[idx];
		$$renderer.push(`<div class="accordion-item"><h2 class="accordion-header"><button${attr_class(`accordion-button ${idx !== 0 ? "collapsed" : ""} font-heading fw-semibold`)} type="button" data-bs-toggle="collapse"${attr("data-bs-target", `#${stringify(item.id)}`)}>${escape_html(item.q)}</button></h2> <div${attr("id", item.id)}${attr_class(`accordion-collapse collapse ${idx === 0 ? "show" : ""}`)} data-bs-parent="#faqAccordion"><div class="accordion-body small text-secondary-warm">${escape_html(item.a)}</div></div></div>`);
	}
	$$renderer.push(`<!--]--></div></div></section>`);
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map