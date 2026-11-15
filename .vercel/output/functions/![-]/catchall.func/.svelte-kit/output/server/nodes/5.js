import * as server from '../entries/pages/katalog/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/katalog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/katalog/+page.server.js";
export const imports = ["_app/immutable/nodes/5.Cjd5HIhL.js","_app/immutable/chunks/sThHrciS.js","_app/immutable/chunks/DDOeYbsk.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/DKbX4OXp.js","_app/immutable/chunks/DAd9N9Mi.js","_app/immutable/chunks/jRt7czUO.js","_app/immutable/chunks/B4NDvce-.js","_app/immutable/chunks/27FwEGxI.js","_app/immutable/chunks/D8fMqcz6.js"];
export const stylesheets = ["_app/immutable/assets/ProductCard.gX2lP8Xn.css"];
export const fonts = [];
