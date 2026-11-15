import { a as derived, b as escape_html, c as head, d as sanitize_props, f as slot, g as attr, m as stringify, n as attr_style, p as spread_props, s as ensure_array_like, t as attr_class } from "../../../chunks/server.js";
import { n as goto } from "../../../chunks/navigation.js";
import { t as navigating } from "../../../chunks/state.js";
import { a as Icon, n as formatProductType } from "../../../chunks/shop-ui.svelte.js";
import { t as Search } from "../../../chunks/search.js";
import { t as ProductCard } from "../../../chunks/ProductCard.js";
// node_modules/lucide-svelte/dist/icons/rotate-ccw.svelte
function Rotate_ccw($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	/**
	* @license lucide-svelte v1.0.1 - ISC
	*
	* ISC License
	*
	* Copyright (c) 2026 Lucide Icons and Contributors
	*
	* Permission to use, copy, modify, and/or distribute this software for any
	* purpose with or without fee is hereby granted, provided that the above
	* copyright notice and this permission notice appear in all copies.
	*
	* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*
	* ---
	*
	* The following Lucide icons are derived from the Feather project:
	*
	* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
	*
	* The MIT License (MIT) (for the icons listed above)
	*
	* Copyright (c) 2013-present Cole Bemis
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in all
	* copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	* SOFTWARE.
	*
	*/
	Icon($$renderer, spread_props([
		{ name: "rotate-ccw" },
		$$sanitized_props,
		{
			/**
			* @component @name RotateCcw
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }], ["path", { "d": "M3 3v5h5" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
// node_modules/lucide-svelte/dist/icons/sliders-horizontal.svelte
function Sliders_horizontal($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	/**
	* @license lucide-svelte v1.0.1 - ISC
	*
	* ISC License
	*
	* Copyright (c) 2026 Lucide Icons and Contributors
	*
	* Permission to use, copy, modify, and/or distribute this software for any
	* purpose with or without fee is hereby granted, provided that the above
	* copyright notice and this permission notice appear in all copies.
	*
	* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*
	* ---
	*
	* The following Lucide icons are derived from the Feather project:
	*
	* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
	*
	* The MIT License (MIT) (for the icons listed above)
	*
	* Copyright (c) 2013-present Cole Bemis
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in all
	* copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	* SOFTWARE.
	*
	*/
	Icon($$renderer, spread_props([
		{ name: "sliders-horizontal" },
		$$sanitized_props,
		{
			/**
			* @component @name SlidersHorizontal
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgNUgzIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOUgzIiAvPgogIDxwYXRoIGQ9Ik0xNCAzdjQiIC8+CiAgPHBhdGggZD0iTTE2IDE3djQiIC8+CiAgPHBhdGggZD0iTTIxIDEyaC05IiAvPgogIDxwYXRoIGQ9Ik0yMSAxOWgtNSIgLz4KICA8cGF0aCBkPSJNMjEgNWgtNyIgLz4KICA8cGF0aCBkPSJNOCAxMHY0IiAvPgogIDxwYXRoIGQ9Ik04IDEySDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sliders-horizontal
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M10 5H3" }],
				["path", { "d": "M12 19H3" }],
				["path", { "d": "M14 3v4" }],
				["path", { "d": "M16 17v4" }],
				["path", { "d": "M21 12h-9" }],
				["path", { "d": "M21 19h-5" }],
				["path", { "d": "M21 5h-7" }],
				["path", { "d": "M8 10v4" }],
				["path", { "d": "M8 12H3" }]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
// src/routes/katalog/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let searchText = data.filters.q || "";
		let minHargaInput = data.filters.minHarga || "";
		let maxHargaInput = data.filters.maxHarga || "";
		let isLoading = derived(() => Boolean(navigating.to && navigating.to.url.pathname === "/katalog"));
		/**
		* Memperbarui query parameter URL tanpa full page reload
		* @param {Record<string, string | number | null>} updates
		*/
		function updateFilters(updates) {
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
			for (const [key, val] of Object.entries(merged)) if (val !== "" && val !== null && val !== void 0 && val !== 0 && !(key === "page" && val === 1) && !(key === "urut" && val === "terbaru")) params.set(key, String(val));
			const qs = params.toString();
			goto(qs ? `/katalog?${qs}` : "/katalog", {
				keepFocus: true,
				noScroll: true
			});
		}
		const productTypes = [
			"vertikal",
			"horizontal",
			"reel",
			"paket",
			"aksesori"
		];
		let hasActiveFilter = derived(() => Boolean(data.filters.q || data.filters.kategori || data.filters.tipe || data.filters.warna || data.filters.material || data.filters.minHarga || data.filters.maxHarga));
		head("1z0w5bc", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Katalog Produk — SEMAT</title>`);
			});
		});
		$$renderer.push(`<section class="py-4 py-lg-5"><div class="container"><div class="pb-4 mb-4 hairline-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3"><div><span class="catalog-kicker">Indeks Lengkap</span> <h1 class="h2 fw-bold mb-1">Katalog Holder Kartu &amp; Lanyard</h1> <p class="small text-secondary-warm mb-0">Menampilkan ${escape_html(data.items.length)} dari ${escape_html(data.pagination.totalItems)} produk sesuai kriteria.</p></div> <div class="d-flex align-items-center gap-2"><button type="button" class="btn btn-outline-hairline btn-sm d-lg-none d-inline-flex align-items-center gap-2" data-bs-toggle="offcanvas" data-bs-target="#mobileFilterOffcanvas">`);
		Sliders_horizontal($$renderer, { size: 15 });
		$$renderer.push(`<!----> <span>Filter</span></button> <label for="sortSelect" class="small text-secondary-warm text-nowrap d-none d-sm-inline">Urutkan:</label> `);
		$$renderer.select({
			id: "sortSelect",
			class: "form-select form-select-sm",
			style: "min-width: 190px;",
			value: data.filters.urut,
			onchange: (e) => updateFilters({ urut: e.currentTarget.value })
		}, ($$renderer) => {
			$$renderer.option({ value: "terbaru" }, ($$renderer) => {
				$$renderer.push(`Terbaru di Katalog`);
			});
			$$renderer.option({ value: "harga_asc" }, ($$renderer) => {
				$$renderer.push(`Harga: Terendah ke Tertinggi`);
			});
			$$renderer.option({ value: "harga_desc" }, ($$renderer) => {
				$$renderer.push(`Harga: Tertinggi ke Terendah`);
			});
			$$renderer.option({ value: "nama_asc" }, ($$renderer) => {
				$$renderer.push(`Nama: A – Z`);
			});
		});
		$$renderer.push(`</div></div> <div class="row g-4"><aside class="col-12 col-lg-3 d-none d-lg-block"><div class="surface-card p-3 p-xl-4"><div class="d-flex justify-content-between align-items-center pb-2 mb-3 hairline-bottom"><span class="font-heading fw-semibold">Filter Katalog</span> `);
		if (hasActiveFilter()) {
			$$renderer.push(`<!--[0--><button type="button" class="btn btn-sm p-0 text-taupe small d-inline-flex align-items-center gap-1">`);
			Rotate_ccw($$renderer, { size: 13 });
			$$renderer.push(`<!----> <span>Reset</span></button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <form class="mb-4"><label for="desktopCatalogSearch" class="form-label small text-secondary-warm">Kata Kunci</label> <div class="input-group input-group-sm"><input id="desktopCatalogSearch" type="text" class="form-control" placeholder="Misal: B2, kulit, RFID..."${attr("value", searchText)}/> <button type="submit" class="btn btn-outline-hairline" aria-label="Cari">`);
		Search($$renderer, { size: 14 });
		$$renderer.push(`<!----></button></div></form> <div class="mb-4"><span class="form-label small text-secondary-warm d-block mb-2">Kategori</span> <div class="d-flex flex-column gap-1.5 small"><button type="button"${attr_class(`btn btn-sm text-start px-2 py-1 ${data.filters.kategori === "" ? "btn-primary" : "btn-outline-hairline border-0"}`)}>Semua Kategori</button> <!--[-->`);
		const each_array = ensure_array_like(data.categories);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let cat = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`btn btn-sm text-start px-2 py-1 ${data.filters.kategori === cat.slug ? "btn-primary" : "btn-outline-hairline border-0"}`)}>${escape_html(cat.name)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mb-4"><span class="form-label small text-secondary-warm d-block mb-2">Tipe &amp; Orientasi</span> <div class="d-flex flex-wrap gap-1.5"><!--[-->`);
		const each_array_1 = ensure_array_like(productTypes);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let t = each_array_1[$$index_1];
			$$renderer.push(`<button type="button"${attr_class(`btn btn-sm py-1 px-2 ${data.filters.tipe === t ? "btn-primary" : "btn-outline-hairline"}`)} style="font-size: 0.78rem;">${escape_html(formatProductType(t))}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mb-4"><span class="form-label small text-secondary-warm d-block mb-2">Warna Varian</span> <div class="d-flex flex-wrap gap-2"><!--[-->`);
		const each_array_2 = ensure_array_like(data.availableColors);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let c = each_array_2[$$index_2];
			$$renderer.push(`<button type="button"${attr_class(`btn btn-sm d-inline-flex align-items-center gap-1.5 py-1 px-2 ${data.filters.warna === c.name ? "btn-primary" : "btn-outline-hairline"}`)} style="font-size: 0.75rem;"><span class="rounded-circle border"${attr_style(`width: 10px; height: 10px; background-color: ${stringify(c.hex)}; display: inline-block;`)}></span> <span>${escape_html(c.name)}</span></button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mb-4"><label for="materialFilter" class="form-label small text-secondary-warm">Material</label> `);
		$$renderer.select({
			id: "materialFilter",
			class: "form-select form-select-sm",
			value: data.filters.material,
			onchange: (e) => updateFilters({ material: e.currentTarget.value })
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Semua Material`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_3 = ensure_array_like(data.availableMaterials);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let mat = each_array_3[$$index_3];
				$$renderer.option({ value: mat }, ($$renderer) => {
					$$renderer.push(`${escape_html(mat)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <form><span class="form-label small text-secondary-warm d-block mb-2">Rentang Harga (Rp)</span> <div class="row g-2 mb-2"><div class="col-6"><input type="number" min="0" step="1000" class="form-control form-control-sm" placeholder="Min"${attr("value", minHargaInput)} aria-label="Harga minimum"/></div> <div class="col-6"><input type="number" min="0" step="1000" class="form-control form-control-sm" placeholder="Maks"${attr("value", maxHargaInput)} aria-label="Harga maksimum"/></div></div> <button type="submit" class="btn btn-outline-hairline btn-sm w-100">Terapkan Harga</button></form></div></aside> <div class="col-12 col-lg-9">`);
		if (isLoading()) {
			$$renderer.push(`<!--[0--><div class="row g-3 g-md-4"><!--[-->`);
			const each_array_4 = ensure_array_like(Array(4));
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				each_array_4[$$index_4];
				$$renderer.push(`<div class="col-12 col-sm-6 col-xl-4"><div class="surface-card p-3 placeholder-glow"><div class="placeholder w-100 mb-3 rounded" style="height: 200px;"></div> <div class="placeholder col-6 mb-2"></div> <div class="placeholder col-10 mb-3"></div> <div class="placeholder col-4"></div></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else if (data.items.length === 0) $$renderer.push(`<!--[1--><div class="surface-card p-5 text-center"><h3 class="h5 font-heading fw-semibold mb-2">Tidak ada produk yang cocok</h3> <p class="small text-secondary-warm mb-4">Coba longgarkan pilihan warna, material, atau rentang harga untuk melihat koleksi lainnya.</p> <button type="button" class="btn btn-primary btn-sm">Hapus Semua Filter</button></div>`);
		else {
			$$renderer.push(`<!--[-1--><div class="row g-3 g-md-4"><!--[-->`);
			const each_array_5 = ensure_array_like(data.items);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let product = each_array_5[$$index_5];
				$$renderer.push(`<div class="col-12 col-sm-6 col-xl-4">`);
				ProductCard($$renderer, { product });
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div> `);
			if (data.pagination.totalPages > 1) {
				$$renderer.push(`<!--[0--><nav class="mt-5 pt-3 hairline-top d-flex justify-content-between align-items-center" aria-label="Navigasi halaman katalog"><span class="small text-secondary-warm">Halaman ${escape_html(data.pagination.page)} dari ${escape_html(data.pagination.totalPages)}</span> <ul class="pagination pagination-sm mb-0"><li${attr_class(`page-item ${data.pagination.page <= 1 ? "disabled" : ""}`)}><button type="button" class="page-link text-dark">Sebelumnya</button></li> <!--[-->`);
				const each_array_6 = ensure_array_like(Array(data.pagination.totalPages));
				for (let idx = 0, $$length = each_array_6.length; idx < $$length; idx++) {
					each_array_6[idx];
					const pageNum = idx + 1;
					$$renderer.push(`<li${attr_class(`page-item ${data.pagination.page === pageNum ? "active" : ""}`)}><button type="button"${attr_class(`page-link ${data.pagination.page === pageNum ? "bg-dark border-dark text-white" : "text-dark"}`)}>${escape_html(pageNum)}</button></li>`);
				}
				$$renderer.push(`<!--]--> <li${attr_class(`page-item ${data.pagination.page >= data.pagination.totalPages ? "disabled" : ""}`)}><button type="button" class="page-link text-dark">Berikutnya</button></li></ul></nav>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></div></section> <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileFilterOffcanvas" aria-labelledby="mobileFilterLabel"><div class="offcanvas-header hairline-bottom"><h5 class="offcanvas-title font-heading fw-semibold" id="mobileFilterLabel">Filter Katalog</h5> <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup"></button></div> <div class="offcanvas-body"><div class="mb-4"><span class="form-label small text-secondary-warm d-block mb-2">Kategori</span> <div class="d-flex flex-wrap gap-1.5"><button type="button"${attr_class(`btn btn-sm ${data.filters.kategori === "" ? "btn-primary" : "btn-outline-hairline"}`)} data-bs-dismiss="offcanvas">Semua</button> <!--[-->`);
		const each_array_7 = ensure_array_like(data.categories);
		for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
			let cat = each_array_7[$$index_7];
			$$renderer.push(`<button type="button"${attr_class(`btn btn-sm ${data.filters.kategori === cat.slug ? "btn-primary" : "btn-outline-hairline"}`)} data-bs-dismiss="offcanvas">${escape_html(cat.name)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="mb-4"><span class="form-label small text-secondary-warm d-block mb-2">Tipe</span> <div class="d-flex flex-wrap gap-1.5"><!--[-->`);
		const each_array_8 = ensure_array_like(productTypes);
		for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
			let t = each_array_8[$$index_8];
			$$renderer.push(`<button type="button"${attr_class(`btn btn-sm ${data.filters.tipe === t ? "btn-primary" : "btn-outline-hairline"}`)} data-bs-dismiss="offcanvas">${escape_html(formatProductType(t))}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		if (hasActiveFilter()) $$renderer.push(`<!--[0--><button type="button" class="btn btn-outline-hairline btn-sm w-100" data-bs-dismiss="offcanvas">Reset Semua Filter</button>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map