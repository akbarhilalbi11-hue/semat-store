import * as server from '../entries/pages/produk/_slug_/_page.server.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/produk/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/produk/[slug]/+page.server.js";
export const imports = ["_app/immutable/nodes/7.DZcYJ4Uy.js","_app/immutable/chunks/sThHrciS.js","_app/immutable/chunks/CdS2_lpZ.js","_app/immutable/chunks/jRt7czUO.js","_app/immutable/chunks/B4NDvce-.js","_app/immutable/chunks/D8fMqcz6.js"];
export const stylesheets = ["_app/immutable/assets/ProductCard.gX2lP8Xn.css","_app/immutable/assets/7.D606SEbh.css"];
export const fonts = [];
