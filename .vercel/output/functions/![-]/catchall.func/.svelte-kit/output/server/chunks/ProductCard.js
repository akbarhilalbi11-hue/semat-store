import { a as derived, b as escape_html, d as sanitize_props, f as slot, g as attr, m as stringify, n as attr_style, p as spread_props, s as ensure_array_like, t as attr_class } from "./server.js";
import { a as Icon, i as Scale, n as formatProductType, r as formatRupiah, t as shopUI } from "./shop-ui.svelte.js";
// node_modules/lucide-svelte/dist/icons/eye.svelte
function Eye($$renderer, $$props) {
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
		{ name: "eye" },
		$$sanitized_props,
		{
			/**
			* @component @name Eye
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", {
				"cx": "12",
				"cy": "12",
				"r": "3"
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
// src/lib/components/ProductCard.svelte
function ProductCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { product } = $$props;
		let selectedVariantId = product.variants?.[0]?.id ?? null;
		let activeVariant = derived(() => product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0] || null);
		let displayPrice = derived(() => activeVariant() ? product.basePrice + activeVariant().priceDelta : product.minPrice);
		let displayImage = derived(() => {
			if (activeVariant()?.imageUrl) return activeVariant().imageUrl;
			return product.primaryImage;
		});
		let inCompare = derived(() => shopUI.isInCompare(product.id));
		$$renderer.push(`<article class="surface-card h-100 d-flex flex-column overflow-hidden product-card svelte-11ja2cl"><div class="position-relative" style="background-color: var(--bg-subtle); aspect-ratio: 1 / 1;"><a${attr("href", `/produk/${stringify(product.slug)}`)} class="d-block w-100 h-100 text-decoration-none"><img${attr("src", displayImage())}${attr("alt", product.images?.[0]?.altText || product.name)} class="w-100 h-100 object-fit-cover product-card-img svelte-11ja2cl" loading="lazy" onerror="this.__e=event"/></a> <div class="position-absolute top-0 start-0 p-2 d-flex flex-wrap gap-1"><span class="badge bg-white text-dark border fw-normal" style="font-size: 0.7rem;">${escape_html(formatProductType(product.productType))}</span> `);
		if (product.totalStock === 0) $$renderer.push(`<!--[0--><span class="badge" style="background-color: var(--status-danger-bg); color: var(--status-danger-text); font-size: 0.7rem;">Stok Habis</span>`);
		else if (product.totalStock <= 5) $$renderer.push(`<!--[1--><span class="badge" style="background-color: var(--status-warning-bg); color: var(--status-warning-text); font-size: 0.7rem;">Sisa ${escape_html(product.totalStock)}</span>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1"><button type="button" class="btn btn-sm bg-white border p-1.5 shadow-sm" title="Lihat cepat spesifikasi produk"${attr("aria-label", `Lihat cepat ${stringify(product.name)}`)}>`);
		Eye($$renderer, {
			size: 15,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----></button> <button type="button"${attr_class(`btn btn-sm border p-1.5 shadow-sm ${inCompare() ? "btn-taupe" : "bg-white"}`)}${attr("title", inCompare() ? "Hapus dari perbandingan" : "Bandingkan produk")}${attr("aria-label", `Bandingkan ${stringify(product.name)}`)}>`);
		Scale($$renderer, {
			size: 15,
			strokeWidth: 1.75
		});
		$$renderer.push(`<!----></button></div></div> <div class="p-3 d-flex flex-column flex-grow-1 justify-content-between"><div><span class="catalog-kicker d-block mb-1" style="font-size: 0.68rem;">${escape_html(product.category?.name)}</span> <h3 class="h6 font-heading fw-semibold mb-1"><a${attr("href", `/produk/${stringify(product.slug)}`)} class="text-decoration-none text-dark stretched-link-title">${escape_html(product.name)}</a></h3> <p class="small text-secondary-warm mb-3" style="font-size: 0.8125rem; line-height: 1.45;">${escape_html(product.subtitle)}</p></div> <div>`);
		if (product.variants && product.variants.length > 0) {
			$$renderer.push(`<!--[0--><div class="d-flex align-items-center justify-content-between mb-3"><div class="d-flex align-items-center gap-1.5" role="group" aria-label="Pilih warna varian"><!--[-->`);
			const each_array = ensure_array_like(product.variants);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let variant = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class(`swatch-btn ${activeVariant()?.id === variant.id ? "active" : ""}`, "svelte-11ja2cl")}${attr_style(`background-color: ${stringify(variant.colorHex)};`)}${attr("title", `${stringify(variant.colorName)} (Stok: ${stringify(variant.stock)})`)}${attr("aria-label", `Warna ${stringify(variant.colorName)}`)}></button>`);
			}
			$$renderer.push(`<!--]--></div> <span class="small text-secondary-warm" style="font-size: 0.75rem;">${escape_html(activeVariant()?.colorName)}</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="hairline-top pt-2 d-flex align-items-center justify-content-between gap-2"><span class="price-tabular fs-6">${escape_html(formatRupiah(displayPrice()))}</span> <a${attr("href", `/produk/${stringify(product.slug)}`)} class="btn btn-outline-hairline btn-sm px-2.5 py-1 small">Detail</a></div></div></div></article>`);
	});
}
export { ProductCard as t };

//# sourceMappingURL=ProductCard.js.map