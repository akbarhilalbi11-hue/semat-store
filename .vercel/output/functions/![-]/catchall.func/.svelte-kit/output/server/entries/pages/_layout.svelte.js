import { a as derived, b as escape_html, c as head, d as sanitize_props, f as slot, g as attr, m as stringify, n as attr_style, p as spread_props, s as ensure_array_like, t as attr_class } from "../../chunks/server.js";
import { n as page } from "../../chunks/state.js";
import "../../chunks/navigation.js";
import { t as Search } from "../../chunks/search.js";
import { i as Circle_check, n as Heart, r as Circle_x, t as Shopping_bag } from "../../chunks/shopping-bag.js";
import { a as Icon, i as Scale, n as formatProductType, r as formatRupiah, t as shopUI } from "../../chunks/shop-ui.svelte.js";
import { n as Arrow_right, t as Arrow_up_right } from "../../chunks/arrow-up-right.js";
// node_modules/lucide-svelte/dist/icons/menu.svelte
function Menu($$renderer, $$props) {
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
		{ name: "menu" },
		$$sanitized_props,
		{
			/**
			* @component @name Menu
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA1aDE2IiAvPgogIDxwYXRoIGQ9Ik00IDEyaDE2IiAvPgogIDxwYXRoIGQ9Ik00IDE5aDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/menu
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M4 5h16" }],
				["path", { "d": "M4 12h16" }],
				["path", { "d": "M4 19h16" }]
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
// node_modules/lucide-svelte/dist/icons/user.svelte
function User($$renderer, $$props) {
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
		{ name: "user" },
		$$sanitized_props,
		{
			/**
			* @component @name User
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", {
				"cx": "12",
				"cy": "7",
				"r": "4"
			}]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
// node_modules/lucide-svelte/dist/icons/x.svelte
function X($$renderer, $$props) {
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
		{ name: "x" },
		$$sanitized_props,
		{
			/**
			* @component @name X
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
// src/lib/components/Navbar.svelte
function Navbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { cartCount = 0, wishlistCount = 0, user = null } = $$props;
		const navLinks = [
			{
				href: "/katalog",
				label: "Katalog"
			},
			{
				href: "/cara-pemesanan",
				label: "Cara Pemesanan"
			},
			{
				href: "/tentang",
				label: "Tentang"
			},
			{
				href: "/kontak",
				label: "Kontak"
			}
		];
		let searchQuery = "";
		$$renderer.push(`<header class="sticky-top hairline-bottom" style="background-color: rgba(246, 244, 240, 0.96); backdrop-filter: blur(8px); z-index: 1020;"><div class="container py-3"><div class="d-flex align-items-center justify-content-between gap-2 gap-md-3"><div class="d-flex align-items-center gap-2 gap-md-4"><button type="button" class="btn btn-outline-hairline btn-sm d-lg-none px-2 py-1" data-bs-toggle="offcanvas" data-bs-target="#mobileNavOffcanvas" aria-label="Buka menu navigasi">`);
		Menu($$renderer, {
			size: 18,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----></button> <a href="/" class="text-decoration-none d-inline-flex align-items-center gap-2 text-dark"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2" stroke="#1F1E1B" stroke-width="1.75"></rect><path d="M9 5V3.5C9 2.67157 9.67157 2 10.5 2H13.5C14.3284 2 15 2.67157 15 3.5V5" stroke="#8A7F6A" stroke-width="1.75"></path><line x1="8" y1="11" x2="16" y2="11" stroke="#1F1E1B" stroke-width="1.5"></line><line x1="8" y1="15" x2="13" y2="15" stroke="#8A7F6A" stroke-width="1.5"></line></svg> <span class="font-heading fw-bold fs-4">SEMAT</span></a> <nav class="d-none d-lg-flex align-items-center gap-4 ms-2" aria-label="Navigasi utama"><!--[-->`);
		const each_array = ensure_array_like(navLinks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let link = each_array[$$index];
			$$renderer.push(`<a${attr("href", link.href)}${attr_class(`text-decoration-none small fw-medium ${page.url.pathname.startsWith(link.href) ? "text-dark border-bottom border-dark pb-1" : "text-secondary-warm"}`)}>${escape_html(link.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav></div> <div class="position-relative flex-grow-1 d-none d-md-block" style="max-width: 340px;"><form class="position-relative">`);
		Search($$renderer, {
			size: 15,
			strokeWidth: 1.75,
			class: "position-absolute top-50 translate-middle-y text-secondary-warm",
			style: "left: 12px; pointer-events: none;"
		});
		$$renderer.push(`<!----> <input type="search" class="form-control form-control-sm ps-5 pe-4" placeholder="Cari holder kulit, akrilik B2, reel..."${attr("value", searchQuery)} aria-label="Cari produk"/> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></form> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="d-flex align-items-center gap-2"><a href="/katalog" class="btn btn-outline-hairline btn-sm d-md-none px-2 py-2" aria-label="Cari di katalog">`);
		Search($$renderer, {
			size: 17,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----></a> <a href="/wishlist" class="btn btn-outline-hairline btn-sm position-relative px-2 py-2" aria-label="Daftar keinginan">`);
		Heart($$renderer, {
			size: 17,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----> `);
		if (wishlistCount > 0) $$renderer.push(`<!--[0--><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary" style="font-size: 0.65rem;">${escape_html(wishlistCount)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a> <a${attr("href", user ? user.role === "admin" ? "/admin" : "/akun" : "/masuk")} class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-2 px-2.5 py-2">`);
		User($$renderer, {
			size: 16,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----> <span class="d-none d-sm-inline small">${escape_html(user ? user.name.split(" ")[0] : "Masuk")}</span></a> <button type="button" class="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 px-2.5 py-2" data-bs-toggle="offcanvas" data-bs-target="#miniCartOffcanvas" aria-controls="miniCartOffcanvas">`);
		Shopping_bag($$renderer, {
			size: 16,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----> <span class="small d-none d-sm-inline">Keranjang</span> <span class="badge bg-light text-dark ms-1">${escape_html(cartCount)}</span></button></div></div></div></header> <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileNavOffcanvas" aria-labelledby="mobileNavOffcanvasLabel"><div class="offcanvas-header hairline-bottom"><span class="offcanvas-title font-heading fw-bold fs-5" id="mobileNavOffcanvasLabel">SEMAT — Katalog</span> <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup menu"></button></div> <div class="offcanvas-body d-flex flex-column justify-content-between"><nav class="nav flex-column gap-2"><a href="/" class="nav-link text-dark fw-medium px-0 py-2 hairline-bottom" data-bs-dismiss="offcanvas">Beranda</a> <!--[-->`);
		const each_array_2 = ensure_array_like(navLinks);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let link = each_array_2[$$index_2];
			$$renderer.push(`<a${attr("href", link.href)} class="nav-link text-dark fw-medium px-0 py-2 hairline-bottom" data-bs-dismiss="offcanvas">${escape_html(link.label)}</a>`);
		}
		$$renderer.push(`<!--]--></nav> <div class="surface-subtle p-3 mt-4"><span class="catalog-kicker d-block mb-1">Jam Operasional Studio</span> <p class="small text-secondary-warm mb-0">Senin – Sabtu, 08.30 – 17.00 WIB. Pengiriman dari Tangerang Selatan.</p></div></div></div>`);
	});
}
// src/lib/components/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<footer class="hairline-top mt-5" style="background-color: var(--bg-subtle);"><div class="container py-5"><div class="row g-4 justify-content-between"><div class="col-12 col-lg-5"><span class="catalog-kicker mb-2">Katalog Perlengkapan Identitas</span> <h5 class="font-heading fw-bold mb-3">SEMAT — Studio Holder Kartu &amp; Lanyard</h5> <p class="small text-secondary-warm mb-3" style="max-width: 42ch;">Menyediakan pelindung kartu pengenal ukuran standar ISO CR80 (54 × 86 mm) dan B2 dalam material kulit sapi nabati, akrilik bening 2 mm, serta retractable reel berpegas baja.</p> <p class="small text-secondary-warm mb-0">Workshop &amp; Titik Kirim: Pamulang, Tangerang Selatan, Banten.</p></div> <div class="col-6 col-md-3 col-lg-2"><h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">Koleksi</h6> <ul class="list-unstyled small d-flex flex-column gap-2 mb-0"><li><a href="/katalog" class="text-decoration-none text-secondary-warm">Semua Produk</a></li> <li><a href="/katalog?kategori=kulit" class="text-decoration-none text-secondary-warm">Kulit Nabati</a></li> <li><a href="/katalog?kategori=akrilik" class="text-decoration-none text-secondary-warm">Akrilik &amp; Mika</a></li> <li><a href="/katalog?kategori=reel" class="text-decoration-none text-secondary-warm">Retractable Reel</a></li> <li><a href="/katalog?kategori=paket-lanyard" class="text-decoration-none text-secondary-warm">Paket Lanyard</a></li></ul></div> <div class="col-6 col-md-3 col-lg-2"><h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">Panduan</h6> <ul class="list-unstyled small d-flex flex-column gap-2 mb-0"><li><a href="/cara-pemesanan" class="text-decoration-none text-secondary-warm">Cara Pemesanan</a></li> <li><a href="/faq" class="text-decoration-none text-secondary-warm">Tanya Jawab (FAQ)</a></li> <li><a href="/tentang" class="text-decoration-none text-secondary-warm">Tentang SEMAT</a></li> <li><a href="/kontak" class="text-decoration-none text-secondary-warm">Kontak &amp; Lokasi</a></li></ul></div> <div class="col-12 col-md-6 col-lg-3"><h6 class="font-heading fw-semibold small text-uppercase mb-3" style="letter-spacing: 0.05em;">Metode &amp; Pengiriman</h6> <div class="d-flex flex-wrap gap-1 mb-3"><!--[-->`);
		const each_array = ensure_array_like([
			"VA BCA",
			"VA Mandiri",
			"VA BNI",
			"VA BRI",
			"QRIS",
			"GoPay",
			"OVO",
			"DANA"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let metode = each_array[$$index];
			$$renderer.push(`<span class="badge fw-normal text-dark border" style="background-color: var(--bg-surface); border-color: var(--border-hairline) !important;">${escape_html(metode)}</span>`);
		}
		$$renderer.push(`<!--]--></div> <p class="small text-secondary-warm mb-0">Tarif pengiriman dihitung presisi berdasarkan koordinat jarak titik kirim.</p></div></div> <div class="hairline-top mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 small text-secondary-warm"><span>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} SEMAT Katalog. Proyek Simulasi E-Commerce Akademik.</span> <span>Seluruh transaksi bersifat simulasi demo.</span></div></div></footer>`);
	});
}
// src/lib/components/MiniCartOffcanvas.svelte
function MiniCartOffcanvas($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items = [] } = $$props;
		$$renderer.push(`<div class="offcanvas offcanvas-end" tabindex="-1" id="miniCartOffcanvas" aria-labelledby="miniCartOffcanvasLabel"><div class="offcanvas-header hairline-bottom"><div><span class="catalog-kicker d-block">Ringkasan Belanja</span> <h5 class="offcanvas-title font-heading fw-semibold mb-0" id="miniCartOffcanvasLabel">Keranjang Anda</h5></div> <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup keranjang"></button></div> <div class="offcanvas-body d-flex flex-column justify-content-between">`);
		if (items.length === 0) {
			$$renderer.push(`<!--[0--><div class="my-auto text-center px-3 py-5"><div class="surface-subtle d-inline-flex p-3 mb-3">`);
			Shopping_bag($$renderer, {
				size: 24,
				strokeWidth: 1.5,
				class: "text-secondary-warm"
			});
			$$renderer.push(`<!----></div> <h6 class="font-heading fw-semibold mb-2">Keranjang masih kosong</h6> <p class="small text-secondary-warm mb-4">Pilih holder kulit nabati, casing akrilik B2, atau paket lanyard untuk kebutuhan kantor dan panitia acara.</p> <a href="/katalog" class="btn btn-primary btn-sm d-inline-flex align-items-center gap-2" data-bs-dismiss="offcanvas"><span>Lihat Katalog Produk</span> `);
			Arrow_right($$renderer, { size: 15 });
			$$renderer.push(`<!----></a></div>`);
		} else $$renderer.push(`<!--[-1--><div></div>`);
		$$renderer.push(`<!--]--> <div class="hairline-top pt-3"><div class="d-flex justify-content-between align-items-center small text-secondary-warm mb-1"><span>Estimasi Ongkir</span> <span>Dihitung saat checkout</span></div></div></div></div>`);
	});
}
// src/lib/components/QuickViewModal.svelte
function QuickViewModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let product = derived(() => shopUI.quickViewProduct);
		let selectedVariantId = null;
		let activeVariant = derived(() => product()?.variants?.find((v) => v.id === selectedVariantId) || product()?.variants?.[0] || null);
		let currentPrice = derived(() => product() ? product().basePrice + (activeVariant()?.priceDelta || 0) : 0);
		let currentImage = derived(() => activeVariant()?.imageUrl || product()?.primaryImage || "/products/placeholder.svg");
		$$renderer.push(`<div class="modal fade" id="quickViewModal" tabindex="-1" aria-labelledby="quickViewModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header hairline-bottom"><div><span class="catalog-kicker d-block">Pratinjau Spesifikasi</span> <h5 class="modal-title font-heading fw-semibold mb-0" id="quickViewModalLabel">${escape_html(product()?.name || "Detail Produk")}</h5></div> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup pratinjau"></button></div> `);
		if (product()) {
			$$renderer.push(`<!--[0--><div class="modal-body p-4"><div class="row g-4 align-items-start"><div class="col-12 col-md-5"><div class="surface-subtle overflow-hidden" style="aspect-ratio: 1 / 1;"><img${attr("src", currentImage())}${attr("alt", product().name)} class="w-100 h-100 object-fit-cover" onerror="this.__e=event"/></div></div> <div class="col-12 col-md-7"><div class="d-flex flex-wrap gap-2 mb-2"><span class="badge bg-light text-dark border">${escape_html(product().category?.name)}</span> <span class="badge bg-light text-dark border">${escape_html(formatProductType(product().productType))}</span></div> <p class="price-tabular fs-4 mb-2">${escape_html(formatRupiah(currentPrice()))}</p> <p class="small text-secondary-warm mb-3">${escape_html(product().description)}</p> <div class="surface-subtle p-3 mb-3 small"><div class="d-flex justify-content-between py-1 hairline-bottom"><span class="text-secondary-warm">Material</span> <span class="fw-medium text-end">${escape_html(product().material)}</span></div> <div class="d-flex justify-content-between pt-1"><span class="text-secondary-warm">Ukuran Kartu</span> <span class="fw-medium text-end">${escape_html(product().cardSizeSpec)}</span></div></div> `);
			if (product().variants?.length > 0) {
				$$renderer.push(`<!--[0--><div class="mb-3"><label class="form-label small text-secondary-warm d-block">Varian Warna: <strong class="text-dark">${escape_html(activeVariant()?.colorName)}</strong></label> <div class="d-flex flex-wrap gap-2"><!--[-->`);
				const each_array = ensure_array_like(product().variants);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let v = each_array[$$index];
					$$renderer.push(`<button type="button"${attr_class(`btn btn-sm d-inline-flex align-items-center gap-2 ${activeVariant()?.id === v.id ? "btn-primary" : "btn-outline-hairline"}`)}><span class="rounded-circle border"${attr_style(`width: 12px; height: 12px; background-color: ${stringify(v.colorHex)}; display: inline-block;`)}></span> <span>${escape_html(v.colorName)}</span></button>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="d-flex align-items-center gap-2 small mb-4">`);
			if ((activeVariant()?.stock ?? 0) > 0) {
				$$renderer.push("<!--[0-->");
				Circle_check($$renderer, {
					size: 16,
					class: "text-success"
				});
				$$renderer.push(`<!----> <span>Tersedia ${escape_html(activeVariant().stock)} unit (SKU: ${escape_html(activeVariant().sku)})</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				Circle_x($$renderer, {
					size: 16,
					class: "text-danger"
				});
				$$renderer.push(`<!----> <span class="text-danger">Varian ini sedang habis</span>`);
			}
			$$renderer.push(`<!--]--></div> <div class="d-flex flex-wrap gap-2"><a${attr("href", `/produk/${stringify(product().slug)}`)} class="btn btn-primary d-inline-flex align-items-center gap-2"><span>Buka Halaman Produk Lengkap</span> `);
			Arrow_up_right($$renderer, { size: 16 });
			$$renderer.push(`<!----></a></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}
// src/lib/components/CompareBarModal.svelte
function CompareBarModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (shopUI.compareList.length > 0) {
			$$renderer.push(`<!--[0--><div class="position-fixed bottom-0 start-0 end-0 p-2 p-md-3" style="z-index: 1030; pointer-events: none;"><div class="container"><div class="surface-card p-2 p-md-3 d-flex flex-wrap align-items-center justify-content-between gap-2" style="pointer-events: auto; box-shadow: var(--shadow-overlay); border-color: var(--border-strong);"><div class="d-flex align-items-center gap-2 flex-wrap"><span class="badge btn-taupe d-inline-flex align-items-center gap-1 py-1.5 px-2.5">`);
			Scale($$renderer, { size: 14 });
			$$renderer.push(`<!----> <span>Bandingkan (${escape_html(shopUI.compareList.length)}/3)</span></span> <div class="d-flex align-items-center gap-2 flex-wrap"><!--[-->`);
			const each_array = ensure_array_like(shopUI.compareList);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<span class="badge bg-light text-dark border d-inline-flex align-items-center gap-1.5 py-1 px-2 fw-normal"><span class="text-truncate" style="max-width: 140px;">${escape_html(item.name)}</span> <button type="button" class="btn-close" style="font-size: 0.55rem;"${attr("aria-label", `Hapus ${stringify(item.name)}`)}></button></span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="d-flex align-items-center gap-2 ms-auto"><button type="button" class="btn btn-outline-hairline btn-sm">Kosongkan</button> <button type="button" class="btn btn-primary btn-sm"${attr("disabled", shopUI.compareList.length < 2, true)} data-bs-toggle="modal" data-bs-target="#compareProductsModal">${escape_html(shopUI.compareList.length < 2 ? "Pilih min. 2 produk" : "Bandingkan Sekarang")}</button></div></div></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="modal fade" id="compareProductsModal" tabindex="-1" aria-labelledby="compareProductsModalLabel" aria-hidden="true"><div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><div class="modal-header hairline-bottom"><div><span class="catalog-kicker d-block">Lembar Spesifikasi Berdampingan</span> <h5 class="modal-title font-heading fw-semibold mb-0" id="compareProductsModalLabel">Perbandingan Produk (${escape_html(shopUI.compareList.length)} Item)</h5></div> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button></div> <div class="modal-body p-0">`);
		if (shopUI.compareList.length > 0) {
			$$renderer.push(`<!--[0--><div class="table-responsive"><table class="table table-bordered align-middle mb-0"><thead><tr><th style="width: 180px; background-color: var(--bg-subtle);" class="small text-secondary-warm">Parameter</th><!--[-->`);
			const each_array_1 = ensure_array_like(shopUI.compareList);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let item = each_array_1[$$index_1];
				$$renderer.push(`<th class="p-3" style="min-width: 220px;"><div class="d-flex justify-content-between align-items-start gap-2 mb-2"><img${attr("src", item.primaryImage)}${attr("alt", item.name)} class="rounded border object-fit-cover" style="width: 72px; height: 72px; background-color: var(--bg-subtle);"/> <button type="button" class="btn btn-outline-hairline btn-sm p-1" aria-label="Hapus dari tabel">`);
				X($$renderer, { size: 14 });
				$$renderer.push(`<!----></button></div> <div class="font-heading fw-semibold small">${escape_html(item.name)}</div></th>`);
			}
			$$renderer.push(`<!--]--></tr></thead><tbody class="small"><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Harga Mulai</th><!--[-->`);
			const each_array_2 = ensure_array_like(shopUI.compareList);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let item = each_array_2[$$index_2];
				$$renderer.push(`<td class="price-tabular">${escape_html(formatRupiah(item.minPrice))}</td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Kategori &amp; Tipe</th><!--[-->`);
			const each_array_3 = ensure_array_like(shopUI.compareList);
			for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
				let item = each_array_3[$$index_3];
				$$renderer.push(`<td>${escape_html(item.category?.name)} — ${escape_html(formatProductType(item.productType))}</td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Material Utama</th><!--[-->`);
			const each_array_4 = ensure_array_like(shopUI.compareList);
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				let item = each_array_4[$$index_4];
				$$renderer.push(`<td>${escape_html(item.material)}</td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Spesifikasi Kartu</th><!--[-->`);
			const each_array_5 = ensure_array_like(shopUI.compareList);
			for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
				let item = each_array_5[$$index_5];
				$$renderer.push(`<td>${escape_html(item.cardSizeSpec)}</td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Pilihan Warna</th><!--[-->`);
			const each_array_6 = ensure_array_like(shopUI.compareList);
			for (let $$index_7 = 0, $$length = each_array_6.length; $$index_7 < $$length; $$index_7++) {
				let item = each_array_6[$$index_7];
				$$renderer.push(`<td><div class="d-flex flex-wrap gap-1.5"><!--[-->`);
				const each_array_7 = ensure_array_like(item.variants || []);
				for (let $$index_6 = 0, $$length = each_array_7.length; $$index_6 < $$length; $$index_6++) {
					let v = each_array_7[$$index_6];
					$$renderer.push(`<span class="badge bg-light text-dark border fw-normal d-inline-flex align-items-center gap-1"><span class="rounded-circle"${attr_style(`width: 9px; height: 9px; background-color: ${stringify(v.colorHex)}; display: inline-block;`)}></span> ${escape_html(v.colorName)}</span>`);
				}
				$$renderer.push(`<!--]--></div></td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Total Stok</th><!--[-->`);
			const each_array_8 = ensure_array_like(shopUI.compareList);
			for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
				let item = each_array_8[$$index_8];
				$$renderer.push(`<td>${escape_html(item.totalStock)} unit</td>`);
			}
			$$renderer.push(`<!--]--></tr><tr><th style="background-color: var(--bg-subtle);" class="text-secondary-warm fw-medium">Tindakan</th><!--[-->`);
			const each_array_9 = ensure_array_like(shopUI.compareList);
			for (let $$index_9 = 0, $$length = each_array_9.length; $$index_9 < $$length; $$index_9++) {
				let item = each_array_9[$$index_9];
				$$renderer.push(`<td><a${attr("href", `/produk/${stringify(item.slug)}`)} class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"><span>Lihat Detail</span> `);
				Arrow_up_right($$renderer, { size: 14 });
				$$renderer.push(`<!----></a></td>`);
			}
			$$renderer.push(`<!--]--></tr></tbody></table></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}
// src/lib/components/ToastContainer.svelte
function ToastContainer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		if (shopUI.toasts.length > 0) {
			$$renderer.push(`<!--[0--><div class="position-fixed top-0 end-0 p-3 d-flex flex-column gap-2" style="z-index: 1080; max-width: 360px; margin-top: 64px;"><!--[-->`);
			const each_array = ensure_array_like(shopUI.toasts);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let toast = each_array[$$index];
				$$renderer.push(`<div class="surface-card p-3 d-flex align-items-start justify-content-between gap-2 small"${attr_style(`box-shadow: var(--shadow-overlay); border-left: 3px solid ${toast.type === "warning" ? "#8a6424" : "#8a7f6a"};`)} role="status"><span>${escape_html(toast.message)}</span> <button type="button" class="btn btn-sm p-0 text-secondary-warm" aria-label="Tutup notifikasi">`);
				X($$renderer, { size: 15 });
				$$renderer.push(`<!----></button></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
// src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>SEMAT — Katalog Holder ID Card &amp; Lanyard</title>`);
			});
			$$renderer.push(`<meta name="description" content="Katalog perlengkapan kartu pengenal: holder kulit nabati, casing akrilik, retractable reel, dan paket lanyard untuk kantor, kampus, dan panitia."/>`);
		});
		$$renderer.push(`<div class="d-flex flex-column min-vh-100">`);
		Navbar($$renderer, {});
		$$renderer.push(`<!----> <main class="flex-grow-1">`);
		children($$renderer);
		$$renderer.push(`<!----></main> `);
		Footer($$renderer, {});
		$$renderer.push(`<!----></div> `);
		MiniCartOffcanvas($$renderer, {});
		$$renderer.push(`<!----> `);
		QuickViewModal($$renderer, {});
		$$renderer.push(`<!----> `);
		CompareBarModal($$renderer, {});
		$$renderer.push(`<!----> `);
		ToastContainer($$renderer, {});
		$$renderer.push(`<!---->`);
	});
}
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map