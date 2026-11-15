<script>
	import { enhance } from '$app/forms';
	import {
		Package,
		MapPin,
		User,
		LogOut,
		CheckCircle2,
		Truck,
		CreditCard,
		XCircle,
		Plus,
		Trash2,
		Phone,
		Mail,
		ShoppingBag,
		ArrowRight,
		Clock
	} from 'lucide-svelte';
	import { formatRupiah } from '#lib/utils/format.js';

	let { data, form } = $props();

	let activeTab = $state('orders');
	let statusFilter = $state('all');
	let expandedOrderId = $state(null);
	let showAddressForm = $state(false);
	let isSubmitting = $state(false);

	$effect(() => {
		if (form?.tab) {
			activeTab = form.tab;
		}
		if (form?.success && form?.tab === 'addresses') {
			showAddressForm = false;
		}
	});

	const statusMeta = {
		pending_payment: {
			label: 'Menunggu Pembayaran',
			step: 1,
			badgeClass: 'btn-taupe'
		},
		paid: {
			label: 'Sudah Dibayar',
			step: 2,
			badgeClass: 'bg-white text-dark border'
		},
		processing: {
			label: 'Sedang Diproses',
			step: 3,
			badgeClass: 'bg-white text-dark border'
		},
		shipped: {
			label: 'Dalam Pengiriman',
			step: 4,
			badgeClass: 'bg-dark text-white'
		},
		completed: {
			label: 'Selesai',
			step: 5,
			badgeClass: 'bg-success-subtle text-success border border-success-subtle'
		},
		cancelled: {
			label: 'Dibatalkan',
			step: 0,
			badgeClass: 'bg-danger-subtle text-danger border border-danger-subtle'
		},
		expired: {
			label: 'Kedaluwarsa',
			step: 0,
			badgeClass: 'bg-light text-secondary border'
		}
	};

	const trackingStages = [
		{ step: 1, title: 'Pesanan Dibuat' },
		{ step: 2, title: 'Pembayaran Lunas' },
		{ step: 3, title: 'Dikemas Studio' },
		{ step: 4, title: 'Dikirim Kurir' },
		{ step: 5, title: 'Pesanan Diterima' }
	];

	let filteredOrders = $derived.by(() => {
		if (statusFilter === 'all') return data.orders;
		if (statusFilter === 'active') {
			return data.orders.filter((o) =>
				['pending_payment', 'paid', 'processing', 'shipped'].includes(o.status)
			);
		}
		return data.orders.filter((o) => o.status === statusFilter);
	});

	function formatDateTime(dateVal) {
		if (!dateVal) return '-';
		return new Date(dateVal).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Akun Saya & Riwayat Pesanan — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<!-- Header Identitas Pelanggan -->
		<div class="surface-card p-4 mb-4">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
				<div class="d-flex align-items-center gap-3">
					<div
						class="rounded-circle border d-flex align-items-center justify-content-center fw-bold font-heading fs-5 flex-shrink-0"
						style="width: 52px; height: 52px; background-color: var(--bg-subtle);"
					>
						{data.profile.name.slice(0, 1).toUpperCase()}
					</div>
					<div>
						<span class="catalog-kicker d-block mb-0.5">Area Pelanggan</span>
						<h1 class="h4 font-heading fw-bold mb-1">{data.profile.name}</h1>
						<div class="d-flex flex-wrap align-items-center gap-3 small text-secondary-warm">
							<span class="d-inline-flex align-items-center gap-1">
								<Mail size={13} />
								<span>{data.profile.email}</span>
							</span>
							{#if data.profile.whatsapp}
								<span class="d-inline-flex align-items-center gap-1">
									<Phone size={13} />
									<span>{data.profile.whatsapp}</span>
								</span>
							{/if}
						</div>
					</div>
				</div>

				<div class="d-flex flex-wrap align-items-center gap-2">
					<a href="/katalog" class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5">
						<ShoppingBag size={14} />
						<span>Belanja Lagi</span>
					</a>

					<form method="POST" action="/keluar">
						<button type="submit" class="btn btn-outline-hairline btn-sm text-danger d-inline-flex align-items-center gap-1.5">
							<LogOut size={14} />
							<span>Keluar</span>
						</button>
					</form>
				</div>
			</div>

			<!-- Ringkasan Statistik Akun -->
			<div class="row g-3 mt-3 pt-3 hairline-top">
				<div class="col-4">
					<span class="small text-secondary-warm d-block">Total Pesanan</span>
					<strong class="price-tabular fs-5">{data.stats.totalOrders} Transaksi</strong>
				</div>
				<div class="col-4">
					<span class="small text-secondary-warm d-block">Pesanan Berjalan</span>
					<strong class="price-tabular fs-5">{data.stats.activeOrdersCount} Pesanan</strong>
				</div>
				<div class="col-4">
					<span class="small text-secondary-warm d-block">Total Belanja Valid</span>
					<strong class="price-tabular fs-5">{formatRupiah(data.stats.totalSpent)}</strong>
				</div>
			</div>
		</div>

		<!-- Navigasi Tab Akun -->
		<div class="d-flex flex-wrap gap-2 mb-4 pb-2 hairline-bottom">
			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'orders'
					? 'btn-primary'
					: 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'orders')}
			>
				<Package size={15} />
				<span>Riwayat Pesanan ({data.orders.length})</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'addresses'
					? 'btn-primary'
					: 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'addresses')}
			>
				<MapPin size={15} />
				<span>Buku Alamat ({data.addresses.length})</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'profile'
					? 'btn-primary'
					: 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'profile')}
			>
				<User size={15} />
				<span>Profil Saya</span>
			</button>
		</div>

		<!-- Notifikasi Feedback Action -->
		{#if form?.error}
			<div class="p-3 rounded mb-4 small" style="background-color: var(--status-danger-bg); color: var(--status-danger-text);">
				{form.error}
			</div>
		{/if}
		{#if form?.success}
			<div class="p-3 rounded mb-4 small d-flex align-items-center gap-2" style="background-color: var(--status-success-bg); color: var(--status-success-text);">
				<CheckCircle2 size={16} />
				<span>{form.success}</span>
			</div>
		{/if}

		<!-- ============================================================ -->
		<!-- TAB 1: RIWAYAT PESANAN & PELACAKAN STATUS                    -->
		<!-- ============================================================ -->
		{#if activeTab === 'orders'}
			<div class="d-flex flex-wrap gap-1.5 mb-3">
				<button
					type="button"
					class="btn btn-sm py-1 px-2.5 {statusFilter === 'all' ? 'btn-primary' : 'btn-outline-hairline'}"
					style="font-size: 0.78rem;"
					onclick={() => (statusFilter = 'all')}
				>
					Semua ({data.orders.length})
				</button>
				<button
					type="button"
					class="btn btn-sm py-1 px-2.5 {statusFilter === 'active' ? 'btn-primary' : 'btn-outline-hairline'}"
					style="font-size: 0.78rem;"
					onclick={() => (statusFilter = 'active')}
				>
					Sedang Berjalan ({data.stats.activeOrdersCount})
				</button>
				<button
					type="button"
					class="btn btn-sm py-1 px-2.5 {statusFilter === 'pending_payment' ? 'btn-primary' : 'btn-outline-hairline'}"
					style="font-size: 0.78rem;"
					onclick={() => (statusFilter = 'pending_payment')}
				>
					Belum Bayar
				</button>
				<button
					type="button"
					class="btn btn-sm py-1 px-2.5 {statusFilter === 'shipped' ? 'btn-primary' : 'btn-outline-hairline'}"
					style="font-size: 0.78rem;"
					onclick={() => (statusFilter = 'shipped')}
				>
					Dalam Pengiriman
				</button>
				<button
					type="button"
					class="btn btn-sm py-1 px-2.5 {statusFilter === 'completed' ? 'btn-primary' : 'btn-outline-hairline'}"
					style="font-size: 0.78rem;"
					onclick={() => (statusFilter = 'completed')}
				>
					Selesai
				</button>
			</div>

			{#if filteredOrders.length === 0}
				<div class="surface-card p-5 text-center">
					<Package size={36} class="text-secondary-warm mb-2" />
					<h2 class="h5 font-heading fw-semibold mb-1">Belum Ada Pesanan</h2>
					<p class="small text-secondary-warm mb-3">
						Transaksi pada kategori ini masih kosong. Jelajahi katalog SEMAT untuk mulai memesan.
					</p>
					<a href="/katalog" class="btn btn-primary btn-sm">Lihat Katalog Produk</a>
				</div>
			{:else}
				<div class="d-flex flex-column gap-3">
					{#each filteredOrders as order}
						{@const meta = statusMeta[order.status] || statusMeta.pending_payment}
						<div class="surface-card p-4">
							<!-- Header Kartu Pesanan -->
							<div class="d-flex flex-wrap justify-content-between align-items-start gap-2 pb-3 mb-3 hairline-bottom">
								<div>
									<div class="d-flex flex-wrap align-items-center gap-2 mb-1">
										<strong class="font-heading fs-6">{order.invoiceNumber}</strong>
										<span class="badge {meta.badgeClass}">{meta.label}</span>
										{#if order.trackingNumber}
											<span class="badge bg-light text-dark border">
												Resi: <strong>{order.trackingNumber}</strong>
											</span>
										{/if}
									</div>
									<span class="small text-secondary-warm d-flex align-items-center gap-1">
										<Clock size={12} />
										<span>Dipesan pada {formatDateTime(order.createdAt)} • {order.paymentMethod}</span>
									</span>
								</div>

								<div class="text-sm-end">
									<span class="small text-secondary-warm d-block">Total Tagihan</span>
									<strong class="price-tabular fs-5">{formatRupiah(order.totalAmount)}</strong>
								</div>
							</div>

							<!-- Pelacakan Tahapan Pengiriman (Untuk Pesanan Aktif/Selesai) -->
							{#if meta.step > 0}
								<div class="surface-subtle p-3 rounded mb-3">
									<div class="row g-2 text-center">
										{#each trackingStages as stg}
											{@const isReached = meta.step >= stg.step}
											<div class="col">
												<div
													class="rounded-pill mx-auto mb-1 d-flex align-items-center justify-content-center fw-bold"
													style="width: 24px; height: 24px; font-size: 0.72rem; background-color: {isReached
														? '#1F1E1B'
														: '#FFFFFF'}; color: {isReached
														? '#FFFFFF'
														: '#6E6A63'}; border: 1px solid #D8D3C8;"
												>
													{stg.step}
												</div>
												<span
													class="d-block {isReached ? 'fw-semibold text-dark' : 'text-secondary-warm'}"
													style="font-size: 0.72rem;"
												>
													{stg.title}
												</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Daftar Item Produk dalam Pesanan -->
							<div class="d-flex flex-column gap-2 mb-3">
								{#each order.items as item}
									<div class="d-flex justify-content-between align-items-center py-2 px-3 rounded border small" style="background-color: var(--bg-canvas);">
										<div>
											<strong class="d-block">{item.productNameSnapshot}</strong>
											<span class="text-secondary-warm" style="font-size: 0.74rem;">
												Varian: {item.variantNameSnapshot} • {item.quantity} × {formatRupiah(item.unitPrice)}
											</span>
										</div>
										<span class="price-tabular fw-semibold">{formatRupiah(item.subtotal)}</span>
									</div>
								{/each}
							</div>

							<!-- Detail Alamat & Tombol Aksi Pelanggan -->
							<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-2 hairline-top">
								<button
									type="button"
									class="btn btn-link btn-sm p-0 text-decoration-none text-secondary-warm"
									onclick={() =>
										(expandedOrderId = expandedOrderId === order.id ? null : order.id)}
								>
									{expandedOrderId === order.id
										? 'Sembunyikan Rincian Pengiriman'
										: 'Lihat Rincian Alamat & Ongkir'}
								</button>

								<div class="d-flex flex-wrap align-items-center gap-2">
									{#if order.status === 'pending_payment'}
										<form
											method="POST"
											action="?/cancelOrder"
											use:enhance={({ cancel }) => {
												if (!confirm(`Batalkan pesanan ${order.invoiceNumber}?`)) cancel();
											}}
										>
											<input type="hidden" name="orderId" value={order.id} />
											<button
												type="submit"
												class="btn btn-outline-hairline btn-sm text-danger d-inline-flex align-items-center gap-1"
											>
												<XCircle size={14} />
												<span>Batalkan</span>
											</button>
										</form>

										<a
											href="/checkout?invoice={order.invoiceNumber}"
											class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
										>
											<CreditCard size={14} />
											<span>Bayar Sekarang</span>
											<ArrowRight size={13} />
										</a>
									{:else if order.status === 'shipped'}
										<form method="POST" action="?/confirmReceived" use:enhance>
											<input type="hidden" name="orderId" value={order.id} />
											<button
												type="submit"
												class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
											>
												<CheckCircle2 size={14} />
												<span>Konfirmasi Pesanan Diterima</span>
											</button>
										</form>
									{:else if order.status === 'completed'}
										<span class="small text-success fw-medium d-inline-flex align-items-center gap-1">
											<CheckCircle2 size={14} />
											<span>Selesai {order.completedAt ? `(${formatDateTime(order.completedAt)})` : ''}</span>
										</span>
									{/if}
								</div>
							</div>

							{#if expandedOrderId === order.id}
								<div class="mt-3 pt-3 hairline-top small text-secondary-warm">
									<div class="row g-2">
										<div class="col-12 col-md-7">
											<strong class="text-dark d-block mb-0.5">Alamat Tujuan Pengiriman:</strong>
											<div>{order.recipientName} ({order.recipientPhone})</div>
											<div>{order.resolvedAddress}</div>
										</div>
										<div class="col-12 col-md-5 text-md-end">
											<strong class="text-dark d-block mb-0.5">Rincian Biaya:</strong>
											<div>Subtotal Produk: {formatRupiah(order.subtotal || 0)}</div>
											<div>
												Ongkir ({order.shippingService}): {formatRupiah(order.shippingCost || 0)}
											</div>
											<div class="text-dark fw-semibold mt-1">
												Total Dibayar: {formatRupiah(order.totalAmount)}
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

		<!-- ============================================================ -->
		<!-- TAB 2: BUKU ALAMAT PENGIRIMAN                                -->
		<!-- ============================================================ -->
		{:else if activeTab === 'addresses'}
			<div class="surface-card p-4">
				<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 hairline-bottom">
					<div>
						<h2 class="h5 font-heading fw-semibold mb-0">Buku Alamat Tersimpan</h2>
						<span class="small text-secondary-warm">Alamat ini dapat dipilih langsung saat proses checkout</span>
					</div>

					<button
						type="button"
						class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
						onclick={() => (showAddressForm = !showAddressForm)}
					>
						<Plus size={15} />
						<span>{showAddressForm ? 'Tutup Form' : 'Tambah Alamat Baru'}</span>
					</button>
				</div>

				{#if showAddressForm}
					<form
						method="POST"
						action="?/addAddress"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
								isSubmitting = false;
							};
						}}
						class="surface-subtle p-3 p-md-4 rounded mb-4"
					>
						<h3 class="h6 font-heading fw-semibold mb-3">Simpan Alamat Baru</h3>
						<div class="row g-3 small">
							<div class="col-12 col-sm-4">
								<label for="addrLbl" class="form-label mb-1">Label Alamat</label>
								<input
									id="addrLbl"
									name="label"
									type="text"
									class="form-control form-control-sm"
									placeholder="Rumah / Kantor / Kampus"
									required
								/>
							</div>
							<div class="col-12 col-sm-4">
								<label for="addrRec" class="form-label mb-1">Nama Penerima</label>
								<input
									id="addrRec"
									name="recipientName"
									type="text"
									class="form-control form-control-sm"
									value={data.profile.name}
									required
								/>
							</div>
							<div class="col-12 col-sm-4">
								<label for="addrTel" class="form-label mb-1">Nomor WhatsApp</label>
								<input
									id="addrTel"
									name="recipientPhone"
									type="tel"
									class="form-control form-control-sm"
									value={data.profile.whatsapp}
									required
								/>
							</div>
							<div class="col-12">
								<label for="addrDet" class="form-label mb-1">Alamat Lengkap</label>
								<textarea
									id="addrDet"
									name="addressDetail"
									rows="2"
									class="form-control form-control-sm"
									placeholder="Nama jalan, nomor rumah/gedung, RT/RW"
									required
								></textarea>
							</div>
							<div class="col-6 col-sm-3">
								<label for="addrDst" class="form-label mb-1">Kecamatan</label>
								<input id="addrDst" name="district" type="text" class="form-control form-control-sm" />
							</div>
							<div class="col-6 col-sm-3">
								<label for="addrCty" class="form-label mb-1">Kota / Kabupaten</label>
								<input id="addrCty" name="city" type="text" class="form-control form-control-sm" required />
							</div>
							<div class="col-6 col-sm-3">
								<label for="addrPrv" class="form-label mb-1">Provinsi</label>
								<input id="addrPrv" name="province" type="text" class="form-control form-control-sm" required />
							</div>
							<div class="col-6 col-sm-3">
								<label for="addrZip" class="form-label mb-1">Kode Pos</label>
								<input id="addrZip" name="postalCode" type="text" class="form-control form-control-sm" />
							</div>
						</div>

						<div class="mt-3 d-flex justify-content-end gap-2">
							<button
								type="button"
								class="btn btn-outline-hairline btn-sm bg-white"
								onclick={() => (showAddressForm = false)}
							>
								Batal
							</button>
							<button type="submit" class="btn btn-primary btn-sm" disabled={isSubmitting}>
								{isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
							</button>
						</div>
					</form>
				{/if}

				{#if data.addresses.length === 0}
					<p class="small text-secondary-warm mb-0">
						Belum ada alamat tersimpan. Tambahkan alamat untuk mempercepat proses checkout berikutnya.
					</p>
				{:else}
					<div class="row g-3">
						{#each data.addresses as addr}
							<div class="col-12 col-md-6">
								<div class="p-3 rounded border h-100 d-flex flex-column justify-content-between" style="background-color: var(--bg-canvas);">
									<div>
										<div class="d-flex justify-content-between align-items-start gap-2 mb-2">
											<span class="badge btn-taupe">{addr.label || 'Alamat Tersimpan'}</span>
											<form method="POST" action="?/deleteAddress" use:enhance>
												<input type="hidden" name="addressId" value={addr.id} />
												<button
													type="submit"
													class="btn btn-outline-hairline btn-sm py-0 px-2 text-danger"
													style="height: 26px;"
													title="Hapus alamat"
												>
													<Trash2 size={13} />
												</button>
											</form>
										</div>

										<strong class="d-block small">{addr.recipientName}</strong>
										<span class="small text-secondary-warm d-block mb-1">{addr.recipientPhone}</span>
										<p class="small text-secondary-warm mb-0">
											{addr.addressDetail}{addr.district && addr.district !== '-' ? `, Kec. ${addr.district}` : ''}, {addr.city}, {addr.province} {addr.postalCode && addr.postalCode !== '-' ? addr.postalCode : ''}
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

		<!-- ============================================================ -->
		<!-- TAB 3: PROFIL AKUN PELANGGAN                                 -->
		<!-- ============================================================ -->
		{:else if activeTab === 'profile'}
			<div class="mx-auto" style="max-width: 560px;">
				<div class="surface-card p-4">
					<h2 class="h5 font-heading fw-semibold pb-3 mb-3 hairline-bottom">Pengaturan Profil</h2>

					<form method="POST" action="?/updateProfile" use:enhance>
						<div class="mb-3">
							<label for="profEmail" class="form-label small">Alamat Email (Terdaftar)</label>
							<input
								id="profEmail"
								type="email"
								class="form-control form-control-sm"
								value={data.profile.email}
								disabled
							/>
							<span class="text-secondary-warm" style="font-size: 0.72rem;">
								Email digunakan sebagai identitas login akun Anda.
							</span>
						</div>

						<div class="mb-3">
							<label for="profName" class="form-label small">Nama Lengkap</label>
							<input
								id="profName"
								name="name"
								type="text"
								class="form-control form-control-sm"
								value={data.profile.name}
								required
							/>
						</div>

						<div class="mb-4">
							<label for="profWa" class="form-label small">Nomor WhatsApp</label>
							<input
								id="profWa"
								name="whatsapp"
								type="tel"
								class="form-control form-control-sm"
								placeholder="08xxxxxxxxxx"
								value={data.profile.whatsapp}
							/>
						</div>

						<button type="submit" class="btn btn-primary btn-sm w-100 py-2">
							Simpan Perubahan Profil
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</section>