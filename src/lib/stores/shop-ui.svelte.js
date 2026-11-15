// State global sisi klien menggunakan Svelte 5 Runes untuk Bandingkan Produk, Quick View, dan Toast
class ShopUIState {
	/** @type {Array<any>} */
	compareList = $state([]);

	/** @type {any} */
	quickViewProduct = $state(null);

	/** @type {Array<{ id: number, message: string, type: 'neutral' | 'warning' }>} */
	toasts = $state([]);

	#toastCounter = 0;

	/**
	 * Menampilkan notifikasi toast singkat di sudut layar
	 * @param {string} message
	 * @param {'neutral' | 'warning'} [type]
	 */
	notify(message, type = 'neutral') {
		const id = ++this.#toastCounter;
		this.toasts.push({ id, message, type });
		setTimeout(() => {
			this.dismissToast(id);
		}, 3500);
	}

	/**
	 * @param {number} id
	 */
	dismissToast(id) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}

	/**
	 * Menambah atau menghapus produk dari daftar perbandingan (maksimal 3 produk)
	 * @param {any} product
	 */
	toggleCompare(product) {
		const exists = this.compareList.some((item) => item.id === product.id);
		if (exists) {
			this.compareList = this.compareList.filter((item) => item.id !== product.id);
			this.notify(`"${product.name}" dihapus dari perbandingan.`);
			return;
		}
		if (this.compareList.length >= 3) {
			this.notify('Maksimal 3 produk dapat dibandingkan bersamaan.', 'warning');
			return;
		}
		this.compareList = [...this.compareList, product];
		this.notify(`"${product.name}" ditambahkan ke perbandingan (${this.compareList.length}/3).`);
	}

	/**
	 * @param {number} productId
	 */
	isInCompare(productId) {
		return this.compareList.some((item) => item.id === productId);
	}

	clearCompare() {
		this.compareList = [];
	}

	/**
	 * Membuka modal Lihat Cepat Bootstrap untuk produk tertentu
	 * @param {any} product
	 */
	openQuickView(product) {
		this.quickViewProduct = product;
		if (typeof window !== 'undefined' && window.bootstrap) {
			const el = document.getElementById('quickViewModal');
			if (el) {
				const modal = window.bootstrap.Modal.getOrCreateInstance(el);
				modal.show();
			}
		}
	}
}

export const shopUI = new ShopUIState();