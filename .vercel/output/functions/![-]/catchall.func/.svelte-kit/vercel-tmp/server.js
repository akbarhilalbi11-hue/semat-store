import { create_server } from '../output/server/index.js';
const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set(["products/akrilik-bening-cr80.svg","products/akrilik-frost-cr80.svg","products/akrilik-horizontal-dual.svg","products/akrilik-panitia-b2.svg","products/kulit-horizontal-cognac.svg","products/kulit-horizontal-navy.svg","products/kulit-magnet-zaitun.svg","products/kulit-vertikal-hitam.svg","products/kulit-vertikal-tan.svg","products/kulit-vertikal-taupe.svg","products/lanyard-tissue-taupe.svg","products/lanyard-webbing-hitam.svg","products/paket-event-b2.svg","products/paket-lanyard-charcoal.svg","products/paket-lanyard-sand.svg","products/placeholder.svg","products/reel-karabiner-hitam.svg","products/reel-logam-grafit.svg","products/reel-logam-perak.svg","products/ref-commons-badge.jpg","products/ref-commons-leather.jpg","robots.txt"]),
	mime_types: {".svg":"image/svg+xml",".jpg":"image/jpeg",".txt":"text/plain"},
	client: {start:"_app/immutable/entry/start.pvQWDGp7.js",app:"_app/immutable/entry/app.C7qMRPON.js",imports:["_app/immutable/entry/start.pvQWDGp7.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/DclECHGd.js","_app/immutable/chunks/BwOVP0YM.js","_app/immutable/chunks/DKbX4OXp.js","_app/immutable/chunks/sThHrciS.js","_app/immutable/chunks/DDOeYbsk.js","_app/immutable/entry/app.C7qMRPON.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('../output/server/nodes/0.js')),
		__memo(() => import('../output/server/nodes/1.js')),
		__memo(() => import('../output/server/nodes/2.js')),
		__memo(() => import('../output/server/nodes/3.js')),
		__memo(() => import('../output/server/nodes/4.js')),
		__memo(() => import('../output/server/nodes/5.js')),
		__memo(() => import('../output/server/nodes/6.js')),
		__memo(() => import('../output/server/nodes/7.js')),
		__memo(() => import('../output/server/nodes/8.js'))
	],
	remotes: {
		
	},
	routes: [
		{
			id: "/",
			pattern: /^\/$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 2 },
			endpoint: null
		},
		{
			id: "/api/search",
			pattern: /^\/api\/search\/?$/,
			params: [],
			page: null,
			endpoint: __memo(() => import('../output/server/entries/endpoints/api/search/_server.js'))
		},
		{
			id: "/cara-pemesanan",
			pattern: /^\/cara-pemesanan\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 3 },
			endpoint: null
		},
		{
			id: "/faq",
			pattern: /^\/faq\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 4 },
			endpoint: null
		},
		{
			id: "/katalog",
			pattern: /^\/katalog\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 5 },
			endpoint: null
		},
		{
			id: "/kontak",
			pattern: /^\/kontak\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 6 },
			endpoint: null
		},
		{
			id: "/produk/[slug]",
			pattern: /^\/produk\/([^/]+?)\/?$/,
			params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 7 },
			endpoint: null
		},
		{
			id: "/tentang",
			pattern: /^\/tentang\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 8 },
			endpoint: null
		}
	],
	prerendered_routes: new Set([]),
	matchers: async () => {
		return {};
	},
	server_assets: {}
}
})();
export const server = create_server(manifest);