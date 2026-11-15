import { t as getCatalogData } from "../../../chunks/catalog.js";
// src/routes/katalog/+page.server.js
async function load({ url }) {
	return await getCatalogData(url.searchParams);
}
export { load };

//# sourceMappingURL=_page.server.js.map