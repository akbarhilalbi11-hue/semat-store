import { a as derived, b as escape_html, d as sanitize_props, f as slot, g as attr, m as stringify, p as spread_props, s as ensure_array_like } from "../../chunks/server.js";
import { n as Arrow_right, t as Arrow_up_right } from "../../chunks/arrow-up-right.js";
import { a as Icon, r as formatRupiah } from "../../chunks/shop-ui.svelte.js";
import { t as ProductCard } from "../../chunks/ProductCard.js";
// node_modules/lucide-svelte/dist/icons/layers.svelte
function Layers($$renderer, $$props) {
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
		{ name: "layers" },
		$$sanitized_props,
		{
			/**
			* @component @name Layers
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuODMgMi4xOGEyIDIgMCAwIDAtMS42NiAwTDIuNiA2LjA4YTEgMSAwIDAgMCAwIDEuODNsOC41OCAzLjkxYTIgMiAwIDAgMCAxLjY2IDBsOC41OC0zLjlhMSAxIDAgMCAwIDAtMS44M3oiIC8+CiAgPHBhdGggZD0iTTIgMTJhMSAxIDAgMCAwIC41OC45MWw4LjYgMy45MWEyIDIgMCAwIDAgMS42NSAwbDguNTgtMy45QTEgMSAwIDAgMCAyMiAxMiIgLz4KICA8cGF0aCBkPSJNMiAxN2ExIDEgMCAwIDAgLjU4LjkxbDguNiAzLjkxYTIgMiAwIDAgMCAxLjY1IDBsOC41OC0zLjlBMSAxIDAgMCAwIDIyIDE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/layers
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" }],
				["path", { "d": "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" }],
				["path", { "d": "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" }]
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
// node_modules/lucide-svelte/dist/icons/ruler.svelte
function Ruler($$renderer, $$props) {
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
		{ name: "ruler" },
		$$sanitized_props,
		{
			/**
			* @component @name Ruler
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMyAxNS4zYTIuNCAyLjQgMCAwIDEgMCAzLjRsLTIuNiAyLjZhMi40IDIuNCAwIDAgMS0zLjQgMEwyLjcgOC43YTIuNDEgMi40MSAwIDAgMSAwLTMuNGwyLjYtMi42YTIuNDEgMi40MSAwIDAgMSAzLjQgMFoiIC8+CiAgPHBhdGggZD0ibTE0LjUgMTIuNSAyLTIiIC8+CiAgPHBhdGggZD0ibTExLjUgOS41IDItMiIgLz4KICA8cGF0aCBkPSJtOC41IDYuNSAyLTIiIC8+CiAgPHBhdGggZD0ibTE3LjUgMTUuNSAyLTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/ruler
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" }],
				["path", { "d": "m14.5 12.5 2-2" }],
				["path", { "d": "m11.5 9.5 2-2" }],
				["path", { "d": "m8.5 6.5 2-2" }],
				["path", { "d": "m17.5 15.5 2-2" }]
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
// node_modules/lucide-svelte/dist/icons/shield-check.svelte
function Shield_check($$renderer, $$props) {
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
		{ name: "shield-check" },
		$$sanitized_props,
		{
			/**
			* @component @name ShieldCheck
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+CiAgPHBhdGggZD0ibTkgMTIgMiAyIDQtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shield-check
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }], ["path", { "d": "m9 12 2 2 4-4" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
// src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let spotlightProduct = derived(() => data.featuredProducts?.[0] || data.latestProducts?.[0] || null);
		$$renderer.push(`<section class="py-4 py-lg-5 hairline-bottom"><div class="container"><div class="row g-4 g-lg-5 align-items-center"><div class="col-12 col-lg-7"><span class="catalog-kicker mb-2">Edisi Katalog 2026 — ${escape_html(data.totalProducts)} Seri Aktif</span> <h1 class="display-5 fw-bold mb-3" style="line-height: 1.12;">Pelindung kartu pengenal yang dirancang untuk pemakaian kerja &amp; acara harian.</h1> <p class="lead text-secondary-warm mb-4" style="max-width: 54ch; font-size: 1.05rem;">Dari casing akrilik bening 2 mm untuk akses tap RFID kantor hingga sleeve kulit sapi nabati jahit tangan dengan pengait lanyard kuningan.</p> <div class="d-flex flex-wrap align-items-center gap-2"><a href="/katalog" class="btn btn-primary d-inline-flex align-items-center gap-2"><span>Jelajahi Semua Katalog</span> `);
		Arrow_up_right($$renderer, { size: 17 });
		$$renderer.push(`<!----></a> <a href="/katalog?kategori=paket-lanyard" class="btn btn-outline-hairline">Lihat Paket Panitia &amp; Kantor</a></div> <div class="row g-3 mt-4 pt-3 hairline-top small"><div class="col-12 col-sm-4"><div class="d-flex align-items-start gap-2">`);
		Ruler($$renderer, {
			size: 16,
			class: "text-taupe flex-shrink-0 mt-1"
		});
		$$renderer.push(`<!----> <div><strong class="d-block">Presisi CR80 &amp; B2</strong> <span class="text-secondary-warm">Ukuran 54×86 mm &amp; 70×105 mm</span></div></div></div> <div class="col-12 col-sm-4"><div class="d-flex align-items-start gap-2">`);
		Layers($$renderer, {
			size: 16,
			class: "text-taupe flex-shrink-0 mt-1"
		});
		$$renderer.push(`<!----> <div><strong class="d-block">Sekat Anti-Bentrok</strong> <span class="text-secondary-warm">Dua kartu RFID tap terpisah</span></div></div></div> <div class="col-12 col-sm-4"><div class="d-flex align-items-start gap-2">`);
		Shield_check($$renderer, {
			size: 16,
			class: "text-taupe flex-shrink-0 mt-1"
		});
		$$renderer.push(`<!----> <div><strong class="d-block">Pengait Uji Tarik</strong> <span class="text-secondary-warm">Kabel baja 60 cm &amp; ring kuningan</span></div></div></div></div></div> <div class="col-12 col-lg-5">`);
		if (spotlightProduct()) $$renderer.push(`<!--[0--><div class="surface-card overflow-hidden"><div class="row g-0"><div class="col-5 col-sm-5" style="background-color: var(--bg-subtle);"><img${attr("src", spotlightProduct().primaryImage)}${attr("alt", spotlightProduct().name)} class="w-100 h-100 object-fit-cover" style="min-height: 220px;"/></div> <div class="col-7 col-sm-7 p-3 p-md-4 d-flex flex-column justify-content-between"><div><span class="badge mb-2" style="background-color: var(--accent-taupe-soft); color: var(--text-primary);">Sorotan Katalog</span> <h2 class="h5 font-heading fw-semibold mb-1">${escape_html(spotlightProduct().name)}</h2> <p class="small text-secondary-warm mb-2">${escape_html(spotlightProduct().material)}</p> <p class="small text-secondary-warm mb-0" style="font-size: 0.78rem;">${escape_html(spotlightProduct().cardSizeSpec)}</p></div> <div class="mt-3 pt-3 hairline-top d-flex align-items-center justify-content-between"><span class="price-tabular">${escape_html(formatRupiah(spotlightProduct().minPrice))}</span> <a${attr("href", `/produk/${stringify(spotlightProduct().slug)}`)} class="btn btn-primary btn-sm">Lihat Produk</a></div></div></div></div>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></section> <section class="py-5 hairline-bottom" style="background-color: var(--bg-subtle);"><div class="container"><div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2"><div><span class="catalog-kicker">Indeks Kategori</span> <h2 class="h3 fw-bold mb-0">Telusuri berdasarkan jenis perlengkapan</h2></div> <a href="/katalog" class="small text-decoration-none text-dark fw-medium d-inline-flex align-items-center gap-1"><span>Buka semua filter</span> `);
		Arrow_right($$renderer, { size: 15 });
		$$renderer.push(`<!----></a></div> <div class="row g-3"><!--[-->`);
		const each_array = ensure_array_like(data.categories);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let cat = each_array[$$index];
			$$renderer.push(`<div class="col-12 col-sm-6 col-lg"><a${attr("href", `/katalog?kategori=${stringify(cat.slug)}`)} class="text-decoration-none text-dark d-block h-100"><div class="surface-card p-3 h-100 d-flex flex-column justify-content-between"><div class="d-flex align-items-center gap-3 mb-2"><img${attr("src", cat.coverImage)}${attr("alt", cat.name)} class="rounded border object-fit-cover flex-shrink-0" style="width: 52px; height: 52px; background-color: var(--bg-subtle);"/> <div><h3 class="h6 font-heading fw-semibold mb-0">${escape_html(cat.name)}</h3> <span class="small text-secondary-warm">${escape_html(cat.productCount)} model</span></div></div> <p class="small text-secondary-warm mb-0" style="font-size: 0.8rem;">${escape_html(cat.description)}</p></div></a></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section class="py-5 hairline-bottom"><div class="container"><div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2"><div><span class="catalog-kicker">Pilihan Utama</span> <h2 class="h3 fw-bold mb-0">Seri paling banyak dipakai tim kantor &amp; kampus</h2></div> <a href="/katalog" class="btn btn-outline-hairline btn-sm">Lihat seluruh ${escape_html(data.totalProducts)} produk</a></div> <div class="row g-3 g-md-4"><!--[-->`);
		const each_array_1 = ensure_array_like(data.featuredProducts);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let product = each_array_1[$$index_1];
			$$renderer.push(`<div class="col-12 col-sm-6 col-lg-3">`);
			ProductCard($$renderer, { product });
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section class="py-5"><div class="container"><div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2"><div><span class="catalog-kicker">Rilis Terbaru</span> <h2 class="h3 fw-bold mb-0">Varian terbaru di studio SEMAT</h2></div> <span class="small text-secondary-warm">Klik bulatan warna pada kartu untuk pratinjau varian</span></div> <div class="row g-3 g-md-4"><!--[-->`);
		const each_array_2 = ensure_array_like(data.latestProducts);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let product = each_array_2[$$index_2];
			$$renderer.push(`<div class="col-12 col-sm-6 col-lg-4">`);
			ProductCard($$renderer, { product });
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map