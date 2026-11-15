import {
	pgTable,
	serial,
	text,
	integer,
	boolean,
	timestamp,
	doublePrecision,
	jsonb,
	index,
	uniqueIndex
} from 'drizzle-orm/pg-core';

// 1. Pengguna (Customer & Admin)
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	whatsapp: text('whatsapp').notNull(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull().default('customer'), // 'customer' | 'admin'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 2. Sesi Login (Token acak disimpan dalam bentuk hash SHA-256)
export const sessions = pgTable(
	'sessions',
	{
		id: serial('id').primaryKey(),
		tokenHash: text('token_hash').notNull().unique(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('idx_sessions_user_id').on(table.userId)]
);

// 3. Buku Alamat Pelanggan (Koordinat peta Leaflet & penanda alamat utama)
export const addresses = pgTable(
	'addresses',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		label: text('label').notNull().default('Kantor / Rumah'),
		recipientName: text('recipient_name').notNull(),
		phone: text('phone').notNull(),
		province: text('province').notNull(),
		city: text('city').notNull(),
		district: text('district').notNull(),
		postalCode: text('postal_code').notNull(),
		addressDetail: text('address_detail').notNull(),
		landmark: text('landmark'),
		latitude: doublePrecision('latitude').notNull(),
		longitude: doublePrecision('longitude').notNull(),
		isDefault: boolean('is_default').notNull().default(false),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('idx_addresses_user_id').on(table.userId)]
);

// 4. Kategori Produk
export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// 5. Produk Katalog (Harga dalam integer rupiah)
export const products = pgTable(
	'products',
	{
		id: serial('id').primaryKey(),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict' }),
		name: text('name').notNull(),
		slug: text('slug').notNull().unique(),
		subtitle: text('subtitle').notNull(),
		description: text('description').notNull(),
		productType: text('product_type').notNull(), // 'vertikal' | 'horizontal' | 'reel' | 'paket' | 'aksesori'
		material: text('material').notNull(),
		cardSizeSpec: text('card_size_spec').notNull(),
		basePrice: integer('base_price').notNull(),
		isFeatured: boolean('is_featured').notNull().default(false),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_products_category_id').on(table.categoryId),
		index('idx_products_type').on(table.productType),
		index('idx_products_active').on(table.isActive),
		index('idx_products_featured').on(table.isFeatured)
	]
);

// 6. Varian Produk (Warna/Tipe, SKU, selisih harga rupiah, stok)
export const productVariants = pgTable(
	'product_variants',
	{
		id: serial('id').primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		colorName: text('color_name').notNull(),
		colorHex: text('color_hex').notNull(),
		sku: text('sku').notNull().unique(),
		priceDelta: integer('price_delta').notNull().default(0),
		stock: integer('stock').notNull().default(0),
		imageUrl: text('image_url'),
		isActive: boolean('is_active').notNull().default(true),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('idx_variants_product_id').on(table.productId)]
);

// 7. Galeri Gambar Produk
export const productImages = pgTable(
	'product_images',
	{
		id: serial('id').primaryKey(),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		url: text('url').notNull(),
		altText: text('alt_text').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		isPrimary: boolean('is_primary').notNull().default(false)
	},
	(table) => [index('idx_images_product_id').on(table.productId)]
);

// 8. Keranjang Belanja (Mendukung tamu via guest_token maupun pelanggan login)
export const carts = pgTable(
	'carts',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
		guestToken: text('guest_token').unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('idx_carts_user_id').on(table.userId)]
);

// 9. Item Keranjang
export const cartItems = pgTable(
	'cart_items',
	{
		id: serial('id').primaryKey(),
		cartId: integer('cart_id')
			.notNull()
			.references(() => carts.id, { onDelete: 'cascade' }),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		variantId: integer('variant_id')
			.notNull()
			.references(() => productVariants.id, { onDelete: 'cascade' }),
		quantity: integer('quantity').notNull().default(1),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('uq_cart_variant').on(table.cartId, table.variantId)]
);

// 10. Pesanan (State Machine & Snapshot Alamat Penerima)
export const orders = pgTable(
	'orders',
	{
		id: serial('id').primaryKey(),
		invoiceNumber: text('invoice_number').notNull().unique(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		// State machine: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'expired'
		status: text('status').notNull().default('pending_payment'),
		recipientName: text('recipient_name').notNull(),
		recipientPhone: text('recipient_phone').notNull(),
		shippingProvince: text('shipping_province').notNull(),
		shippingCity: text('shipping_city').notNull(),
		shippingDistrict: text('shipping_district').notNull(),
		shippingPostalCode: text('shipping_postal_code').notNull(),
		shippingAddressDetail: text('shipping_address_detail').notNull(),
		shippingLandmark: text('shipping_landmark'),
		shippingLatitude: doublePrecision('shipping_latitude').notNull(),
		shippingLongitude: doublePrecision('shipping_longitude').notNull(),
		distanceMeters: integer('distance_meters').notNull().default(0),
		shippingService: text('shipping_service').notNull(),
		shippingEtd: text('shipping_etd').notNull(),
		shippingCost: integer('shipping_cost').notNull().default(0),
		subtotal: integer('subtotal').notNull(),
		totalAmount: integer('total_amount').notNull(),
		trackingNumber: text('tracking_number'),
		notes: text('notes'),
		expiresAt: timestamp('expires_at').notNull(),
		paidAt: timestamp('paid_at'),
		shippedAt: timestamp('shipped_at'),
		completedAt: timestamp('completed_at'),
		cancelledAt: timestamp('cancelled_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_orders_user_id').on(table.userId),
		index('idx_orders_status').on(table.status),
		index('idx_orders_created_at').on(table.createdAt)
	]
);

// 11. Item Pesanan (Snapshot nama & harga saat transaksi terjadi)
export const orderItems = pgTable(
	'order_items',
	{
		id: serial('id').primaryKey(),
		orderId: integer('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		    productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
	        variantId: integer('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
		productNameSnapshot: text('product_name_snapshot').notNull(),
		variantNameSnapshot: text('variant_name_snapshot').notNull(),
		skuSnapshot: text('sku_snapshot').notNull(),
		unitPrice: integer('unit_price').notNull(),
		quantity: integer('quantity').notNull(),
		subtotal: integer('subtotal').notNull()
	},
	(table) => [index('idx_order_items_order_id').on(table.orderId)]
);

// 12. Pembayaran (Siap migrasi dari 'simulated' ke payment gateway asli)
export const payments = pgTable(
	'payments',
	{
		id: serial('id').primaryKey(),
		orderId: integer('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		provider: text('provider').notNull().default('simulated'),
		providerRef: text('provider_ref').unique(),
		methodCode: text('method_code').notNull(),
		methodName: text('method_name').notNull(),
		status: text('status').notNull().default('pending'), // 'pending' | 'paid' | 'failed' | 'expired'
		amount: integer('amount').notNull(),
		paymentCode: text('payment_code').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		paidAt: timestamp('paid_at'),
		payload: jsonb('payload'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		index('idx_payments_order_id').on(table.orderId),
		index('idx_payments_status').on(table.status)
	]
);

// 13. Riwayat Perubahan Status Pesanan (Audit Trail)
export const orderStatusHistories = pgTable(
	'order_status_histories',
	{
		id: serial('id').primaryKey(),
		orderId: integer('order_id')
			.notNull()
			.references(() => orders.id, { onDelete: 'cascade' }),
		fromStatus: text('from_status'),
		toStatus: text('to_status').notNull(),
		actorRole: text('actor_role').notNull().default('system'), // 'customer' | 'admin' | 'system'
		actorId: integer('actor_id').references(() => users.id, { onDelete: 'set null' }),
		note: text('note'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('idx_status_histories_order_id').on(table.orderId)]
);

// 14. Daftar Keinginan (Wishlist)
export const wishlists = pgTable(
	'wishlists',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('uq_wishlist_user_product').on(table.userId, table.productId)]
);

// 15. Pengaturan Toko (Key-Value JSONB: info toko, koordinat, zona ongkir, metode bayar)
export const settings = pgTable('settings', {
	key: text('key').primaryKey(),
	value: jsonb('value').notNull(),
	description: text('description'),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});