import { r as getProductDetailBySlug } from "../../../../chunks/catalog.js";
import { error } from "@sveltejs/kit";
// src/routes/produk/[slug]/+page.server.js
async function load({ params }) {
	const result = await getProductDetailBySlug(params.slug);
	if (!result) throw error(404, "Produk tidak ditemukan di katalog SEMAT.");
	return result;
}
export { load };

//# sourceMappingURL=_page.server.js.map