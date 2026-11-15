/**
 * Memformat bilangan bulat rupiah menjadi string standar Indonesia, contoh: "Rp 45.000"
 * @param {number} amount
 */
export function formatRupiah(amount) {
	const value = Number.isFinite(amount) ? Math.round(amount) : 0;
	return 'Rp ' + value.toLocaleString('id-ID');
}

/**
 * Mengubah kode tipe produk menjadi label Bahasa Indonesia yang rapi
 * @param {string} type
 */
export function formatProductType(type) {
	const map = {
		vertikal: 'Vertikal',
		horizontal: 'Horizontal',
		reel: 'Retractable Reel',
		paket: 'Paket Lanyard',
		aksesori: 'Aksesori & Tali'
	};
	return map[type] || type;
}