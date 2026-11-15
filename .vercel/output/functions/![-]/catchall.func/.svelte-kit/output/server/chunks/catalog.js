import { and, asc, desc, eq, inArray } from "drizzle-orm";
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { boolean, doublePrecision, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// src/lib/server/db/schema.js
var schema_exports = /* @__PURE__ */ __exportAll({
	addresses: () => addresses,
	cartItems: () => cartItems,
	carts: () => carts,
	categories: () => categories,
	orderItems: () => orderItems,
	orderStatusHistories: () => orderStatusHistories,
	orders: () => orders,
	payments: () => payments,
	productImages: () => productImages,
	productVariants: () => productVariants,
	products: () => products,
	sessions: () => sessions,
	settings: () => settings,
	users: () => users,
	wishlists: () => wishlists
});
var users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	whatsapp: text("whatsapp").notNull(),
	passwordHash: text("password_hash").notNull(),
	role: text("role").notNull().default("customer"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var sessions = pgTable("sessions", {
	id: serial("id").primaryKey(),
	tokenHash: text("token_hash").notNull().unique(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [index("idx_sessions_user_id").on(table.userId)]);
var addresses = pgTable("addresses", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	label: text("label").notNull().default("Kantor / Rumah"),
	recipientName: text("recipient_name").notNull(),
	phone: text("phone").notNull(),
	province: text("province").notNull(),
	city: text("city").notNull(),
	district: text("district").notNull(),
	postalCode: text("postal_code").notNull(),
	addressDetail: text("address_detail").notNull(),
	landmark: text("landmark"),
	latitude: doublePrecision("latitude").notNull(),
	longitude: doublePrecision("longitude").notNull(),
	isDefault: boolean("is_default").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [index("idx_addresses_user_id").on(table.userId)]);
var categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var products = pgTable("products", {
	id: serial("id").primaryKey(),
	categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "restrict" }),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	subtitle: text("subtitle").notNull(),
	description: text("description").notNull(),
	productType: text("product_type").notNull(),
	material: text("material").notNull(),
	cardSizeSpec: text("card_size_spec").notNull(),
	basePrice: integer("base_price").notNull(),
	isFeatured: boolean("is_featured").notNull().default(false),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [
	index("idx_products_category_id").on(table.categoryId),
	index("idx_products_type").on(table.productType),
	index("idx_products_active").on(table.isActive),
	index("idx_products_featured").on(table.isFeatured)
]);
var productVariants = pgTable("product_variants", {
	id: serial("id").primaryKey(),
	productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	colorName: text("color_name").notNull(),
	colorHex: text("color_hex").notNull(),
	sku: text("sku").notNull().unique(),
	priceDelta: integer("price_delta").notNull().default(0),
	stock: integer("stock").notNull().default(0),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [index("idx_variants_product_id").on(table.productId)]);
var productImages = pgTable("product_images", {
	id: serial("id").primaryKey(),
	productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	altText: text("alt_text").notNull(),
	sortOrder: integer("sort_order").notNull().default(0),
	isPrimary: boolean("is_primary").notNull().default(false)
}, (table) => [index("idx_images_product_id").on(table.productId)]);
var carts = pgTable("carts", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
	guestToken: text("guest_token").unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [index("idx_carts_user_id").on(table.userId)]);
var cartItems = pgTable("cart_items", {
	id: serial("id").primaryKey(),
	cartId: integer("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
	productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	variantId: integer("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull().default(1),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [uniqueIndex("uq_cart_variant").on(table.cartId, table.variantId)]);
var orders = pgTable("orders", {
	id: serial("id").primaryKey(),
	invoiceNumber: text("invoice_number").notNull().unique(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
	status: text("status").notNull().default("pending_payment"),
	recipientName: text("recipient_name").notNull(),
	recipientPhone: text("recipient_phone").notNull(),
	shippingProvince: text("shipping_province").notNull(),
	shippingCity: text("shipping_city").notNull(),
	shippingDistrict: text("shipping_district").notNull(),
	shippingPostalCode: text("shipping_postal_code").notNull(),
	shippingAddressDetail: text("shipping_address_detail").notNull(),
	shippingLandmark: text("shipping_landmark"),
	shippingLatitude: doublePrecision("shipping_latitude").notNull(),
	shippingLongitude: doublePrecision("shipping_longitude").notNull(),
	distanceMeters: integer("distance_meters").notNull().default(0),
	shippingService: text("shipping_service").notNull(),
	shippingEtd: text("shipping_etd").notNull(),
	shippingCost: integer("shipping_cost").notNull().default(0),
	subtotal: integer("subtotal").notNull(),
	totalAmount: integer("total_amount").notNull(),
	trackingNumber: text("tracking_number"),
	notes: text("notes"),
	expiresAt: timestamp("expires_at").notNull(),
	paidAt: timestamp("paid_at"),
	shippedAt: timestamp("shipped_at"),
	completedAt: timestamp("completed_at"),
	cancelledAt: timestamp("cancelled_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [
	index("idx_orders_user_id").on(table.userId),
	index("idx_orders_status").on(table.status),
	index("idx_orders_created_at").on(table.createdAt)
]);
var orderItems = pgTable("order_items", {
	id: serial("id").primaryKey(),
	orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
	variantId: integer("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
	productNameSnapshot: text("product_name_snapshot").notNull(),
	variantNameSnapshot: text("variant_name_snapshot").notNull(),
	skuSnapshot: text("sku_snapshot").notNull(),
	unitPrice: integer("unit_price").notNull(),
	quantity: integer("quantity").notNull(),
	subtotal: integer("subtotal").notNull()
}, (table) => [index("idx_order_items_order_id").on(table.orderId)]);
var payments = pgTable("payments", {
	id: serial("id").primaryKey(),
	orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	provider: text("provider").notNull().default("simulated"),
	providerRef: text("provider_ref").unique(),
	methodCode: text("method_code").notNull(),
	methodName: text("method_name").notNull(),
	status: text("status").notNull().default("pending"),
	amount: integer("amount").notNull(),
	paymentCode: text("payment_code").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	paidAt: timestamp("paid_at"),
	payload: jsonb("payload"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => [index("idx_payments_order_id").on(table.orderId), index("idx_payments_status").on(table.status)]);
var orderStatusHistories = pgTable("order_status_histories", {
	id: serial("id").primaryKey(),
	orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	fromStatus: text("from_status"),
	toStatus: text("to_status").notNull(),
	actorRole: text("actor_role").notNull().default("system"),
	actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
	note: text("note"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [index("idx_status_histories_order_id").on(table.orderId)]);
var wishlists = pgTable("wishlists", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [uniqueIndex("uq_wishlist_user_product").on(table.userId, table.productId)]);
var settings = pgTable("settings", {
	key: text("key").primaryKey(),
	value: jsonb("value").notNull(),
	description: text("description"),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
// src/lib/server/db/index.js
var connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL belum diatur di file .env atau Environment Variables.");
var isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1") || connectionString.includes("sslmode=disable");
var client = postgres(connectionString, {
	ssl: isLocal ? false : "require",
	prepare: false,
	max: isLocal ? 10 : 5
});
var db = drizzle(client, { schema: schema_exports });
// src/lib/server/catalog.js
/**
* Mengambil seluruh produk aktif beserta kategori, varian aktif, dan galeri gambar
*/
async function getAllHydratedProducts() {
	const rows = await db.select({
		product: products,
		category: categories
	}).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).where(eq(products.isActive, true)).orderBy(desc(products.createdAt), asc(products.id));
	if (rows.length === 0) return [];
	const productIds = rows.map((r) => r.product.id);
	const [variants, images] = await Promise.all([db.select().from(productVariants).where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true))).orderBy(asc(productVariants.id)), db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder), asc(productImages.id))]);
	const variantsByProduct = /* @__PURE__ */ new Map();
	for (const v of variants) {
		if (!variantsByProduct.has(v.productId)) variantsByProduct.set(v.productId, []);
		variantsByProduct.get(v.productId).push(v);
	}
	const imagesByProduct = /* @__PURE__ */ new Map();
	for (const img of images) {
		if (!imagesByProduct.has(img.productId)) imagesByProduct.set(img.productId, []);
		imagesByProduct.get(img.productId).push(img);
	}
	return rows.map(({ product, category }) => {
		const prodVariants = variantsByProduct.get(product.id) || [];
		const prodImages = imagesByProduct.get(product.id) || [];
		const totalStock = prodVariants.reduce((sum, v) => sum + v.stock, 0);
		const prices = prodVariants.map((v) => product.basePrice + v.priceDelta);
		const minPrice = prices.length > 0 ? Math.min(...prices) : product.basePrice;
		const maxPrice = prices.length > 0 ? Math.max(...prices) : product.basePrice;
		return {
			...product,
			category,
			variants: prodVariants,
			images: prodImages,
			primaryImage: prodImages[0]?.url || "/products/placeholder.svg",
			secondaryImage: prodImages[1]?.url || prodImages[0]?.url || "/products/placeholder.svg",
			totalStock,
			minPrice,
			maxPrice
		};
	});
}
/**
* Mengambil data khusus halaman Beranda (kategori + produk unggulan + koleksi pilihan)
*/
async function getHomePageData() {
	const [allCategories, allProducts] = await Promise.all([db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)), getAllHydratedProducts()]);
	return {
		categories: allCategories.map((cat) => ({
			...cat,
			productCount: allProducts.filter((p) => p.categoryId === cat.id).length,
			coverImage: allProducts.find((p) => p.categoryId === cat.id)?.primaryImage || "/products/placeholder.svg"
		})),
		featuredProducts: allProducts.filter((p) => p.isFeatured).slice(0, 4),
		latestProducts: allProducts.slice(0, 6),
		totalProducts: allProducts.length
	};
}
/**
* Mengambil data Katalog lengkap dengan filter, pencarian, pengurutan, dan pagination
* @param {URLSearchParams} searchParams
*/
async function getCatalogData(searchParams) {
	const [allCategories, allProducts] = await Promise.all([db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)), getAllHydratedProducts()]);
	const colorMap = /* @__PURE__ */ new Map();
	const materialSet = /* @__PURE__ */ new Set();
	for (const p of allProducts) {
		materialSet.add(p.material);
		for (const v of p.variants) if (!colorMap.has(v.colorName)) colorMap.set(v.colorName, v.colorHex);
	}
	const q = (searchParams.get("q") || "").trim().toLowerCase();
	const kategori = searchParams.get("kategori") || "";
	const tipe = searchParams.get("tipe") || "";
	const warna = searchParams.get("warna") || "";
	const material = searchParams.get("material") || "";
	const minHarga = Number(searchParams.get("minHarga")) || 0;
	const maxHarga = Number(searchParams.get("maxHarga")) || 0;
	const urut = searchParams.get("urut") || "terbaru";
	const page = Math.max(1, Number(searchParams.get("page")) || 1);
	const perPage = 8;
	let filtered = allProducts.filter((p) => {
		if (kategori && p.category.slug !== kategori) return false;
		if (tipe && p.productType !== tipe) return false;
		if (material && p.material !== material) return false;
		if (warna && !p.variants.some((v) => v.colorName === warna)) return false;
		if (minHarga > 0 && p.maxPrice < minHarga) return false;
		if (maxHarga > 0 && p.minPrice > maxHarga) return false;
		if (q) {
			if (!`${p.name} ${p.subtitle} ${p.description} ${p.material} ${p.cardSizeSpec} ${p.category.name}`.toLowerCase().includes(q)) return false;
		}
		return true;
	});
	if (urut === "harga_asc") filtered = [...filtered].sort((a, b) => a.minPrice - b.minPrice);
	else if (urut === "harga_desc") filtered = [...filtered].sort((a, b) => b.minPrice - a.minPrice);
	else if (urut === "nama_asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "id"));
	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
	const safePage = Math.min(page, totalPages);
	const offset = (safePage - 1) * perPage;
	return {
		items: filtered.slice(offset, offset + perPage),
		categories: allCategories,
		availableColors: Array.from(colorMap.entries()).map(([name, hex]) => ({
			name,
			hex
		})),
		availableMaterials: Array.from(materialSet),
		filters: {
			q,
			kategori,
			tipe,
			warna,
			material,
			minHarga,
			maxHarga,
			urut
		},
		pagination: {
			page: safePage,
			perPage,
			totalItems,
			totalPages
		}
	};
}
/**
* Mengambil detail satu produk berdasarkan slug beserta produk terkait
* @param {string} slug
*/
async function getProductDetailBySlug(slug) {
	const allProducts = await getAllHydratedProducts();
	const product = allProducts.find((p) => p.slug === slug) || null;
	if (!product) return null;
	return {
		product,
		relatedProducts: allProducts.filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.productType === product.productType)).slice(0, 4)
	};
}
/**
* Pencarian cepat untuk dropdown live-search di header
* @param {string} query
*/
async function searchProductsQuick(query) {
	const q = query.trim().toLowerCase();
	if (q.length < 2) return [];
	return (await getAllHydratedProducts()).filter((p) => {
		return `${p.name} ${p.subtitle} ${p.material} ${p.category.name}`.toLowerCase().includes(q);
	}).slice(0, 5).map((p) => ({
		id: p.id,
		slug: p.slug,
		name: p.name,
		categoryName: p.category.name,
		minPrice: p.minPrice,
		image: p.primaryImage,
		cardSizeSpec: p.cardSizeSpec
	}));
}
export { searchProductsQuick as i, getHomePageData as n, getProductDetailBySlug as r, getCatalogData as t };

//# sourceMappingURL=catalog.js.map