import { eq, asc, desc, inArray, and, ne } from 'drizzle-orm';
import { db } from './db/index.js';
import { categories, products, productVariants, productImages } from './db/schema.js';

/**
 * Mengambil seluruh produk aktif beserta kategori, varian aktif, dan galeri gambar
 */
export async function getAllHydratedProducts() {
	const rows = await db
		.select({
			product: products,
			category: categories
		})
		.from(products)
		.innerJoin(categories, eq(products.categoryId, categories.id))
		.where(eq(products.isActive, true))
		.orderBy(desc(products.createdAt), asc(products.id));

	if (rows.length === 0) return [];

	const productIds = rows.map((r) => r.product.id);

	const [variants, images] = await Promise.all([
		db
			.select()
			.from(productVariants)
			.where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true)))
			.orderBy(asc(productVariants.id)),
		db
			.select()
			.from(productImages)
			.where(inArray(productImages.productId, productIds))
			.orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder), asc(productImages.id))
	]);

	const variantsByProduct = new Map();
	for (const v of variants) {
		if (!variantsByProduct.has(v.productId)) variantsByProduct.set(v.productId, []);
		variantsByProduct.get(v.productId).push(v);
	}

	const imagesByProduct = new Map();
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
			primaryImage: prodImages[0]?.url || '/products/placeholder.svg',
			secondaryImage: prodImages[1]?.url || prodImages[0]?.url || '/products/placeholder.svg',
			totalStock,
			minPrice,
			maxPrice
		};
	});
}

/**
 * Mengambil data khusus halaman Beranda (kategori + produk unggulan + koleksi pilihan)
 */
export async function getHomePageData() {
	const [allCategories, allProducts] = await Promise.all([
		db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
		getAllHydratedProducts()
	]);

	const categoriesWithCount = allCategories.map((cat) => ({
		...cat,
		productCount: allProducts.filter((p) => p.categoryId === cat.id).length,
		coverImage:
			allProducts.find((p) => p.categoryId === cat.id)?.primaryImage || '/products/placeholder.svg'
	}));

	const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
	const latestProducts = allProducts.slice(0, 6);

	return {
		categories: categoriesWithCount,
		featuredProducts,
		latestProducts,
		totalProducts: allProducts.length
	};
}

/**
 * Mengambil data Katalog lengkap dengan filter, pencarian, pengurutan, dan pagination
 * @param {URLSearchParams} searchParams
 */
export async function getCatalogData(searchParams) {
	const [allCategories, allProducts] = await Promise.all([
		db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
		getAllHydratedProducts()
	]);

	// Kumpulkan opsi facet unik dari produk aktif
	const colorMap = new Map();
	const materialSet = new Set();

	for (const p of allProducts) {
		materialSet.add(p.material);
		for (const v of p.variants) {
			if (!colorMap.has(v.colorName)) {
				colorMap.set(v.colorName, v.colorHex);
			}
		}
	}

	const q = (searchParams.get('q') || '').trim().toLowerCase();
	const kategori = searchParams.get('kategori') || '';
	const tipe = searchParams.get('tipe') || '';
	const warna = searchParams.get('warna') || '';
	const material = searchParams.get('material') || '';
	const minHarga = Number(searchParams.get('minHarga')) || 0;
	const maxHarga = Number(searchParams.get('maxHarga')) || 0;
	const urut = searchParams.get('urut') || 'terbaru';
	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const perPage = 8;

	let filtered = allProducts.filter((p) => {
		if (kategori && p.category.slug !== kategori) return false;
		if (tipe && p.productType !== tipe) return false;
		if (material && p.material !== material) return false;
		if (warna && !p.variants.some((v) => v.colorName === warna)) return false;
		if (minHarga > 0 && p.maxPrice < minHarga) return false;
		if (maxHarga > 0 && p.minPrice > maxHarga) return false;

		if (q) {
			const haystack = `${p.name} ${p.subtitle} ${p.description} ${p.material} ${p.cardSizeSpec} ${p.category.name}`.toLowerCase();
			if (!haystack.includes(q)) return false;
		}
		return true;
	});

	// Pengurutan
	if (urut === 'harga_asc') {
		filtered = [...filtered].sort((a, b) => a.minPrice - b.minPrice);
	} else if (urut === 'harga_desc') {
		filtered = [...filtered].sort((a, b) => b.minPrice - a.minPrice);
	} else if (urut === 'nama_asc') {
		filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'id'));
	}

	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
	const safePage = Math.min(page, totalPages);
	const offset = (safePage - 1) * perPage;
	const items = filtered.slice(offset, offset + perPage);

	return {
		items,
		categories: allCategories,
		availableColors: Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex })),
		availableMaterials: Array.from(materialSet),
		filters: { q, kategori, tipe, warna, material, minHarga, maxHarga, urut },
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
export async function getProductDetailBySlug(slug) {
	const allProducts = await getAllHydratedProducts();
	const product = allProducts.find((p) => p.slug === slug) || null;
	if (!product) return null;

	const relatedProducts = allProducts
		.filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.productType === product.productType))
		.slice(0, 4);

	return {
		product,
		relatedProducts
	};
}

/**
 * Pencarian cepat untuk dropdown live-search di header
 * @param {string} query
 */
export async function searchProductsQuick(query) {
	const q = query.trim().toLowerCase();
	if (q.length < 2) return [];

	const allProducts = await getAllHydratedProducts();
	return allProducts
		.filter((p) => {
			const text = `${p.name} ${p.subtitle} ${p.material} ${p.category.name}`.toLowerCase();
			return text.includes(q);
		})
		.slice(0, 5)
		.map((p) => ({
			id: p.id,
			slug: p.slug,
			name: p.name,
			categoryName: p.category.name,
			minPrice: p.minPrice,
			image: p.primaryImage,
			cardSizeSpec: p.cardSizeSpec
		}));
}