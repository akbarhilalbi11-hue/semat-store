<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		MapPin,
		Navigation,
		Truck,
		ShieldCheck,
		CheckCircle2,
		ShoppingBag,
		MessageCircle
	} from 'lucide-svelte';
	import { formatRupiah } from '#lib/utils/format.js';

	const ADMIN_WHATSAPP_NUMBER = '6281262615447';
	const ADMIN_WHATSAPP_DISPLAY = '+62 812-6261-5447';
	const PAYMENT_METHOD_LABEL = 'Hubungi lewat WhatsApp';

	let { data, form } = $props();

	let currentOrder = $state(form?.createdOrder || data.activeOrder || null);
	let autoOpenedInvoice = '';

	function buildWhatsAppUrl(order) {
		if (!order) return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;

		const itemLines = (order.items || [])
			.map(
				(item, idx) =>
					`${idx + 1}. ${item.productNameSnapshot} (${item.variantNameSnapshot}) × ${item.quantity} = ${formatRupiah(item.subtotal)}`
			)
			.join('\n');

		const addressText =
			order.shippingAddress ||
			order.shippingAddressSnapshot ||
			[
				order.shippingAddressDetail,
				order.shippingDistrict && order.shippingDistrict !== '-'
					? `Kec. ${order.shippingDistrict}`
					: '',
				order.shippingCity,
				order.shippingProvince,
				order.shippingPostalCode && order.shippingPostalCode !== '-'
					? order.shippingPostalCode
					: ''
			]
				.filter(Boolean)
				.join(', ');

		const mapsPin =
			order.shippingLatitude && order.shippingLongitude
				? `\n*Titik Lokasi:* https://maps.google.com/?q=${order.shippingLatitude},${order.shippingLongitude}`
				: '';

		const courierNote = order.shippingLandmark
			? `\n*Catatan Kurir:* ${order.shippingLandmark}`
			: '';

		const message = [
			'Halo Admin SEMAT, saya ingin konfirmasi pesanan berikut:',
			'',
			`*No. Invoice:* ${order.invoiceNumber}`,
			`*Nama Penerima:* ${order.recipientName}`,
			`*No. WhatsApp:* ${order.recipientPhone}`,
			'',
			'*Rincian Barang:*',
			itemLines,
			'',
			`*Subtotal Produk:* ${formatRupiah(order.subtotal || 0)}`,
			`*Kurir & Ongkir:* ${order.shippingService} — ${formatRupiah(order.shippingCost || 0)}`,
			`*Total Pembayaran:* *${formatRupiah(order.totalAmount || 0)}*`,
			'',
			`*Alamat Pengiriman:*\n${addressText}${courierNote}${mapsPin}`,
			'',
			`*Metode Pembayaran:* ${PAYMENT_METHOD_LABEL}`,
			'Mohon info rekening / instruksi pembayaran selanjutnya. Terima kasih!'
		].join('\n');

		return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
	}

	let whatsappOrderUrl = $derived(buildWhatsAppUrl(currentOrder));

	$effect(() => {
		if (form?.createdOrder) {
			currentOrder = form.createdOrder;

			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });

				const inv = form.createdOrder.invoiceNumber;
				if (inv && autoOpenedInvoice !== inv) {
					autoOpenedInvoice = inv;
					window.history.replaceState({}, '', `/checkout?invoice=${encodeURIComponent(inv)}`);
					window.open(buildWhatsAppUrl(form.createdOrder), '_blank', 'noopener,noreferrer');
				}
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

	// Kurir & status submit
	let selectedCourier = $state('reguler');
	let isSubmitting = $state(false);

	// Referensi peta Leaflet
	let mapEl = $state(null);
	let mapInstance = null;
	let destMarker = null;
	let routeLine = null;
	let gpsLoading = $state(false);

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

<!-- HEADER CHECKOUT MANDIRI -->
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
			<div
				class="p-3 rounded mb-4 small"
				style="background-color: var(--status-danger-bg); color: var(--status-danger-text);"
			>
				{form.error}
			</div>
		{/if}

		<!-- ================================================================= -->
		<!-- KONDISI A: INVOICE TERBIT & KONFIRMASI VIA WHATSAPP               -->
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
							<span class="catalog-kicker d-block mb-1">Pembayaran Dikonfirmasi</span>
							<h1 class="h3 font-heading fw-bold mb-2">Pesanan Siap Diproses</h1>
							<p class="small text-secondary-warm mb-0">
								Terima kasih, <strong>{currentOrder.recipientName}</strong>. Transaksi
								<strong>{currentOrder.invoiceNumber}</strong> sudah dikonfirmasi dan masuk ke antrean pengemasan studio SEMAT.
							</p>
						</div>
					{:else}
						<div class="pb-4 mb-4 hairline-bottom d-flex flex-wrap justify-content-between align-items-start gap-3">
							<div>
								<span class="catalog-kicker d-block mb-1">Pesanan Berhasil Dibuat</span>
								<h1 class="h3 font-heading fw-bold mb-1">Konfirmasi via WhatsApp</h1>
								<span class="small text-secondary-warm">
									Nomor Invoice: <strong class="text-dark">{currentOrder.invoiceNumber}</strong>
								</span>
							</div>

							<div class="text-end">
								<span class="badge btn-taupe px-3 py-1.5 d-inline-block">
									{PAYMENT_METHOD_LABEL}
								</span>
							</div>
						</div>

						<!-- KOTAK AKSI UTAMA WHATSAPP -->
						<div class="surface-subtle p-4 rounded mb-4 text-center border">
							<div
								class="d-inline-flex align-items-center justify-content-center rounded-circle mb-2.5"
								style="width: 48px; height: 48px; background-color: #25D366; color: #ffffff;"
							>
								<MessageCircle size={24} />
							</div>
							<h2 class="h5 font-heading fw-bold mb-1">Kirim Rincian Pesanan ke Admin</h2>
							<p class="small text-secondary-warm mx-auto mb-3" style="max-width: 460px;">
								Rincian produk, ongkos kirim, alamat lengkap, dan total tagihan sebesar
								<strong class="text-dark">{formatRupiah(currentOrder.totalAmount)}</strong> sudah disiapkan otomatis untuk dikirim ke WhatsApp Admin SEMAT (<strong>{ADMIN_WHATSAPP_DISPLAY}</strong>).
							</p>

							<a
								href={whatsappOrderUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="btn fw-semibold px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2"
								style="background-color: #25D366; color: #ffffff; border: none;"
							>
								<MessageCircle size={18} />
								<span>Buka WhatsApp & Kirim Pesanan</span>
							</a>

							<span class="d-block text-secondary-warm mt-2.5" style="font-size: 0.74rem;">
								Klik tombol di atas jika aplikasi WhatsApp belum terbuka secara otomatis.
							</span>
						</div>
					{/if}

					<!-- Rincian Pengiriman & Item Invoice -->
					<div class="mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h2 class="h6 font-heading fw-semibold mb-0">Rincian Pengiriman & Barang</h2>
							<span class="price-tabular fw-bold text-dark">
								Total: {formatRupiah(currentOrder.totalAmount)}
							</span>
						</div>

						<div class="p-3 rounded border mb-3 small" style="background-color: var(--bg-canvas);">
							<strong class="d-block">{currentOrder.recipientName} ({currentOrder.recipientPhone})</strong>
							<p class="text-secondary-warm mb-1">
								{currentOrder.shippingAddress || currentOrder.shippingAddressSnapshot}
							</p>
							<span class="fw-medium">
								Layanan Kurir: {currentOrder.shippingService} ({formatRupiah(currentOrder.shippingCost || 0)})
							</span>
						</div>

						<div class="d-flex flex-column gap-2 small">
							{#each currentOrder.items as item}
								<div class="d-flex justify-content-between align-items-center py-2 px-3 rounded border bg-white">
									<span>
										{item.productNameSnapshot}
										<span class="text-secondary-warm">({item.variantNameSnapshot})</span> ×
										<strong>{item.quantity}</strong>
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
				<input type="hidden" name="paymentMethod" value={PAYMENT_METHOD_LABEL} />

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
									<label for="addrDetail" class="form-label small">
										Alamat Lengkap (Jalan, Nomor Rumah / Gedung)
									</label>
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

						<!-- 4. Metode Pembayaran (Khusus WhatsApp Admin) -->
						<div class="surface-card p-4">
							<div class="d-flex align-items-center gap-2 pb-3 mb-3 hairline-bottom">
								<MessageCircle size={18} />
								<h2 class="h5 font-heading fw-semibold mb-0">4. Metode Pembayaran</h2>
							</div>

							<label
								class="p-3 rounded border d-flex align-items-start gap-3"
								style="background-color: var(--bg-subtle); cursor: pointer;"
							>
								<input
									type="radio"
									name="paymentRadio"
									class="mt-1"
									value={PAYMENT_METHOD_LABEL}
									checked
									readonly
								/>
								<div class="flex-grow-1">
									<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
										<strong class="small text-dark">{PAYMENT_METHOD_LABEL}</strong>
										<span
											class="badge"
											style="background-color: #25D366; color: #ffffff; font-size: 0.68rem;"
										>
											WhatsApp Official
										</span>
									</div>
									<p class="text-secondary-warm mb-0" style="font-size: 0.76rem;">
										Setelah menekan tombol checkout, rincian barang, ongkos kirim, alamat pengiriman, dan total tagihan akan otomatis dibuatkan menjadi pesan WhatsApp ke Admin SEMAT (<strong>{ADMIN_WHATSAPP_DISPLAY}</strong>).
									</p>
								</div>
							</label>
						</div>
					</div>

					<!-- KOLOM KANAN: RINGKASAN PESANAN STICKY -->
					<div class="col-12 col-lg-5">
						<div class="surface-card p-4 sticky-top" style="top: 86px;">
							<h2 class="h5 font-heading fw-semibold pb-3 mb-3 hairline-bottom">
								Ringkasan Pesanan ({data.cart.totalQuantity} Item)
							</h2>

							<div
								class="d-flex flex-column gap-2.5 mb-3 pb-3 hairline-bottom"
								style="max-height: 320px; overflow-y: auto;"
							>
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
									<span class="fw-semibold text-dark">{PAYMENT_METHOD_LABEL}</span>
								</div>
							</div>

							<div class="d-flex justify-content-between align-items-center mb-4">
								<span class="font-heading fw-semibold">Total Pembayaran</span>
								<span class="price-tabular fs-4 fw-bold text-dark">{formatRupiah(grandTotal)}</span>
							</div>

							<button
								type="submit"
								class="btn btn-primary w-100 py-2.5 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
								disabled={isSubmitting}
							>
								<MessageCircle size={17} />
								<span>
									{isSubmitting ? 'Menyiapkan Pesanan...' : 'Buat Pesanan & Hubungi WhatsApp'}
								</span>
							</button>

							<p class="text-secondary-warm text-center mt-2.5 mb-0" style="font-size: 0.72rem;">
								Pesanan tercatat di akun Anda & format konfirmasi WhatsApp otomatis disiapkan.
							</p>
						</div>
					</div>
				</div>
			</form>
		{/if}
	</div>
</section>