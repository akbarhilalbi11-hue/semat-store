import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.B3OjMsuF.js","_app/immutable/chunks/sThHrciS.js","_app/immutable/chunks/DLULdf1B.js","_app/immutable/chunks/jRt7czUO.js","_app/immutable/chunks/B4NDvce-.js","_app/immutable/chunks/D8fMqcz6.js"];
export const stylesheets = ["_app/immutable/assets/ProductCard.gX2lP8Xn.css"];
export const fonts = [];
