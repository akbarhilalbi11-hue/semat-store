<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import {
		ArrowLeft,
		MapPin,
		Navigation,
		Truck,
		CreditCard,
		ShieldCheck,
		CheckCircle2,
		Copy,
		ShoppingBag,
		QrCode,
		RefreshCw,
		Clock,
		ExternalLink
	} from 'lucide-svelte';
	import { formatRupiah } from '#lib/utils/format.js';

	let { data, form } = $props();

	let currentOrder = $state(form?.createdOrder || data.activeOrder || null);

	$effect(() => {
		if (form?.createdOrder) {
			currentOrder = form.createdOrder;
			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	});

	// Data penerima & alamat
	const defaultAddr = data.savedAddresses?.[0] || null;
	let selectedSavedId = $state(defaultAddr ? String(defaultAddr.id) : 'new');
	let recipientName = $state(defaultAddr?.recipientName || data.user?.name || '');
	let recipientPhone = $state(defaultAddr?.recipientPhone || data.user?.whatsapp || '');
	let addressDetail = $state(defaultAddr?.addressDetail || '');
	let district = $state(defaultAddr?.district || '');
	let city = $state(defaultAddr?.city || 'Kota Tangerang Selatan');
	let province = $state(defaultAddr?.province || 'Banten');
	let postalCode = $state(defaultAddr?.postalCode || '');
	let orderNotes = $state('');
	let saveToProfile = $state(!defaultAddr);

	// Koordinat titik kirim
	let destLat = $state(-6.3465);
	let destLng = $state(106.7442);

	// Kurir & metode pembayaran
	let selectedCourier = $state('reguler');
	let selectedPayment = $state('QRIS');
	let isSubmitting = $state(false);
	let copiedVa = $state(false);
	let isCheckingStatus = $state(false);
	let countdownText = $state('23:59:59');

	// Referensi peta Leaflet
	let mapEl = $state(null);
	let mapInstance = null;
	let destMarker = null;
	let routeLine = null;
	let gpsLoading = $state(false);

	const paymentGroups = [
		{
			title: 'QRIS & Dompet Digital (Scan Langsung)',
			options: [
				{ id: 'QRIS', label: 'QRIS', desc: 'Scan QR dari semua aplikasi bank & e-wallet' },
				{ id: 'GoPay', label: 'GoPay', desc: 'QRIS & pembayaran instan GoPay' },
				{ id: 'OVO', label: 'OVO', desc: 'QRIS & pembayaran instan OVO' },
				{ id: 'DANA', label: 'DANA', desc: 'QRIS & pembayaran instan DANA' }
			]
		},
		{
			title: 'Virtual Account Bank (Otomatis Terverifikasi)',
			options: [
				{ id: 'VA BCA', label: 'VA BCA', desc: 'Virtual Account Bank Central Asia' },
				{ id: 'VA Mandiri', label: 'VA Mandiri', desc: 'Mandiri Virtual Account' },
				{ id: 'VA BNI', label: 'VA BNI', desc: 'BNI Virtual Account' },
				{ id: 'VA BRI', label: 'VA BRI', desc: 'BRI Virtual Account (BRIVA)' }
			]
		}
	];

	const quickAreaPresets = [
		{
			label: 'Pamulang (Tangsel)',
			lat: -6.3465,
			lng: 106.7442,
			district: 'Pamulang',
			city: 'Kota Tangerang Selatan',
			province: 'Banten',
			postal: '15417'
		},
		{
			label: 'BSD / Serpong',
			lat: -6.3019,
			lng: 106.6527,
			district: 'Serpong',
			city: 'Kota Tangerang Selatan',
			province: 'Banten',
			postal: '15310'
		},
		{
			label: 'Jakarta Selatan',
			lat: -6.2615,
			lng: 106.8106,
			district: 'Kebayoran Baru',
			city: 'Jakarta Selatan',
			province: 'DKI Jakarta',
			postal: '12160'
		},
		{
			label: 'Kota Bogor',
			lat: -6.5971,
			lng: 106.806,
			district: 'Bogor Tengah',
			city: 'Kota Bogor',
			province: 'Jawa Barat',
			postal: '16122'
		},
		{
			label: 'Kota Depok',
			lat: -6.4025,
			lng: 106.7942,
			district: 'Beji',
			city: 'Kota Depok',
			province: 'Jawa Barat',
			postal: '16421'
		}
	];

	let activePaymentMethod = $derived(currentOrder?.paymentMethod || selectedPayment);
	let isQrisMode = $derived(
		['QRIS', 'GoPay', 'OVO', 'DANA'].includes(activePaymentMethod)
	);

	let qrisAuthPath = $derived(
		currentOrder ? `/bayar/${currentOrder.invoiceNumber}` : '/bayar/INV-PREVIEW'
	);

	let qrisImageUrl = $derived.by(() => {
		if (!currentOrder) return '';
		const origin = typeof window !== 'undefined' ? window.location.origin : page.url.origin;
		const fullScanUrl = `${origin}/bayar/${currentOrder.invoiceNumber}`;
		return `https://api.qrserver.com/v1/create-qr-code/?size=230x230&margin=8&data=${encodeURIComponent(
			fullScanUrl
		)}`;
	});

	// Polling status otomatis setiap 3 detik saat menunggu pembayaran
	$effect(() => {
		if (!currentOrder || currentOrder.status !== 'pending_payment') return;

		const invoice = currentOrder.invoiceNumber;
		const expiresAtMs = currentOrder.expiresAt
			? new Date(currentOrder.expiresAt).getTime()
			: Date.now() + 24 * 60 * 60 * 1000;

		const pollTimer = setInterval(async () => {
			try {
				isCheckingStatus = true;
				const res = await fetch(`/api/payment/status?invoice=${encodeURIComponent(invoice)}`);
				if (res.ok) {
					const statusData = await res.json();
					if (statusData.ok && statusData.status !== currentOrder.status) {
						currentOrder = {
							...currentOrder,
							status: statusData.status,
							paidAt: statusData.paidAt
						};
					}
				}
			} catch {
				// Abaikan galat sementara dan coba lagi pada siklus berikutnya
			} finally {
				isCheckingStatus = false;
			}
		}, 3000);

		const clockTimer = setInterval(() => {
			const diff = Math.max(0, expiresAtMs - Date.now());
			const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
			const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
			const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
			countdownText = `${h}:${m}:${s}`;
		}, 1000);

		return () => {
			clearInterval(pollTimer);
			clearInterval(clockTimer);
		};
	});

	let distanceKm = $derived.by(() => {
		const toRad = (deg) => (deg * Math.PI) / 180;
		const R = 6371;
		const dLat = toRad(destLat - data.workshop.lat);
		const dLon = toRad(destLng - data.workshop.lng);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRad(data.workshop.lat)) *
				Math.cos(toRad(destLat)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.max(0.5, Number((R * c).toFixed(1)));
	});

	let shippingOptions = $derived.by(() => {
		const round500 = (n) => Math.ceil(n / 500) * 500;
		return [
			{
				id: 'reguler',
				name: 'Reguler (Kurir Standar)',
				eta: 'Estimasi 2–3 Hari Kerja',
				cost: round500(9000 + distanceKm * 1500),
				available: true
			},
			{
				id: 'kilat',
				name: 'Kilat / Next Day',
				eta: 'Estimasi 1 Hari Sampai',
				cost: round500(15000 + distanceKm * 2200),
				available: true
			},
			{
				id: 'instan',
				name: 'Instan (Kurir Motor Langsung)',
				eta: '2–4 Jam (Khusus jarak ≤ 40 km)',
				cost: round500(18000 + distanceKm * 3000),
				available: distanceKm <= 40
			}
		];
	});

	$effect(() => {
		if (selectedCourier === 'instan' && distanceKm > 40) {
			selectedCourier = 'reguler';
		}
	});

	let activeCourierObj = $derived(
		shippingOptions.find((opt) => opt.id === selectedCourier) || shippingOptions[0]
	);

	let grandTotal = $derived((data.cart?.subtotal || 0) + (activeCourierObj?.cost || 0));

	function handleSelectSavedAddress(val) {
		selectedSavedId = val;
		if (val === 'new') return;
		const found = data.savedAddresses.find((a) => String(a.id) === val);
		if (found) {
			recipientName = found.recipientName || data.user.name;
			recipientPhone = found.recipientPhone || data.user.whatsapp;
			addressDetail = found.addressDetail || '';
			district = found.district || '';
			city = found.city || '';
			province = found.province || '';
			postalCode = found.postalCode || '';
		}
	}

	function updatePinPosition(lat, lng, recenter = true) {
		destLat = Number(lat.toFixed(6));
		destLng = Number(lng.toFixed(6));
		if (destMarker && mapInstance) {
			destMarker.setLatLng([destLat, destLng]);
			if (routeLine) {
				routeLine.setLatLngs([
					[data.workshop.lat, data.workshop.lng],
					[destLat, destLng]
				]);
			}
			if (recenter) {
				mapInstance.setView([destLat, destLng], 13);
			}
		}
	}

	function applyAreaPreset(preset) {
		district = preset.district;
		city = preset.city;
		province = preset.province;
		postalCode = preset.postal;
		updatePinPosition(preset.lat, preset.lng, true);
	}

	function detectCurrentGps() {
		if (!navigator.geolocation) return;
		gpsLoading = true;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				updatePinPosition(pos.coords.latitude, pos.coords.longitude, true);
				gpsLoading = false;
			},
			() => {
				gpsLoading = false;
			},
			{ enableHighAccuracy: true, timeout: 8000 }
		);
	}

	function getVirtualAccountNumber(invoiceNumber) {
		const digits = String(invoiceNumber || '20261115001').replace(/\D/g, '');
		return `88019${digits.padEnd(11, '0').slice(0, 11)}`;
	}

	function copyVaCode(code) {
		navigator.clipboard?.writeText(code);
		copiedVa = true;
		setTimeout(() => (copiedVa = false), 2000);
	}

	onMount(async () => {
		if (currentOrder || !data.cart?.items?.length) return;

		if (!document.getElementById('leaflet-css')) {
			const link = document.createElement('link');
			link.id = 'leaflet-css';
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);
		}

		if (!window.L) {
			await new Promise((resolve) => {
				const script = document.createElement('script');
				script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
				script.onload = resolve;
				document.head.appendChild(script);
			});
		}

		if (window.L && mapEl) {
			const L = window.L;
			mapInstance = L.map(mapEl).setView([destLat, destLng], 12);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; OpenStreetMap'
			}).addTo(mapInstance);

			L.circleMarker([data.workshop.lat, data.workshop.lng], {
				radius: 8,
				color: '#1F1E1B',
				fillColor: '#8C6D53',
				fillOpacity: 1,
				weight: 2
			})
				.addTo(mapInstance)
				.bindPopup(`<strong>${data.workshop.label}</strong><br/>Titik Asal Pengiriman`);

			destMarker = L.marker([destLat, destLng], { draggable: true })
				.addTo(mapInstance)
				.bindPopup('<strong>Titik Antar Pesanan</strong><br/>Geser pin atau klik peta untuk menyesuaikan')
				.openPopup();

			routeLine = L.polyline(
				[
					[data.workshop.lat, data.workshop.lng],
					[destLat, destLng]
				],
				{ color: '#1F1E1B', weight: 2, dashArray: '6, 6', opacity: 0.7 }
			).addTo(mapInstance);

			destMarker.on('dragend', () => {
				const pos = destMarker.getLatLng();
				updatePinPosition(pos.lat, pos.lng, false);
			});

			mapInstance.on('click', (e) => {
				updatePinPosition(e.latlng.lat, e.latlng.lng, false);
			});
		}
	});
</script>

<svelte:head>
	<title>Checkout & Pengiriman — SEMAT</title>
</svelte:head>

<!-- HEADER CHECKOUT MANDIRI (KEMBALI KE BERANDA TANPA LOGOUT) -->
<header class="sticky-top hairline-bottom" style="background-color: var(--bg-surface); z-index: 1020;">
	<div class="container py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
		<div class="d-flex align-items-center gap-2.5">
			<span
				class="d-inline-flex align-items-center justify-content-center border rounded"
				style="width: 32px; height: 32px; background-color: var(--bg-subtle);"
			>
				<ShieldCheck size={17} />
			</span>
			<div>
				<div class="d-flex align-items-center gap-2">
					<span class="font-heading fw-bold fs-5 text-dark">SEMAT</span>
					<span class="badge btn-taupe" style="font-size: 0.7rem;">Checkout Pesanan</span>
				</div>
				<span class="small text-secondary-warm d-block" style="font-size: 0.75rem;">
					Pemesan: <strong>{data.user.name}</strong> ({data.user.email})
				</span>
			</div>
		</div>

		<a href="/" class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5">
			<ArrowLeft size={15} />
			<span>Kembali ke Beranda</span>
		</a>
	</div>
</header>

<section class="py-4 py-lg-5">
	<div class="container">
		{#if form?.error}
			<div class="p-3 rounded mb-4 small" style="background-color: var(--status-danger-bg); color: var(--status-danger-text);">
				{form.error}
			</div>
		{/if}

		<!-- ================================================================= -->
		<!-- KONDISI A: VALIDASI PEMBAYARAN OTOMATIS (QRIS & VIRTUAL ACCOUNT)  -->
		<!-- ================================================================= -->
		{#if currentOrder}
			<div class="mx-auto" style="max-width: 720px;">
				<div class="surface-card p-4 p-md-5">
					{#if currentOrder.status === 'paid'}
						<div class="text-center pb-4 mb-4 hairline-bottom">
							<div
								class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
								style="width: 56px; height: 56px; background-color: var(--status-success-bg); color: var(--status-success-text);"
							>
								<CheckCircle2 size={30} />
							</div>
							<span class="catalog-kicker d-block mb-1">Tervalidasi Otomatis</span>
							<h1 class="h3 font-heading fw-bold mb-2">Pembayaran Diterima</h1>
							<p class="small text-secondary-warm mb-0">
								Terima kasih, <strong>{currentOrder.recipientName}</strong>. Transaksi <strong>{currentOrder.invoiceNumber}</strong> telah terverifikasi otomatis dan masuk ke antrean pengemasan studio SEMAT.
							</p>
						</div>
					{:else}
						<div class="pb-4 mb-4 hairline-bottom d-flex flex-wrap justify-content-between align-items-start gap-3">
							<div>
								<span class="catalog-kicker d-block mb-1">Menunggu Pembayaran</span>
								<h1 class="h3 font-heading fw-bold mb-1">Selesaikan Pembayaran</h1>
								<span class="small text-secondary-warm">
									Nomor Invoice: <strong class="text-dark">{currentOrder.invoiceNumber}</strong>
								</span>
							</div>

							<div class="text-end">
								<span class="badge btn-taupe px-3 py-1.5 d-inline-block mb-1">
									{activePaymentMethod}
								</span>
								<span class="d-flex align-items-center justify-content-end gap-1 small text-secondary-warm">
									<Clock size={13} />
									<span class="price-tabular">{countdownText}</span>
								</span>
							</div>
						</div>

						<!-- TAMPILAN KHUSUS QRIS / E-WALLET -->
						{#if isQrisMode}
							<div class="surface-subtle p-4 rounded mb-4 text-center">
								<div class="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded bg-white border mb-2">
									<QrCode size={15} />
									<strong class="small">QRIS • {activePaymentMethod}</strong>
								</div>
								<div class="fw-bold font-heading">SEMAT STUDIO INDONESIA</div>
								<div class="text-secondary-warm mb-3" style="font-size: 0.74rem;">
									NMID: ID1026384920192
								</div>

								<div
									class="d-inline-block p-3 bg-white rounded border mb-3"
									style="box-shadow: 0 2px 10px rgba(0,0,0,0.04);"
								>
									<img
										src={qrisImageUrl}
										alt="Kode QRIS Pembayaran {currentOrder.invoiceNumber}"
										width="220"
										height="220"
										class="d-block"
									/>
								</div>

								<div class="mb-2">
									<span class="small text-secondary-warm d-block">Total Tagihan QRIS</span>
									<span class="price-tabular fs-4 fw-bold text-dark">
										{formatRupiah(currentOrder.totalAmount)}
									</span>
								</div>

								<p class="small text-secondary-warm mx-auto mb-2" style="max-width: 440px;">
									Pindai kode QR di atas menggunakan kamera ponsel atau aplikasi pembayaran. Halaman ini akan tervalidasi otomatis setelah QRIS dipindai.
								</p>

								<a
									href={qrisAuthPath}
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-outline-hairline btn-sm bg-white d-inline-flex align-items-center gap-1.5"
								>
									<ExternalLink size={13} />
									<span>Buka Halaman Scan QRIS di Tab Baru</span>
								</a>
							</div>
						{:else}
							<!-- TAMPILAN VIRTUAL ACCOUNT BANK -->
							<div class="surface-subtle p-4 rounded mb-4">
								<div class="row g-3 align-items-center">
									<div class="col-12 col-sm-7">
										<span class="small text-secondary-warm d-block mb-1">
											Nomor Virtual Account ({activePaymentMethod})
										</span>
										<div class="d-flex align-items-center gap-2">
											<code class="fs-5 fw-bold text-dark">{getVirtualAccountNumber(currentOrder.invoiceNumber)}</code>
											<button
												type="button"
												class="btn btn-outline-hairline btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
												onclick={() => copyVaCode(getVirtualAccountNumber(currentOrder.invoiceNumber))}
											>
												<Copy size={13} />
												<span>{copiedVa ? 'Tersalin' : 'Salin'}</span>
											</button>
										</div>
										<span class="d-block text-secondary-warm mt-2" style="font-size: 0.75rem;">
											Atas Nama: <strong>SEMAT STUDIO INDONESIA</strong>
										</span>
									</div>

									<div class="col-12 col-sm-5 text-sm-end">
										<span class="small text-secondary-warm d-block mb-1">Total Tagihan</span>
										<span class="price-tabular fs-4 fw-bold text-dark">
											{formatRupiah(currentOrder.totalAmount)}
										</span>
									</div>
								</div>
							</div>
						{/if}

						<!-- Status Pemantauan Otomatis (Non-Manual) -->
						<div class="p-3 rounded border mb-4 d-flex align-items-center justify-content-between gap-2 small bg-white">
							<div class="d-flex align-items-center gap-2">
								<RefreshCw size={15} class={isCheckingStatus ? 'spin-icon text-dark' : 'text-secondary-warm'} />
								<span>
									Sistem memverifikasi pembayaran otomatis setiap 3 detik...
								</span>
							</div>
							<span class="badge bg-light text-dark border">Auto-Verify Aktif</span>
						</div>
					{/if}

					<!-- Rincian Pengiriman & Item Invoice -->
					<div class="mb-4">
						<h2 class="h6 font-heading fw-semibold mb-2">Rincian Pengiriman & Barang</h2>
						<div class="p-3 rounded border mb-3 small" style="background-color: var(--bg-canvas);">
							<strong class="d-block">{currentOrder.recipientName} ({currentOrder.recipientPhone})</strong>
							<p class="text-secondary-warm mb-1">{currentOrder.shippingAddress || currentOrder.shippingAddressSnapshot}</p>
							<span class="fw-medium">Layanan Kurir: {currentOrder.shippingService} ({formatRupiah(currentOrder.shippingCost || 0)})</span>
						</div>

						<div class="d-flex flex-column gap-2 small">
							{#each currentOrder.items as item}
								<div class="d-flex justify-content-between align-items-center py-2 px-3 rounded border bg-white">
									<span>
										{item.productNameSnapshot} <span class="text-secondary-warm">({item.variantNameSnapshot})</span> × <strong>{item.quantity}</strong>
									</span>
									<span class="price-tabular fw-semibold">{formatRupiah(item.subtotal)}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="d-flex flex-wrap gap-2 justify-content-center">
						<a href="/" class="btn btn-outline-hairline btn-sm">Kembali ke Beranda</a>
						<a href="/katalog" class="btn btn-outline-hairline btn-sm">Lanjut Belanja di Katalog</a>
						<a href="/akun" class="btn btn-outline-hairline btn-sm">Lihat Riwayat Pesanan</a>
					</div>
				</div>
			</div>

		<!-- ================================================================= -->
		<!-- KONDISI B: KERANJANG KOSONG                                       -->
		<!-- ================================================================= -->
		{:else if !data.cart?.items?.length}
			<div class="mx-auto text-center" style="max-width: 520px;">
				<div class="surface-card p-5">
					<ShoppingBag size={36} class="text-secondary-warm mb-3" />
					<h1 class="h4 font-heading fw-bold mb-2">Keranjang Belanja Kosong</h1>
					<p class="small text-secondary-warm mb-4">
						Belum ada produk di keranjang Anda untuk diproses ke pembayaran.
					</p>
					<div class="d-flex justify-content-center gap-2">
						<a href="/" class="btn btn-outline-hairline btn-sm">Kembali ke Beranda</a>
						<a href="/katalog" class="btn btn-primary btn-sm">Jelajahi Katalog</a>
					</div>
				</div>
			</div>

		<!-- ================================================================= -->
		<!-- KONDISI C: FORMULIR CHECKOUT LENGKAP                              -->
		<!-- ================================================================= -->
		{:else}
			<form
				method="POST"
				action="?/createOrder"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<input type="hidden" name="destLat" value={destLat} />
				<input type="hidden" name="destLng" value={destLng} />
				<input type="hidden" name="courierId" value={selectedCourier} />
				<input type="hidden" name="paymentMethod" value={selectedPayment} />

				<div class="row g-4">
					<div class="col-12 col-lg-7">
						<!-- 1. Alamat Penerima -->
						<div class="surface-card p-4 mb-4">
							<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 hairline-bottom">
								<div class="d-flex align-items-center gap-2">
									<MapPin size={18} />
									<h2 class="h5 font-heading fw-semibold mb-0">1. Alamat Pengiriman</h2>
								</div>

								{#if data.savedAddresses?.length > 0}
									<select
										class="form-select form-select-sm"
										style="width: auto; max-width: 240px;"
										value={selectedSavedId}
										onchange={(e) => handleSelectSavedAddress(e.currentTarget.value)}
									>
										{#each data.savedAddresses as addr}
											<option value={String(addr.id)}>
												{addr.label || 'Alamat Tersimpan'} — {addr.city}
											</option>
										{/each}
										<option value="new">+ Tulis Alamat Baru</option>
									</select>
								{/if}
							</div>

							<div class="row g-3">
								<div class="col-12 col-sm-6">
									<label for="recName" class="form-label small">Nama Penerima</label>
									<input
										id="recName"
										name="recipientName"
										type="text"
										class="form-control form-control-sm"
										bind:value={recipientName}
										required
									/>
								</div>

								<div class="col-12 col-sm-6">
									<label for="recPhone" class="form-label small">Nomor WhatsApp</label>
									<input
										id="recPhone"
										name="recipientPhone"
										type="tel"
										class="form-control form-control-sm"
										placeholder="08xxxxxxxxxx"
										bind:value={recipientPhone}
										required
									/>
								</div>

								<div class="col-12">
									<label for="addrDetail" class="form-label small">Alamat Lengkap (Jalan, Nomor Rumah / Gedung)</label>
									<textarea
										id="addrDetail"
										name="addressDetail"
										rows="2"
										class="form-control form-control-sm"
										placeholder="Contoh: Jl. Puspitek Raya No. 42, Kel. Buaran"
										bind:value={addressDetail}
										required
									></textarea>
								</div>

								<div class="col-6 col-sm-4">
									<label for="addrDist" class="form-label small">Kecamatan</label>
									<input
										id="addrDist"
										name="district"
										type="text"
										class="form-control form-control-sm"
										bind:value={district}
									/>
								</div>

								<div class="col-6 col-sm-4">
									<label for="addrCity" class="form-label small">Kota / Kabupaten</label>
									<input
										id="addrCity"
										name="city"
										type="text"
										class="form-control form-control-sm"
										bind:value={city}
										required
									/>
								</div>

								<div class="col-6 col-sm-4">
									<label for="addrProv" class="form-label small">Provinsi</label>
									<input
										id="addrProv"
										name="province"
										type="text"
										class="form-control form-control-sm"
										bind:value={province}
										required
									/>
								</div>

								<div class="col-6 col-sm-4">
									<label for="addrZip" class="form-label small">Kode Pos</label>
									<input
										id="addrZip"
										name="postalCode"
										type="text"
										class="form-control form-control-sm"
										bind:value={postalCode}
									/>
								</div>

								<div class="col-12 col-sm-8">
									<label for="addrNotes" class="form-label small">Catatan Kurir (Opsional)</label>
									<input
										id="addrNotes"
										name="orderNotes"
										type="text"
										class="form-control form-control-sm"
										placeholder="Patokan rumah atau titip di pos satpam"
										bind:value={orderNotes}
									/>
								</div>
							</div>

							<div class="form-check mt-3 small">
								<input
									class="form-check-input"
									type="checkbox"
									id="saveAddrCheck"
									name="saveToProfile"
									bind:checked={saveToProfile}
								/>
								<label class="form-check-label" for="saveAddrCheck">
									Simpan alamat ini ke buku alamat akun saya
								</label>
							</div>
						</div>

						<!-- 2. Peta Titik Kirim & Perhitungan Jarak Haversine -->
						<div class="surface-card p-4 mb-4">
							<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 hairline-bottom">
								<div>
									<h2 class="h5 font-heading fw-semibold mb-0">2. Titik Koordinat & Jarak Pengiriman</h2>
									<span class="small text-secondary-warm">
										Klik peta atau geser pin biru untuk menghitung ongkir dari Workshop Pamulang
									</span>
								</div>

								<button
									type="button"
									class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5"
									onclick={detectCurrentGps}
									disabled={gpsLoading}
								>
									<Navigation size={14} />
									<span>{gpsLoading ? 'Mencari GPS...' : 'Gunakan Lokasi Saya'}</span>
								</button>
							</div>

							<div class="d-flex flex-wrap gap-1.5 mb-2.5">
								{#each quickAreaPresets as preset}
									<button
										type="button"
										class="btn btn-outline-hairline btn-sm py-0 px-2"
										style="font-size: 0.72rem; height: 26px;"
										onclick={() => applyAreaPreset(preset)}
									>
										{preset.label}
									</button>
								{/each}
							</div>

							<div
								bind:this={mapEl}
								class="rounded border mb-2.5"
								style="height: 250px; width: 100%; z-index: 1; background-color: var(--bg-subtle);"
							></div>

							<div class="d-flex flex-wrap justify-content-between align-items-center small text-secondary-warm">
								<span>Koordinat Tujuan: <code>{destLat}, {destLng}</code></span>
								<span class="text-dark fw-semibold">
									Jarak Haversine: <span class="price-tabular">{distanceKm} km</span> dari Pamulang
								</span>
							</div>
						</div>

						<!-- 3. Layanan Kurir -->
						<div class="surface-card p-4 mb-4">
							<div class="d-flex align-items-center gap-2 pb-3 mb-3 hairline-bottom">
								<Truck size={18} />
								<h2 class="h5 font-heading fw-semibold mb-0">3. Pilih Layanan Pengiriman</h2>
							</div>

							<div class="d-flex flex-column gap-2">
								{#each shippingOptions as opt}
									<label
										class="p-3 rounded border d-flex justify-content-between align-items-center gap-3 {opt.available
											? 'cursor-pointer'
											: 'opacity-50'}"
										style="background-color: {selectedCourier === opt.id ? 'var(--bg-subtle)' : 'var(--bg-canvas)'}; cursor: {opt.available ? 'pointer' : 'not-allowed'};"
									>
										<div class="d-flex align-items-center gap-2.5">
											<input
												type="radio"
												name="courierRadio"
												value={opt.id}
												checked={selectedCourier === opt.id}
												disabled={!opt.available}
												onchange={() => (selectedCourier = opt.id)}
											/>
											<div>
												<strong class="d-block small">{opt.name}</strong>
												<span class="text-secondary-warm" style="font-size: 0.74rem;">{opt.eta}</span>
											</div>
										</div>
										<span class="price-tabular fw-bold small">{formatRupiah(opt.cost)}</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- 4. Metode Pembayaran -->
						<div class="surface-card p-4">
							<div class="d-flex align-items-center gap-2 pb-3 mb-3 hairline-bottom">
								<CreditCard size={18} />
								<h2 class="h5 font-heading fw-semibold mb-0">4. Metode Pembayaran</h2>
							</div>

							{#each paymentGroups as group}
								<span class="small text-secondary-warm fw-semibold d-block mb-2 mt-2">
									{group.title}
								</span>
								<div class="row g-2 mb-3">
									{#each group.options as pay}
										<div class="col-6">
											<label
												class="p-2.5 rounded border d-flex align-items-start gap-2 h-100"
												style="background-color: {selectedPayment === pay.id ? 'var(--bg-subtle)' : 'var(--bg-canvas)'}; cursor: pointer;"
											>
												<input
													type="radio"
													name="paymentRadio"
													class="mt-1"
													value={pay.id}
													checked={selectedPayment === pay.id}
													onchange={() => (selectedPayment = pay.id)}
												/>
												<div>
													<strong class="d-block small">{pay.label}</strong>
													<span class="text-secondary-warm d-block" style="font-size: 0.7rem;">
														{pay.desc}
													</span>
												</div>
											</label>
										</div>
									{/each}
								</div>
							{/each}
						</div>
					</div>

					<!-- KOLOM KANAN: RINGKASAN PESANAN STICKY -->
					<div class="col-12 col-lg-5">
						<div class="surface-card p-4 sticky-top" style="top: 86px;">
							<h2 class="h5 font-heading fw-semibold pb-3 mb-3 hairline-bottom">
								Ringkasan Pesanan ({data.cart.totalQuantity} Item)
							</h2>

							<div class="d-flex flex-column gap-2.5 mb-3 pb-3 hairline-bottom" style="max-height: 320px; overflow-y: auto;">
								{#each data.cart.items as item}
									<div class="d-flex gap-2.5 align-items-center small">
										<img
											src={item.imageUrl}
											alt={item.productName}
											class="rounded border object-fit-cover flex-shrink-0"
											style="width: 48px; height: 48px; background-color: var(--bg-subtle);"
										/>
										<div class="flex-grow-1 min-w-0">
											<strong class="d-block text-truncate">{item.productName}</strong>
											<span class="text-secondary-warm d-block" style="font-size: 0.72rem;">
												{item.colorName} • {item.quantity} × {formatRupiah(item.unitPrice)}
											</span>
										</div>
										<span class="price-tabular fw-semibold flex-shrink-0">
											{formatRupiah(item.subtotal)}
										</span>
									</div>
								{/each}
							</div>

							<div class="d-flex flex-column gap-2 small mb-3 pb-3 hairline-bottom">
								<div class="d-flex justify-content-between">
									<span class="text-secondary-warm">Subtotal Produk</span>
									<span class="price-tabular fw-medium">{formatRupiah(data.cart.subtotal)}</span>
								</div>
								<div class="d-flex justify-content-between">
									<span class="text-secondary-warm">
										Ongkos Kirim ({distanceKm} km • {activeCourierObj?.name})
									</span>
									<span class="price-tabular fw-medium">{formatRupiah(activeCourierObj?.cost || 0)}</span>
								</div>
								<div class="d-flex justify-content-between">
									<span class="text-secondary-warm">Metode Pembayaran</span>
									<span class="fw-semibold text-dark">{selectedPayment}</span>
								</div>
							</div>

							<div class="d-flex justify-content-between align-items-center mb-4">
								<span class="font-heading fw-semibold">Total Pembayaran</span>
								<span class="price-tabular fs-4 fw-bold text-dark">{formatRupiah(grandTotal)}</span>
							</div>

							<button
								type="submit"
								class="btn btn-primary w-100 py-2.5 fw-semibold"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Memproses Pesanan...' : 'Buat Pesanan & Lanjut Bayar'}
							</button>

							<p class="text-secondary-warm text-center mt-2.5 mb-0" style="font-size: 0.72rem;">
								Stok produk otomatis dikunci saat invoice diterbitkan.
							</p>
						</div>
					</div>
				</div>
			</form>
		{/if}
	</div>
</section>

<style>
	:global(.spin-icon) {
		animation: spin360 1s linear infinite;
	}

	@keyframes spin360 {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>