import { i as searchProductsQuick } from "../../../../chunks/catalog.js";
import { json } from "@sveltejs/kit";
// src/routes/api/search/+server.js
async function GET({ url }) {
	const q = url.searchParams.get("q") || "";
	const results = await searchProductsQuick(q);
	return json({ results });
}
export { GET };

//# sourceMappingURL=_server.js.map