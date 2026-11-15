import { n as getHomePageData } from "../../chunks/catalog.js";
// src/routes/+page.server.js
async function load() {
	return await getHomePageData();
}
export { load };

//# sourceMappingURL=_page.server.js.map