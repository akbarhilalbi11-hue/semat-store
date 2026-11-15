import fs from 'node:fs';
import path from 'node:path';

const PRODUCTS_DIR = path.resolve('static/products');
const DOCS_DIR = path.resolve('docs');

fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
fs.mkdirSync(DOCS_DIR, { recursive: true });

// 1. Render ilustrasi katalog studio SVG presisi untuk tiap tipe holder & warna varian
function renderProductPlate({
	variantType,
	primaryHex,
	secondaryHex,
	accentHex,
	badgeText,
	orientation = 'vertical'
}) {
	const isHorizontal = orientation === 'horizontal';
	const cardW = isHorizontal ? 300 : 210;
	const cardH = isHorizontal ? 200 : 310;
	const cardX = (600 - cardW) / 2;
	const cardY = (600 - cardH) / 2 + 24;

	let extraElements = '';

	if (variantType === 'lanyard' || variantType === 'bundle') {
		// Tali lanyard di bagian atas pengait
		extraElements += `
			<path d="M235 0 L292 125 L308 125 L365 0" fill="none" stroke="${secondaryHex}" stroke-width="18" stroke-linecap="round"/>
			<rect x="289" y="118" width="22" height="24" rx="4" fill="#8A7F6A"/>
			<circle cx="300" cy="146" r="8" fill="none" stroke="#8A7F6A" stroke-width="3"/>
		`;
	} else if (variantType === 'reel') {
		// Mekanisme retractable reel bulat
		const rY = 295;
		extraElements = `
			<rect x="284" y="135" width="32" height="48" rx="8" fill="#8A7F6A"/>
			<circle cx="300" cy="${rY}" r="96" fill="${primaryHex}" stroke="#DDD8CE" stroke-width="3"/>
			<circle cx="300" cy="${rY}" r="74" fill="none" stroke="${secondaryHex}" stroke-width="2" stroke-dasharray="4 4"/>
			<circle cx="300" cy="${rY}" r="36" fill="${accentHex}"/>
			<line x1="300" y1="${rY + 96}" x2="300" y2="445" stroke="#6E6A62" stroke-width="3"/>
			<rect x="286" y="445" width="28" height="34" rx="4" fill="${secondaryHex}"/>
			<text x="300" y="545" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#6E6A62" letter-spacing="1.5">${badgeText}</text>
		`;
		return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
			<rect width="600" height="600" fill="#EFEBE4"/>
			<rect x="24" y="24" width="552" height="552" rx="8" fill="#FAF9F6" stroke="#DDD8CE" stroke-width="1.5"/>
			${extraElements}
		</svg>`;
	} else {
		// Pengait ring logam atas standar
		extraElements += `
			<circle cx="300" cy="${cardY - 22}" r="11" fill="none" stroke="#8A7F6A" stroke-width="3.5"/>
		`;
	}

	const winPad = 22;
	const winW = cardW - winPad * 2;
	const winH = isHorizontal ? cardH - 44 : Math.round(cardH * 0.56);

	return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
		<rect width="600" height="600" fill="#EFEBE4"/>
		<rect x="24" y="24" width="552" height="552" rx="8" fill="#FAF9F6" stroke="#DDD8CE" stroke-width="1.5"/>
		${extraElements}
		<!-- Bodi Utama Holder -->
		<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="${primaryHex}" stroke="#1F1E1B" stroke-opacity="0.18" stroke-width="2"/>
		<!-- Jahitan Tepi / Aksen Bingkai -->
		<rect x="${cardX + 8}" y="${cardY + 8}" width="${cardW - 16}" height="${cardH - 16}" rx="8" fill="none" stroke="${secondaryHex}" stroke-width="1.5" stroke-dasharray="5 4"/>
		<!-- Jendela Kartu CR80 / B2 -->
		<rect x="${cardX + winPad}" y="${cardY + winPad}" width="${winW}" height="${winH}" rx="6" fill="#FFFFFF" fill-opacity="0.92" stroke="#DDD8CE" stroke-width="1.5"/>
		<!-- Simulasi Garis Identitas Kartu -->
		<rect x="${cardX + winPad + 16}" y="${cardY + winPad + 18}" width="38" height="38" rx="4" fill="${accentHex}" fill-opacity="0.35"/>
		<line x1="${cardX + winPad + 66}" y1="${cardY + winPad + 28}" x2="${cardX + winPad + winW - 18}" y2="${cardY + winPad + 28}" stroke="#1F1E1B" stroke-width="3" stroke-linecap="round"/>
		<line x1="${cardX + winPad + 66}" y1="${cardY + winPad + 44}" x2="${cardX + winPad + winW - 42}" y2="${cardY + winPad + 44}" stroke="#8A7F6A" stroke-width="2.5" stroke-linecap="round"/>
		<line x1="${cardX + winPad + 16}" y1="${cardY + winPad + 76}" x2="${cardX + winPad + winW - 16}" y2="${cardY + winPad + 76}" stroke="#DDD8CE" stroke-width="2"/>
		<text x="300" y="556" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#6E6A62" letter-spacing="1.5">${badgeText}</text>
	</svg>`;
}

const studioPlates = [
	{ file: 'placeholder.svg', variantType: 'holder', primaryHex: '#DDD8CE', secondaryHex: '#8A7F6A', accentHex: '#6E6A62', badgeText: 'SEMAT KATALOG STUDIO' },
	{ file: 'kulit-vertikal-tan.svg', variantType: 'holder', primaryHex: '#8C583A', secondaryHex: '#E6D5C3', accentHex: '#8C583A', badgeText: 'KULIT NABATI — COKELAT TAN' },
	{ file: 'kulit-vertikal-hitam.svg', variantType: 'holder', primaryHex: '#262522', secondaryHex: '#8A7F6A', accentHex: '#262522', badgeText: 'KULIT NABATI — HITAM ARANG' },
	{ file: 'kulit-vertikal-taupe.svg', variantType: 'holder', primaryHex: '#8A7F6A', secondaryHex: '#F6F4F0', accentHex: '#8A7F6A', badgeText: 'KULIT NABATI — TAUPE PASIR' },
	{ file: 'kulit-horizontal-navy.svg', variantType: 'holder', orientation: 'horizontal', primaryHex: '#2B3A4A', secondaryHex: '#C5CED6', accentHex: '#2B3A4A', badgeText: 'HORIZONTAL — BIRU DONGKER' },
	{ file: 'kulit-horizontal-cognac.svg', variantType: 'holder', orientation: 'horizontal', primaryHex: '#9E5B34', secondaryHex: '#F0DEC9', accentHex: '#9E5B34', badgeText: 'HORIZONTAL — COKELAT COGNAC' },
	{ file: 'kulit-magnet-zaitun.svg', variantType: 'holder', primaryHex: '#4E5844', secondaryHex: '#D8DFD0', accentHex: '#4E5844', badgeText: 'KLIP MAGNET — HIJAU ZAITUN' },
	{ file: 'akrilik-bening-cr80.svg', variantType: 'holder', primaryHex: '#E4E9EC', secondaryHex: '#9BA6AE', accentHex: '#6E6A62', badgeText: 'AKRILIK BENING 2MM — CR80' },
	{ file: 'akrilik-frost-cr80.svg', variantType: 'holder', primaryHex: '#D6D4CE', secondaryHex: '#8A7F6A', accentHex: '#6E6A62', badgeText: 'POLIKARBONAT FROST — CR80' },
	{ file: 'akrilik-panitia-b2.svg', variantType: 'holder', primaryHex: '#E8ECEF', secondaryHex: '#7B8791', accentHex: '#495057', badgeText: 'CASING PANITIA — UKURAN B2' },
	{ file: 'akrilik-horizontal-dual.svg', variantType: 'holder', orientation: 'horizontal', primaryHex: '#DFD9CE', secondaryHex: '#8A7F6A', accentHex: '#4A463F', badgeText: 'DUAL SLOT — HORIZONTAL' },
	{ file: 'reel-logam-grafit.svg', variantType: 'reel', primaryHex: '#3B3D40', secondaryHex: '#A8ADB3', accentHex: '#8A7F6A', badgeText: 'REEL BAJA — ABU GRAFIT' },
	{ file: 'reel-logam-perak.svg', variantType: 'reel', primaryHex: '#C8CCD0', secondaryHex: '#5C6166', accentHex: '#1F1E1B', badgeText: 'REEL BAJA — PERAK SATIN' },
	{ file: 'reel-karabiner-hitam.svg', variantType: 'reel', primaryHex: '#232321', secondaryHex: '#8A7F6A', accentHex: '#D6CFC2', badgeText: 'REEL KARABINER — HITAM' },
	{ file: 'paket-lanyard-sand.svg', variantType: 'bundle', primaryHex: '#7D6B58', secondaryHex: '#8A7F6A', accentHex: '#7D6B58', badgeText: 'PAKET LANYARD — TAUPE SAND' },
	{ file: 'paket-lanyard-charcoal.svg', variantType: 'bundle', primaryHex: '#2B2A27', secondaryHex: '#3D3B37', accentHex: '#8A7F6A', badgeText: 'PAKET LANYARD — CHARCOAL' },
	{ file: 'paket-event-b2.svg', variantType: 'bundle', primaryHex: '#E3E6E8', secondaryHex: '#4F5D6B', accentHex: '#4F5D6B', badgeText: 'PAKET SEMINAR B2 + TALI' },
	{ file: 'lanyard-tissue-taupe.svg', variantType: 'lanyard', primaryHex: '#EFEBE4', secondaryHex: '#8A7F6A', accentHex: '#8A7F6A', badgeText: 'TALI LANYARD TISSUE 2CM' },
	{ file: 'lanyard-webbing-hitam.svg', variantType: 'lanyard', primaryHex: '#EFEBE4', secondaryHex: '#242320', accentHex: '#242320', badgeText: 'TALI WEBBING KATUN 1.5CM' }
];

for (const plate of studioPlates) {
	const svgContent = renderProductPlate(plate);
	fs.writeFileSync(path.join(PRODUCTS_DIR, plate.file), svgContent, 'utf8');
}

// 2. Unduh foto referensi nyata berlisensi bebas dari Wikimedia Commons API (tanpa API key)
const commonsQueries = [
	{ query: 'ID card lanyard badge', filename: 'ref-commons-badge.jpg' },
	{ query: 'leather card holder wallet', filename: 'ref-commons-leather.jpg' }
];

const downloadedCredits = [];

for (const item of commonsQueries) {
	try {
		const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap+${encodeURIComponent(item.query)}&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json`;
		const res = await fetch(apiUrl, {
			headers: { 'User-Agent': 'SematCardholderAcademicProject/1.0 (Student Portfolio)' }
		});
		if (res.ok) {
			const data = await res.json();
			const pages = Object.values(data?.query?.pages || {});
			const validPage = pages.find((p) => p?.imageinfo?.[0]?.thumburl);
			if (validPage) {
				const info = validPage.imageinfo[0];
				const imgRes = await fetch(info.thumburl, {
					headers: { 'User-Agent': 'SematCardholderAcademicProject/1.0 (Student Portfolio)' }
				});
				if (imgRes.ok) {
					const buffer = Buffer.from(await imgRes.arrayBuffer());
					fs.writeFileSync(path.join(PRODUCTS_DIR, item.filename), buffer);
					downloadedCredits.push({
						localPath: `/products/${item.filename}`,
						title: validPage.title,
						sourceUrl: info.descriptionurl || info.url,
						license: info.extmetadata?.LicenseShortName?.value || 'Wikimedia Commons Free License',
						artist: (info.extmetadata?.Artist?.value || 'Kontributor Wikimedia').replace(/<[^>]*>/g, '').trim()
					});
				}
			}
		}
	} catch {
		// Tetap aman jika offline; seluruh produk sudah memiliki ilustrasi vektor SVG lokal
	}
}

// 3. Catat atribusi dan lisensi ke docs/image-credits.md
const creditLines = [
	'# Kredit & Lisensi Gambar Produk (SEMAT)',
	'',
	'Seluruh berkas visual produk disimpan secara lokal di folder `static/products/` agar cepat dimuat, bebas dari tautan eksternal yang rusak (*broken link*), dan siap dideploy ke Vercel.',
	'',
	'## 1. Ilustrasi Studio Katalog Lokal (`static/products/*.svg`)',
	'- **Pembuat:** Dibuat khusus untuk proyek akademik SEMAT Katalog (`scripts/prepare-images.js`).',
	'- **Lisensi:** CC0 1.0 Universal (Public Domain Dedication) — bebas digunakan dan dimodifikasi.',
	'- **Cakupan:** Seluruh ilustrasi varian warna dan ukuran kartu CR80 / B2.',
	'',
	'## 2. Foto Referensi Produk (Wikimedia Commons)',
	...(downloadedCredits.length > 0
		? downloadedCredits.map(
				(c) =>
					`- **Berkas:** \`${c.localPath}\`\n  - **Judul Asli:** ${c.title}\n  - **Sumber:** ${c.sourceUrl}\n  - **Kreator:** ${c.artist}\n  - **Lisensi:** ${c.license}`
			)
		: [
				'- *Catatan:* Saat skrip dijalankan dalam mode offline, seluruh katalog menggunakan ilustrasi studio vektor lokal (`static/products/*.svg`) sebagai aset utama.'
			])
];

fs.writeFileSync(path.join(DOCS_DIR, 'image-credits.md'), creditLines.join('\n'), 'utf8');
console.log(`Selesai menyiapkan ${studioPlates.length} aset studio lokal dan docs/image-credits.md.`);