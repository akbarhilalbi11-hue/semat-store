import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, client } from './index.js';
import {
	users,
	addresses,
	categories,
	products,
	productVariants,
	productImages,
	orders,
	orderItems,
	payments,
	orderStatusHistories,
	settings
} from './schema.js';

console.log('Memulai pengisian data awal (seeder) SEMAT Katalog...');

// 1. Pengaturan Toko, Koordinat Pamulang, Zona Ongkir & Metode Pembayaran
await db
	.insert(settings)
	.values([
		{
			key: 'store_info',
			description: 'Identitas operasional dan titik pengiriman toko',
			value: {
				name: 'SEMAT — Studio Holder Kartu & Lanyard',
				tagline: 'Perlengkapan identitas harian untuk kantor, kampus, dan panitia acara.',
				email: 'halo@semat-katalog.id',
				whatsapp: '6281288904410',
				address: 'Jl. Surya Kencana No. 18, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
				latitude: -6.3428,
				longitude: 106.7383
			}
		},
		{
			key: 'shipping_config',
			description: 'Tarif dasar per zona jarak (km) dan pengali jenis layanan',
			value: {
				zones: [
					{ id: 'z1', name: 'Zona 1 — Lokal Tangerang Selatan (0–10 km)', maxKm: 10, baseCost: 9000 },
					{ id: 'z2', name: 'Zona 2 — Jabodetabek Dekat (10–30 km)', maxKm: 30, baseCost: 14000 },
					{ id: 'z3', name: 'Zona 3 — Jabodetabek Luar & Banten (30–75 km)', maxKm: 75, baseCost: 20000 },
					{ id: 'z4', name: 'Zona 4 — Luar Kota / Antar Provinsi (>75 km)', maxKm: 99999, baseCost: 28000 }
				],
				services: [
					{ code: 'reguler', name: 'Reguler (Kurir Standar)', multiplier: 1.0, etd: '2–3 hari kerja', active: true },
					{ code: 'ekspres', name: 'Ekspres (Prioritas Besok Sampai)', multiplier: 1.5, etd: '1 hari kerja', active: true },
					{ code: 'instan', name: 'Instan (Kurir Motor Langsung)', multiplier: 2.2, maxKm: 40, etd: '2–4 jam', active: true }
				]
			}
		},
		{
			key: 'payment_methods',
			description: 'Daftar saluran pembayaran simulasi yang aktif di checkout',
			value: [
				{ code: 'va_bca', group: 'Virtual Account', name: 'BCA Virtual Account', prefix: '39012', fee: 0, active: true },
				{ code: 'va_mandiri', group: 'Virtual Account', name: 'Mandiri Virtual Account', prefix: '88908', fee: 0, active: true },
				{ code: 'va_bni', group: 'Virtual Account', name: 'BNI Virtual Account', prefix: '82410', fee: 0, active: true },
				{ code: 'va_bri', group: 'Virtual Account', name: 'BRI Virtual Account', prefix: '26215', fee: 0, active: true },
				{ code: 'qris', group: 'QRIS', name: 'QRIS (Semua Aplikasi Bank & E-Wallet)', prefix: 'QRIS', fee: 0, active: true },
				{ code: 'ewallet_gopay', group: 'E-Wallet', name: 'GoPay', prefix: 'GP', fee: 0, active: true },
				{ code: 'ewallet_ovo', group: 'E-Wallet', name: 'OVO', prefix: 'OVO', fee: 0, active: true },
				{ code: 'ewallet_dana', group: 'E-Wallet', name: 'DANA', prefix: 'DANA', fee: 0, active: true },
				{ code: 'ewallet_shopeepay', group: 'E-Wallet', name: 'ShopeePay', prefix: 'SPAY', fee: 0, active: true }
			]
		}
	])
	.onConflictDoNothing();

// 2. Pengguna Demo (1 Admin + 4 Pelanggan)
const adminPassHash = await bcrypt.hash('Admin123!', 10);
const userPassHash = await bcrypt.hash('User123!', 10);

const insertedUsers = await db
	.insert(users)
	.values([
		{
			name: 'Admin Studio SEMAT',
			email: 'admin@semat.id',
			whatsapp: '081288904410',
			passwordHash: adminPassHash,
			role: 'admin'
		},
		{
			name: 'Ian Prasetyo',
			email: 'ian.prasetyo@example.com',
			whatsapp: '085711223344',
			passwordHash: userPassHash,
			role: 'customer'
		},
		{
			name: 'Nadia Kusuma',
			email: 'nadia.kusuma@example.com',
			whatsapp: '081399887766',
			passwordHash: userPassHash,
			role: 'customer'
		},
		{
			name: 'Dimas Saputra',
			email: 'dimas.saputra@example.com',
			whatsapp: '082144556677',
			passwordHash: userPassHash,
			role: 'customer'
		},
		{
			name: 'Rani Mahardika',
			email: 'rani.mahardika@example.com',
			whatsapp: '087855443322',
			passwordHash: userPassHash,
			role: 'customer'
		}
	])
	.onConflictDoNothing()
	.returning();

const allUsers = insertedUsers.length > 0 ? insertedUsers : await db.select().from(users);
const adminUser = allUsers.find((u) => u.role === 'admin');
const cust1 = allUsers.find((u) => u.email === 'ian.prasetyo@example.com');
const cust2 = allUsers.find((u) => u.email === 'nadia.kusuma@example.com');
const cust3 = allUsers.find((u) => u.email === 'dimas.saputra@example.com');
const cust4 = allUsers.find((u) => u.email === 'rani.mahardika@example.com');

// 3. Buku Alamat Pelanggan
if (cust1 && cust2 && cust3) {
	await db.insert(addresses).values([
		{
			userId: cust1.id,
			label: 'Kos Kampus Pamulang',
			recipientName: 'Ian Prasetyo',
			phone: '085711223344',
			province: 'Banten',
			city: 'Kota Tangerang Selatan',
			district: 'Pamulang',
			postalCode: '15417',
			addressDetail: 'Jl. Puspitek Raya No. 42, Buaran',
			landmark: 'Seberang minimarket dekat gerbang kampus',
			latitude: -6.3465,
			longitude: 106.6915,
			isDefault: true
		},
		{
			userId: cust2.id,
			label: 'Kantor Sudirman',
			recipientName: 'Nadia Kusuma',
			phone: '081399887766',
			province: 'DKI Jakarta',
			city: 'Jakarta Selatan',
			district: 'Setiabudi',
			postalCode: '12920',
			addressDetail: 'Gedung Menara Karya Lt. 12, Jl. HR Rasuna Said',
			landmark: 'Lobby resepsionis timur',
			latitude: -6.2297,
			longitude: 106.8326,
			isDefault: true
		},
		{
			userId: cust3.id,
			label: 'Rumah Cinere',
			recipientName: 'Dimas Saputra',
			phone: '082144556677',
			province: 'Jawa Barat',
			city: 'Kota Depok',
			district: 'Cinere',
			postalCode: '16514',
			addressDetail: 'Jl. Bukit Cinere Raya No. 15',
			landmark: 'Pagar kayu cokelat',
			latitude: -6.3341,
			longitude: 106.7824,
			isDefault: true
		}
	]);
}

// 4. Kategori Produk (5 Kategori)
const insertedCategories = await db
	.insert(categories)
	.values([
		{
			name: 'Holder Kulit',
			slug: 'kulit',
			description: 'Card holder kulit sapi nabati dan microfiber jahit tepi untuk pemakaian kantor harian.',
			sortOrder: 1
		},
		{
			name: 'Akrilik & Polikarbonat',
			slug: 'akrilik',
			description: 'Casing kaku transparan dan frost anti-tekuk untuk kartu RFID serta ukuran panitia B2.',
			sortOrder: 2
		},
		{
			name: 'Retractable Reel',
			slug: 'reel',
			description: 'Penggulung tali pegas baja dengan klip sabuk dan karabiner untuk tap akses cepat.',
			sortOrder: 3
		},
		{
			name: 'Paket Lanyard',
			slug: 'paket-lanyard',
			description: 'Set lengkap holder kartu siap pakai yang dipadukan dengan tali lanyard tissue atau webbing.',
			sortOrder: 4
		},
		{
			name: 'Tali & Aksesori',
			slug: 'aksesori',
			description: 'Lanyard satuan, klip logam pengganti, dan pengait lobster kuningan.',
			sortOrder: 5
		}
	])
	.onConflictDoNothing()
	.returning();

const catList = insertedCategories.length > 0 ? insertedCategories : await db.select().from(categories);
const catMap = Object.fromEntries(catList.map((c) => [c.slug, c.id]));

// 5. Data 16 Produk Realistis + Varian Warna + Gambar
const catalogData = [
	{
		categorySlug: 'kulit',
		name: 'Semat Loka Vertical Leather Holder',
		slug: 'semat-loka-vertical-leather-holder',
		subtitle: 'Kulit sapi nabati 1,6 mm dengan 1 jendela depan dan 1 slot belakang',
		description:
			'Dirancang untuk karyawan dan mahasiswa yang membawa dua kartu aktif sekaligus. Sisi depan memakai mika bening doff 0,4 mm agar foto kartu terbaca jelas tanpa silau lampu kantor, sementara sisi belakang memuat kartu tap transportasi.',
		productType: 'vertikal',
		material: 'Kulit Sapi Nabati (Vegetable Tanned)',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) — Muat 2 kartu',
		basePrice: 68000,
		isFeatured: true,
		images: [
			{ url: '/products/kulit-vertikal-tan.svg', altText: 'Semat Loka Vertical warna Cokelat Tan', isPrimary: true },
			{ url: '/products/kulit-vertikal-hitam.svg', altText: 'Tampak varian Hitam Arang', isPrimary: false }
		],
		variants: [
			{ name: 'Cokelat Tan', colorName: 'Cokelat Tan', colorHex: '#8C583A', sku: 'SMT-LK-TAN', priceDelta: 0, stock: 24, imageUrl: '/products/kulit-vertikal-tan.svg' },
			{ name: 'Hitam Arang', colorName: 'Hitam Arang', colorHex: '#262522', sku: 'SMT-LK-BLK', priceDelta: 0, stock: 31, imageUrl: '/products/kulit-vertikal-hitam.svg' },
			{ name: 'Taupe Pasir', colorName: 'Taupe Pasir', colorHex: '#8A7F6A', sku: 'SMT-LK-TPE', priceDelta: 4000, stock: 12, imageUrl: '/products/kulit-vertikal-taupe.svg' }
		]
	},
	{
		categorySlug: 'kulit',
		name: 'Semat Rangka Horizontal Badge Sleeve',
		slug: 'semat-rangka-horizontal-badge-sleeve',
		subtitle: 'Orientasi mendatar dengan lidah pengunci kancing jepret kuningan',
		description:
			'Format lanskap untuk kartu identitas instansi atau tanda pengenal tamu gedung. Lidah pengunci atas mencegah kartu tergelincir keluar saat pengguna membungkuk atau beraktivitas di lapangan.',
		productType: 'horizontal',
		material: 'Kulit Microfiber Serat Halus',
		cardSizeSpec: 'CR80 Horizontal (86 × 54 mm) — Muat 2 kartu',
		basePrice: 54000,
		isFeatured: true,
		images: [
			{ url: '/products/kulit-horizontal-navy.svg', altText: 'Semat Rangka Horizontal Biru Dongker', isPrimary: true },
			{ url: '/products/kulit-horizontal-cognac.svg', altText: 'Semat Rangka Horizontal Cokelat Cognac', isPrimary: false }
		],
		variants: [
			{ name: 'Biru Dongker', colorName: 'Biru Dongker', colorHex: '#2B3A4A', sku: 'SMT-RK-NVY', priceDelta: 0, stock: 19, imageUrl: '/products/kulit-horizontal-navy.svg' },
			{ name: 'Cokelat Cognac', colorName: 'Cokelat Cognac', colorHex: '#9E5B34', sku: 'SMT-RK-COG', priceDelta: 0, stock: 16, imageUrl: '/products/kulit-horizontal-cognac.svg' }
		]
	},
	{
		categorySlug: 'kulit',
		name: 'Semat Lipat Magnet Dual-Window',
		slug: 'semat-lipat-magnet-dual-window',
		subtitle: 'Model lipat dua sisi bermagnet tersembunyi untuk dual kartu akses',
		description:
			'Memisahkan dua kartu RFID berfrekuensi sama agar tidak saling bertabrakan saat ditempelkan ke mesin pembaca pintu gedung atau gerbang KRL. Cukup buka lipatan 180 derajat untuk memindai kartu kedua.',
		productType: 'vertikal',
		material: 'Kulit Sapi Full-Grain + Magnet Neodymium',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) — 2 Jendela Terpisah',
		basePrice: 95000,
		isFeatured: false,
		images: [
			{ url: '/products/kulit-magnet-zaitun.svg', altText: 'Semat Lipat Magnet Hijau Zaitun', isPrimary: true },
			{ url: '/products/kulit-vertikal-hitam.svg', altText: 'Varian Hitam Arang', isPrimary: false }
		],
		variants: [
			{ name: 'Hijau Zaitun', colorName: 'Hijau Zaitun', colorHex: '#4E5844', sku: 'SMT-MG-OLV', priceDelta: 0, stock: 4, imageUrl: '/products/kulit-magnet-zaitun.svg' },
			{ name: 'Hitam Arang', colorName: 'Hitam Arang', colorHex: '#262522', sku: 'SMT-MG-BLK', priceDelta: 0, stock: 14, imageUrl: '/products/kulit-vertikal-hitam.svg' },
			{ name: 'Cokelat Tan', colorName: 'Cokelat Tan', colorHex: '#8C583A', sku: 'SMT-MG-TAN', priceDelta: 5000, stock: 9, imageUrl: '/products/kulit-vertikal-tan.svg' }
		]
	},
	{
		categorySlug: 'kulit',
		name: 'Semat Ringkas Slim Sleeve 1-Slot',
		slug: 'semat-ringkas-slim-sleeve-1-slot',
		subtitle: 'Profil ultra-tipis 3 mm untuk pemakaian ringan di saku kemeja',
		description:
			'Dipotong presisi tanpa lapisan busa tebal sehingga mudah diselipkan ke saku kemeja maupun digantung di leher. Cocok untuk kartu pelajar, mahasiswa, dan kartu akses parkir.',
		productType: 'vertikal',
		material: 'Kulit Sintetis PU Matte',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) — 1 Kartu',
		basePrice: 38000,
		isFeatured: false,
		images: [
			{ url: '/products/kulit-vertikal-taupe.svg', altText: 'Semat Ringkas Taupe Pasir', isPrimary: true },
			{ url: '/products/kulit-vertikal-tan.svg', altText: 'Varian Cokelat Tan', isPrimary: false }
		],
		variants: [
			{ name: 'Taupe Pasir', colorName: 'Taupe Pasir', colorHex: '#8A7F6A', sku: 'SMT-SL-TPE', priceDelta: 0, stock: 42, imageUrl: '/products/kulit-vertikal-taupe.svg' },
			{ name: 'Cokelat Tan', colorName: 'Cokelat Tan', colorHex: '#8C583A', sku: 'SMT-SL-TAN', priceDelta: 0, stock: 35, imageUrl: '/products/kulit-vertikal-tan.svg' }
		]
	},
	{
		categorySlug: 'akrilik',
		name: 'Semat Kaca Akrilik Bening 2 mm Vertikal',
		slug: 'semat-kaca-akrilik-bening-2mm-vertikal',
		subtitle: 'Mekanisme geser atas (slide-lock) tahan banting dan anti-menguning',
		description:
			'Terbuat dari lembar polikarbonat optik setebal 2 mm dengan kejernihan tinggi sehingga barcode dan QR pada kartu tetap terbaca pemindai tanpa harus mengeluarkan kartu.',
		productType: 'vertikal',
		material: 'Polikarbonat Optik Bening 2 mm',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) — Muat 1–2 kartu',
		basePrice: 22000,
		isFeatured: true,
		images: [
			{ url: '/products/akrilik-bening-cr80.svg', altText: 'Casing Akrilik Bening CR80', isPrimary: true },
			{ url: '/products/akrilik-frost-cr80.svg', altText: 'Varian Semi-Frost', isPrimary: false }
		],
		variants: [
			{ name: 'Bening Kristal', colorName: 'Bening Kristal', colorHex: '#DCE3E8', sku: 'SMT-AK-CLR', priceDelta: 0, stock: 68, imageUrl: '/products/akrilik-bening-cr80.svg' },
			{ name: 'Semi-Frost Doff', colorName: 'Semi-Frost Doff', colorHex: '#C5C2BA', sku: 'SMT-AK-FRS', priceDelta: 2000, stock: 45, imageUrl: '/products/akrilik-frost-cr80.svg' }
		]
	},
	{
		categorySlug: 'akrilik',
		name: 'Semat Kaku Dual-Slot Horizontal',
		slug: 'semat-kaku-dual-slot-horizontal',
		subtitle: 'Casing mendatar dengan pegas penahan kartu di bagian dalam',
		description:
			'Dilengkapi klip pegas mikro di sisi dalam agar satu kartu tetap terkunci rapat tidak bergetar meskipun slot kedua sedang kosong. Banyak dipakai staf rumah sakit dan teknisi lapangan.',
		productType: 'horizontal',
		material: 'ABS + Polikarbonat Matte',
		cardSizeSpec: 'CR80 Horizontal (86 × 54 mm) — Muat 2 kartu',
		basePrice: 26000,
		isFeatured: false,
		images: [
			{ url: '/products/akrilik-horizontal-dual.svg', altText: 'Semat Kaku Dual-Slot Horizontal', isPrimary: true },
			{ url: '/products/akrilik-bening-cr80.svg', altText: 'Detail permukaan', isPrimary: false }
		],
		variants: [
			{ name: 'Krem Batu', colorName: 'Krem Batu', colorHex: '#DFD9CE', sku: 'SMT-DH-STN', priceDelta: 0, stock: 33, imageUrl: '/products/akrilik-horizontal-dual.svg' },
			{ name: 'Abu Grafit', colorName: 'Abu Grafit', colorHex: '#4A463F', sku: 'SMT-DH-GRF', priceDelta: 0, stock: 27, imageUrl: '/products/akrilik-frost-cr80.svg' }
		]
	},
	{
		categorySlug: 'akrilik',
		name: 'Semat Panitia Casing B2 (70 × 105 mm)',
		slug: 'semat-panitia-casing-b2',
		subtitle: 'Ukuran besar untuk kartu peserta seminar, konferensi, dan kepanitiaan',
		description:
			'Memberi ruang luas untuk mencetak nama besar, divisi kepanitiaan, jadwal acara, dan kode QR registrasi. Dilengkapi tiga lubang atas untuk pengait tunggal maupun tali dua kait.',
		productType: 'vertikal',
		material: 'PVC Kaku Bening Tebal 0,8 mm',
		cardSizeSpec: 'Ukuran B2 (70 × 105 mm)',
		basePrice: 18000,
		isFeatured: false,
		images: [
			{ url: '/products/akrilik-panitia-b2.svg', altText: 'Casing Panitia Ukuran B2', isPrimary: true },
			{ url: '/products/akrilik-bening-cr80.svg', altText: 'Perbandingan kejernihan', isPrimary: false }
		],
		variants: [
			{ name: 'Bening Transparan', colorName: 'Bening Transparan', colorHex: '#E8ECEF', sku: 'SMT-B2-CLR', priceDelta: 0, stock: 120, imageUrl: '/products/akrilik-panitia-b2.svg' },
			{ name: 'Bingkai Abu Netral', colorName: 'Bingkai Abu Netral', colorHex: '#7B8791', sku: 'SMT-B2-GRY', priceDelta: 2000, stock: 55, imageUrl: '/products/akrilik-panitia-b2.svg' }
		]
	},
	{
		categorySlug: 'akrilik',
		name: 'Semat Pelindung RFID Blocking Sleeve',
		slug: 'semat-pelindung-rfid-blocking-sleeve',
		subtitle: 'Lapisan aluminium internal pencegah pemindaian kartu nirkontak liar',
		description:
			'Melindungi kartu debit contactless dan kartu akses gedung dari pembacaan jarak dekat yang tidak diinginkan saat berada di transportasi umum padat.',
		productType: 'vertikal',
		material: 'Polikarbonat + Lapisan Pelindung Aluminium',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) — 1 Kartu',
		basePrice: 32000,
		isFeatured: false,
		images: [
			{ url: '/products/akrilik-frost-cr80.svg', altText: 'Semat Pelindung RFID Frost', isPrimary: true },
			{ url: '/products/akrilik-horizontal-dual.svg', altText: 'Tampak samping', isPrimary: false }
		],
		variants: [
			{ name: 'Abu Frost', colorName: 'Abu Frost', colorHex: '#C5C2BA', sku: 'SMT-RF-FRS', priceDelta: 0, stock: 3, imageUrl: '/products/akrilik-frost-cr80.svg' },
			{ name: 'Hitam Matte', colorName: 'Hitam Matte', colorHex: '#2E2D2A', sku: 'SMT-RF-BLK', priceDelta: 0, stock: 21, imageUrl: '/products/akrilik-horizontal-dual.svg' }
		]
	},
	{
		categorySlug: 'reel',
		name: 'Semat Tarik Pegas Baja Heavy-Duty 60 cm',
		slug: 'semat-tarik-pegas-baja-heavy-duty',
		subtitle: 'Kabel kawat baja berlapis nilon dengan klip sabuk logam kokoh',
		description:
			'Dirancang untuk petugas keamanan, perawat, dan staf operasional yang menempelkan kartu akses puluhan kali sehari. Pegas internal diuji hingga 50.000 kali tarikan tanpa kendur.',
		productType: 'reel',
		material: 'Zinc Alloy + Kawat Baja Berlapis Nilon',
		cardSizeSpec: 'Kompatibel semua lubang holder CR80 / B2 (Tali 60 cm)',
		basePrice: 36000,
		isFeatured: true,
		images: [
			{ url: '/products/reel-logam-grafit.svg', altText: 'Retractable Reel Abu Grafit', isPrimary: true },
			{ url: '/products/reel-logam-perak.svg', altText: 'Varian Perak Satin', isPrimary: false }
		],
		variants: [
			{ name: 'Abu Grafit', colorName: 'Abu Grafit', colorHex: '#3B3D40', sku: 'SMT-RL-GRF', priceDelta: 0, stock: 28, imageUrl: '/products/reel-logam-grafit.svg' },
			{ name: 'Perak Satin', colorName: 'Perak Satin', colorHex: '#C8CCD0', sku: 'SMT-RL-SLV', priceDelta: 0, stock: 22, imageUrl: '/products/reel-logam-perak.svg' }
		]
	},
	{
		categorySlug: 'reel',
		name: 'Semat Yoyo Karabiner Pendaki',
		slug: 'semat-yoyo-karabiner-pendaki',
		subtitle: 'Pengait karabiner atas untuk dicantolkan di kolong ikat pinggang atau tas',
		description:
			'Dilengkapi pengait karabiner aluminium sehingga tidak merusak tepi saku celana atau kemeja tipis. Tali nilon tarik sepanjang 65 cm memudahkan tap di mesin parkir dan pintu gerbang.',
		productType: 'reel',
		material: 'Bodi ABS Matte + Karabiner Aluminium',
		cardSizeSpec: 'Kompatibel semua lubang holder (Tali 65 cm)',
		basePrice: 24000,
		isFeatured: false,
		images: [
			{ url: '/products/reel-karabiner-hitam.svg', altText: 'Semat Yoyo Karabiner Hitam', isPrimary: true },
			{ url: '/products/reel-logam-grafit.svg', altText: 'Varian Abu Grafit', isPrimary: false }
		],
		variants: [
			{ name: 'Hitam Matte', colorName: 'Hitam Matte', colorHex: '#232321', sku: 'SMT-KR-BLK', priceDelta: 0, stock: 47, imageUrl: '/products/reel-karabiner-hitam.svg' },
			{ name: 'Abu Grafit', colorName: 'Abu Grafit', colorHex: '#4E5154', sku: 'SMT-KR-GRF', priceDelta: 0, stock: 31, imageUrl: '/products/reel-logam-grafit.svg' }
		]
	},
	{
		categorySlug: 'reel',
		name: 'Semat Reel Minimalis Klip Saku',
		slug: 'semat-reel-minimalis-klip-saku',
		subtitle: 'Diameter ringkas 32 mm dengan tampilan polos bebas logo',
		description:
			'Cocok bagi perusahaan atau kampus yang menginginkan tampilan seragam bersih. Klip belakang berlapis karet tipis menjaga kain saku tetap rapi tanpa bekas jepitan tajam.',
		productType: 'reel',
		material: 'Polikarbonat Matte + Klip Baja',
		cardSizeSpec: 'Diameter 32 mm — Panjang tali 55 cm',
		basePrice: 19000,
		isFeatured: false,
		images: [
			{ url: '/products/reel-logam-perak.svg', altText: 'Semat Reel Minimalis Perak', isPrimary: true },
			{ url: '/products/reel-karabiner-hitam.svg', altText: 'Varian Hitam', isPrimary: false }
		],
		variants: [
			{ name: 'Perak Terang', colorName: 'Perak Terang', colorHex: '#C8CCD0', sku: 'SMT-MN-SLV', priceDelta: 0, stock: 54, imageUrl: '/products/reel-logam-perak.svg' },
			{ name: 'Hitam Arang', colorName: 'Hitam Arang', colorHex: '#232321', sku: 'SMT-MN-BLK', priceDelta: 0, stock: 39, imageUrl: '/products/reel-karabiner-hitam.svg' }
		]
	},
	{
		categorySlug: 'paket-lanyard',
		name: 'Paket Kantor Loka Kulit + Lanyard Tissue',
		slug: 'paket-kantor-loka-kulit-lanyard-tissue',
		subtitle: 'Set lengkap holder kulit vertikal jahit tepi dan tali tissue 2 cm',
		description:
			'Kombinasi siap pakai untuk kebutuhan karyawan baru atau hadiah onboarding tim. Tali lanyard tissue bertekstur lembut di kulit leher dengan pengait logam putar 360 derajat.',
		productType: 'paket',
		material: 'Kulit Sapi Nabati + Lanyard Polyester Tissue 2 cm',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) + Panjang Tali 90 cm',
		basePrice: 89000,
		isFeatured: true,
		images: [
			{ url: '/products/paket-lanyard-sand.svg', altText: 'Paket Kantor Taupe Sand', isPrimary: true },
			{ url: '/products/paket-lanyard-charcoal.svg', altText: 'Paket Kantor Charcoal', isPrimary: false }
		],
		variants: [
			{ name: 'Taupe Sand', colorName: 'Taupe Sand', colorHex: '#7D6B58', sku: 'SMT-PK-SND', priceDelta: 0, stock: 18, imageUrl: '/products/paket-lanyard-sand.svg' },
			{ name: 'Charcoal Hitam', colorName: 'Charcoal Hitam', colorHex: '#2B2A27', sku: 'SMT-PK-CHR', priceDelta: 0, stock: 22, imageUrl: '/products/paket-lanyard-charcoal.svg' }
		]
	},
	{
		categorySlug: 'paket-lanyard',
		name: 'Paket Kampus Akrilik + Tali Webbing Katun',
		slug: 'paket-kampus-akrilik-tali-webbing-katun',
		subtitle: 'Casing akrilik bening 2 mm dipadukan tali katun anyam 1,5 cm',
		description:
			'Ringan, tahan hujan, dan praktis untuk Kartu Tanda Mahasiswa (KTM) maupun kartu akses perpustakaan. Dilengkapi gesper lepas-pasang (quick release) di bagian bawah.',
		productType: 'paket',
		material: 'Polikarbonat 2 mm + Tali Katun Webbing 1,5 cm',
		cardSizeSpec: 'CR80 Standar (54 × 86 mm) + Panjang Tali 88 cm',
		basePrice: 44000,
		isFeatured: false,
		images: [
			{ url: '/products/paket-lanyard-charcoal.svg', altText: 'Paket Kampus Charcoal', isPrimary: true },
			{ url: '/products/paket-lanyard-sand.svg', altText: 'Varian Taupe Sand', isPrimary: false }
		],
		variants: [
			{ name: 'Charcoal Hitam', colorName: 'Charcoal Hitam', colorHex: '#2B2A27', sku: 'SMT-KM-CHR', priceDelta: 0, stock: 50, imageUrl: '/products/paket-lanyard-charcoal.svg' },
			{ name: 'Taupe Sand', colorName: 'Taupe Sand', colorHex: '#8A7F6A', sku: 'SMT-KM-SND', priceDelta: 0, stock: 41, imageUrl: '/products/paket-lanyard-sand.svg' }
		]
	},
	{
		categorySlug: 'paket-lanyard',
		name: 'Paket Panitia Acara B2 (Isi 10 Set)',
		slug: 'paket-panitia-acara-b2-isi-10-set',
		subtitle: 'Paket bundel 10 casing B2 + 10 tali lanyard pengait ganda anti-terbalik',
		description:
			'Solusi praktis untuk panitia seminar kampus, pameran, dan workshop. Menggunakan tali dua kait (double hook) agar kartu panitia ukuran B2 selalu menghadap ke depan saat berjalan.',
		productType: 'paket',
		material: 'PVC B2 0,8 mm + Lanyard Nylon 2 Kait',
		cardSizeSpec: '10 Set Ukuran B2 (70 × 105 mm)',
		basePrice: 135000,
		isFeatured: false,
		images: [
			{ url: '/products/paket-event-b2.svg', altText: 'Paket Panitia Acara B2 Isi 10 Set', isPrimary: true },
			{ url: '/products/akrilik-panitia-b2.svg', altText: 'Detail casing B2', isPrimary: false }
		],
		variants: [
			{ name: 'Tali Biru Slate (10 Set)', colorName: 'Biru Slate', colorHex: '#4F5D6B', sku: 'SMT-EV-SLT', priceDelta: 0, stock: 15, imageUrl: '/products/paket-event-b2.svg' },
			{ name: 'Tali Hitam Polos (10 Set)', colorName: 'Hitam Polos', colorHex: '#242320', sku: 'SMT-EV-BLK', priceDelta: 0, stock: 20, imageUrl: '/products/paket-event-b2.svg' }
		]
	},
	{
		categorySlug: 'aksesori',
		name: 'Tali Lanyard Tissue Polos 2 cm + Stopper',
		slug: 'tali-lanyard-tissue-polos-2cm',
		subtitle: 'Permukaan halus tidak berbulu dengan pengait lobster putar',
		description:
			'Lanyard pengganti berbahan polyester tissue rapat dengan sambungan kunci stopper hitam di bagian bawah untuk melepas kartu dengan cepat saat pemindaian.',
		productType: 'aksesori',
		material: 'Polyester Tissue + Pengait Zinc Alloy',
		cardSizeSpec: 'Lebar 20 mm × Panjang Lingkar 900 mm',
		basePrice: 18000,
		isFeatured: false,
		images: [
			{ url: '/products/lanyard-tissue-taupe.svg', altText: 'Tali Lanyard Tissue Taupe', isPrimary: true },
			{ url: '/products/lanyard-webbing-hitam.svg', altText: 'Varian Hitam', isPrimary: false }
		],
		variants: [
			{ name: 'Taupe Hangat', colorName: 'Taupe Hangat', colorHex: '#8A7F6A', sku: 'SMT-LY-TPE', priceDelta: 0, stock: 75, imageUrl: '/products/lanyard-tissue-taupe.svg' },
			{ name: 'Hitam Arang', colorName: 'Hitam Arang', colorHex: '#242320', sku: 'SMT-LY-BLK', priceDelta: 0, stock: 80, imageUrl: '/products/lanyard-webbing-hitam.svg' }
		]
	},
	{
		categorySlug: 'aksesori',
		name: 'Tali Lanyard Webbing Katun Organik 1,5 cm',
		slug: 'tali-lanyard-webbing-katun-organik',
		subtitle: 'Anyaman katun rapat bernuansa kasual dengan pengait kuningan antik',
		description:
			'Memberikan tekstur kain alami yang serasi dipadukan dengan holder kulit sapi nabati. Tidak panas saat dipakai seharian di luar ruangan.',
		productType: 'aksesori',
		material: '100% Cotton Webbing + Pengait Kuningan',
		cardSizeSpec: 'Lebar 15 mm × Panjang Lingkar 880 mm',
		basePrice: 25000,
		isFeatured: false,
		images: [
			{ url: '/products/lanyard-webbing-hitam.svg', altText: 'Tali Webbing Katun Hitam', isPrimary: true },
			{ url: '/products/lanyard-tissue-taupe.svg', altText: 'Varian Krem Taupe', isPrimary: false }
		],
		variants: [
			{ name: 'Hitam Arang', colorName: 'Hitam Arang', colorHex: '#242320', sku: 'SMT-WB-BLK', priceDelta: 0, stock: 44, imageUrl: '/products/lanyard-webbing-hitam.svg' },
			{ name: 'Krem Taupe', colorName: 'Krem Taupe', colorHex: '#8A7F6A', sku: 'SMT-WB-TPE', priceDelta: 0, stock: 38, imageUrl: '/products/lanyard-tissue-taupe.svg' }
		]
	}
];

const seededVariantsBySku = {};

for (const item of catalogData) {
	const [prod] = await db
		.insert(products)
		.values({
			categoryId: catMap[item.categorySlug],
			name: item.name,
			slug: item.slug,
			subtitle: item.subtitle,
			description: item.description,
			productType: item.productType,
			material: item.material,
			cardSizeSpec: item.cardSizeSpec,
			basePrice: item.basePrice,
			isFeatured: item.isFeatured,
			isActive: true
		})
		.onConflictDoNothing()
		.returning();

	if (!prod) continue;

	await db.insert(productImages).values(
		item.images.map((img, idx) => ({
			productId: prod.id,
			url: img.url,
			altText: img.altText,
			sortOrder: idx,
			isPrimary: img.isPrimary
		}))
	);

	const insertedVars = await db
		.insert(productVariants)
		.values(
			item.variants.map((v) => ({
				productId: prod.id,
				name: v.name,
				colorName: v.colorName,
				colorHex: v.colorHex,
				sku: v.sku,
				priceDelta: v.priceDelta,
				stock: v.stock,
				imageUrl: v.imageUrl,
				isActive: true
			}))
		)
		.returning();

	for (const v of insertedVars) {
		seededVariantsBySku[v.sku] = { ...v, productName: prod.name, basePrice: prod.basePrice };
	}
}

// 6. Pesanan Contoh Berbagai Status (untuk mengisi Dashboard & Laporan Penjualan)
const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
const hoursFromNow = (h) => new Date(now.getTime() + h * 60 * 60 * 1000);

const sampleOrders = [
	{
		invoiceNumber: 'INV-20261108-001',
		user: cust1,
		status: 'completed',
		city: 'Kota Tangerang Selatan',
		district: 'Pamulang',
		province: 'Banten',
		postalCode: '15417',
		detail: 'Jl. Puspitek Raya No. 42, Buaran',
		lat: -6.3465,
		lng: 106.6915,
		distanceMeters: 5200,
		shippingService: 'Reguler (Kurir Standar)',
		shippingEtd: '2–3 hari kerja',
		shippingCost: 9000,
		methodCode: 'va_bca',
		methodName: 'BCA Virtual Account',
		paymentCode: '390120857112233',
		trackingNumber: 'SMT-EXP-882910',
		createdAt: daysAgo(7),
		paidAt: daysAgo(7),
		shippedAt: daysAgo(6),
		completedAt: daysAgo(4),
		items: [
			{ sku: 'SMT-LK-TAN', qty: 1 },
			{ sku: 'SMT-RL-GRF', qty: 1 }
		]
	},
	{
		invoiceNumber: 'INV-20261111-002',
		user: cust2,
		status: 'shipped',
		city: 'Jakarta Selatan',
		district: 'Setiabudi',
		province: 'DKI Jakarta',
		postalCode: '12920',
		detail: 'Gedung Menara Karya Lt. 12, Jl. HR Rasuna Said',
		lat: -6.2297,
		lng: 106.8326,
		distanceMeters: 16400,
		shippingService: 'Ekspres (Prioritas Besok Sampai)',
		shippingEtd: '1 hari kerja',
		shippingCost: 21000,
		methodCode: 'qris',
		methodName: 'QRIS (Semua Aplikasi Bank & E-Wallet)',
		paymentCode: 'QRIS-SEMAT-20261111002',
		trackingNumber: 'SMT-EXP-991042',
		createdAt: daysAgo(3),
		paidAt: daysAgo(3),
		shippedAt: daysAgo(2),
		items: [
			{ sku: 'SMT-PK-SND', qty: 2 },
			{ sku: 'SMT-MG-OLV', qty: 1 }
		]
	},
	{
		invoiceNumber: 'INV-20261113-003',
		user: cust3,
		status: 'processing',
		city: 'Kota Depok',
		district: 'Cinere',
		province: 'Jawa Barat',
		postalCode: '16514',
		detail: 'Jl. Bukit Cinere Raya No. 15',
		lat: -6.3341,
		lng: 106.7824,
		distanceMeters: 4950,
		shippingService: 'Reguler (Kurir Standar)',
		shippingEtd: '2–3 hari kerja',
		shippingCost: 9000,
		methodCode: 'ewallet_gopay',
		methodName: 'GoPay',
		paymentCode: 'GP-90218312',
		createdAt: daysAgo(2),
		paidAt: daysAgo(2),
		items: [{ sku: 'SMT-EV-SLT', qty: 2 }]
	},
	{
		invoiceNumber: 'INV-20261115-004',
		user: cust4 || cust1,
		status: 'paid',
		city: 'Kota Tangerang Selatan',
		district: 'Ciputat Timur',
		province: 'Banten',
		postalCode: '15412',
		detail: 'Jl. Ir. H. Juanda No. 95, Cireundeu',
		lat: -6.3089,
		lng: 106.7562,
		distanceMeters: 4250,
		shippingService: 'Instan (Kurir Motor Langsung)',
		shippingEtd: '2–4 jam',
		shippingCost: 19800,
		methodCode: 'va_mandiri',
		methodName: 'Mandiri Virtual Account',
		paymentCode: '889080878554433',
		createdAt: daysAgo(0),
		paidAt: daysAgo(0),
		items: [
			{ sku: 'SMT-RK-NVY', qty: 1 },
			{ sku: 'SMT-AK-CLR', qty: 2 }
		]
	},
	{
		invoiceNumber: 'INV-20261115-005',
		user: cust1,
		status: 'pending_payment',
		city: 'Kota Tangerang Selatan',
		district: 'Pamulang',
		province: 'Banten',
		postalCode: '15417',
		detail: 'Jl. Puspitek Raya No. 42, Buaran',
		lat: -6.3465,
		lng: 106.6915,
		distanceMeters: 5200,
		shippingService: 'Reguler (Kurir Standar)',
		shippingEtd: '2–3 hari kerja',
		shippingCost: 9000,
		methodCode: 'va_bni',
		methodName: 'BNI Virtual Account',
		paymentCode: '824100857112233',
		createdAt: daysAgo(0),
		items: [{ sku: 'SMT-KM-CHR', qty: 1 }]
	},
	{
		invoiceNumber: 'INV-20261105-006',
		user: cust2,
		status: 'cancelled',
		city: 'Jakarta Selatan',
		district: 'Setiabudi',
		province: 'DKI Jakarta',
		postalCode: '12920',
		detail: 'Gedung Menara Karya Lt. 12, Jl. HR Rasuna Said',
		lat: -6.2297,
		lng: 106.8326,
		distanceMeters: 16400,
		shippingService: 'Reguler (Kurir Standar)',
		shippingEtd: '2–3 hari kerja',
		shippingCost: 14000,
		methodCode: 'ewallet_ovo',
		methodName: 'OVO',
		paymentCode: 'OVO-7712901',
		createdAt: daysAgo(10),
		cancelledAt: daysAgo(10),
		items: [{ sku: 'SMT-SL-TPE', qty: 2 }]
	}
];

for (const sample of sampleOrders) {
	if (!sample.user || Object.keys(seededVariantsBySku).length === 0) continue;

	let subtotal = 0;
	const lineItems = [];

	for (const it of sample.items) {
		const variant = seededVariantsBySku[it.sku];
		if (!variant) continue;
		const unitPrice = variant.basePrice + variant.priceDelta;
		const itemSub = unitPrice * it.qty;
		subtotal += itemSub;
		lineItems.push({
			productId: variant.productId,
			variantId: variant.id,
			productNameSnapshot: variant.productName,
			variantNameSnapshot: variant.name,
			skuSnapshot: variant.sku,
			unitPrice,
			quantity: it.qty,
			subtotal: itemSub
		});
	}

	const totalAmount = subtotal + sample.shippingCost;
	const isPaid = ['paid', 'processing', 'shipped', 'completed'].includes(sample.status);

	const [createdOrder] = await db
		.insert(orders)
		.values({
			invoiceNumber: sample.invoiceNumber,
			userId: sample.user.id,
			status: sample.status,
			recipientName: sample.user.name,
			recipientPhone: sample.user.whatsapp,
			shippingProvince: sample.province,
			shippingCity: sample.city,
			shippingDistrict: sample.district,
			shippingPostalCode: sample.postalCode,
			shippingAddressDetail: sample.detail,
			shippingLatitude: sample.lat,
			shippingLongitude: sample.lng,
			distanceMeters: sample.distanceMeters,
			shippingService: sample.shippingService,
			shippingEtd: sample.shippingEtd,
			shippingCost: sample.shippingCost,
			subtotal,
			totalAmount,
			trackingNumber: sample.trackingNumber || null,
			expiresAt: hoursFromNow(24),
			paidAt: sample.paidAt || null,
			shippedAt: sample.shippedAt || null,
			completedAt: sample.completedAt || null,
			cancelledAt: sample.cancelledAt || null,
			createdAt: sample.createdAt,
			updatedAt: sample.createdAt
		})
		.onConflictDoNothing()
		.returning();

	if (!createdOrder) continue;

	await db.insert(orderItems).values(
		lineItems.map((li) => ({
			orderId: createdOrder.id,
			...li
		}))
	);

	await db.insert(payments).values({
		orderId: createdOrder.id,
		provider: 'simulated',
		providerRef: isPaid ? `SIM-REF-${sample.invoiceNumber}` : null,
		methodCode: sample.methodCode,
		methodName: sample.methodName,
		status: isPaid ? 'paid' : sample.status === 'cancelled' ? 'failed' : 'pending',
		amount: totalAmount,
		paymentCode: sample.paymentCode,
		expiresAt: hoursFromNow(24),
		paidAt: sample.paidAt || null,
		payload: {
			simulated: true,
			invoice: sample.invoiceNumber,
			channel: sample.methodCode,
			seeded: true
		},
		createdAt: sample.createdAt,
		updatedAt: sample.paidAt || sample.createdAt
	});

	const histories = [
		{
			orderId: createdOrder.id,
			fromStatus: null,
			toStatus: 'pending_payment',
			actorRole: 'customer',
			actorId: sample.user.id,
			note: 'Pesanan dibuat oleh pelanggan',
			createdAt: sample.createdAt
		}
	];

	if (isPaid) {
		histories.push({
			orderId: createdOrder.id,
			fromStatus: 'pending_payment',
			toStatus: 'paid',
			actorRole: 'system',
			actorId: null,
			note: `Pembayaran diterima melalui ${sample.methodName}`,
			createdAt: sample.paidAt
		});
	}
	if (['processing', 'shipped', 'completed'].includes(sample.status)) {
		histories.push({
			orderId: createdOrder.id,
			fromStatus: 'paid',
			toStatus: 'processing',
			actorRole: 'admin',
			actorId: adminUser?.id || null,
			note: 'Admin menyiapkan pengemasan produk',
			createdAt: sample.paidAt
		});
	}
	if (['shipped', 'completed'].includes(sample.status)) {
		histories.push({
			orderId: createdOrder.id,
			fromStatus: 'processing',
			toStatus: 'shipped',
			actorRole: 'admin',
			actorId: adminUser?.id || null,
			note: `Paket diserahkan ke kurir (Resi: ${sample.trackingNumber})`,
			createdAt: sample.shippedAt
		});
	}
	if (sample.status === 'completed') {
		histories.push({
			orderId: createdOrder.id,
			fromStatus: 'shipped',
			toStatus: 'completed',
			actorRole: 'customer',
			actorId: sample.user.id,
			note: 'Pesanan diterima dengan baik oleh pembeli',
			createdAt: sample.completedAt
		});
	}
	if (sample.status === 'cancelled') {
		histories.push({
			orderId: createdOrder.id,
			fromStatus: 'pending_payment',
			toStatus: 'cancelled',
			actorRole: 'customer',
			actorId: sample.user.id,
			note: 'Pesanan dibatalkan sebelum pembayaran',
			createdAt: sample.cancelledAt
		});
	}

	await db.insert(orderStatusHistories).values(histories);
}

console.log('Seeder selesai! Akun demo:');
console.log('- Admin   : admin@semat.id / Admin123!');
console.log('- Pembeli : ian.prasetyo@example.com / User123!');
await client.end();