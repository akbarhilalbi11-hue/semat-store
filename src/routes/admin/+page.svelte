<script>
	import { enhance } from '$app/forms';
	import {
		BarChart3,
		Package,
		Users,
		FolderPlus,
		PlusCircle,
		LogOut,
		Printer,
		Plus,
		Trash2,
		CheckCircle2,
		ShieldCheck,
		MapPin,
		Phone,
		Upload,
		Link2,
		Image as ImageIcon,
		Calendar,
		RotateCcw
	} from 'lucide-svelte';
	import { formatRupiah, formatProductType } from '#lib/utils/format.js';

	let { data, form } = $props();
	let activeTab = $state('reports');
	let orderFilterStatus = $state('all');
	let selectedOrder = $state(null);

	// State filter rentang tanggal pada Laporan Penjualan
	let reportStartDate = $state('');
	let reportEndDate = $state('');

	// State untuk unggah & pratinjau gambar produk baru
	let imageMode = $state('upload');
	let uploadedPreview = $state('');
	let uploadedInfo = $state('');
	let isProcessingImage = $state(false);
	let isSubmittingProduct = $state(false);
	let customImageUrl = $state('');
	let presetImageUrl = $state('/products/kulit-vertikal-tan.svg');

	$effect(() => {
		if (form?.tab) {
			activeTab = form.tab;
		}
		if (form?.success && form?.tab === 'products') {
			uploadedPreview = '';
			uploadedInfo = '';
			customImageUrl = '';
		}
	});

	function toLocalYmd(dateInput) {
		const d = new Date(dateInput);
		if (Number.isNaN(d.getTime())) return '';
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function formatDisplayDate(ymd) {
		if (!ymd) return '';
		const [y, m, d] = ymd.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function applyReportPreset(preset) {
		const now = new Date();
		const todayYmd = toLocalYmd(now);

		if (preset === 'all') {
			reportStartDate = '';
			reportEndDate = '';
		} else if (preset === 'today') {
			reportStartDate = todayYmd;
			reportEndDate = todayYmd;
		} else if (preset === '7d') {
			const past = new Date(now);
			past.setDate(now.getDate() - 6);
			reportStartDate = toLocalYmd(past);
			reportEndDate = todayYmd;
		} else if (preset === 'month') {
			const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			reportStartDate = toLocalYmd(firstOfMonth);
			reportEndDate = todayYmd;
		}
	}

	let hasActiveDateFilter = $derived(Boolean(reportStartDate || reportEndDate));

	let reportPeriodLabel = $derived.by(() => {
		if (!reportStartDate && !reportEndDate) return 'Semua Waktu';
		if (reportStartDate && reportEndDate) {
			return reportStartDate === reportEndDate
				? formatDisplayDate(reportStartDate)
				: `${formatDisplayDate(reportStartDate)} – ${formatDisplayDate(reportEndDate)}`;
		}
		if (reportStartDate) return `Mulai ${formatDisplayDate(reportStartDate)}`;
		return `Sampai ${formatDisplayDate(reportEndDate)}`;
	});

	// Kalkulasi laporan penjualan dinamis sesuai rentang tanggal + daftar tanggal per produk
	let filteredReport = $derived.by(() => {
		const validRevenueStatuses = new Set(['paid', 'processing', 'shipped', 'completed']);
		const statusBreakdown = {
			pending_payment: { count: 0, amount: 0 },
			paid: { count: 0, amount: 0 },
			processing: { count: 0, amount: 0 },
			shipped: { count: 0, amount: 0 },
			completed: { count: 0, amount: 0 },
			cancelled: { count: 0, amount: 0 },
			expired: { count: 0, amount: 0 }
		};

		const productSalesMap = new Map();
		let validRevenue = 0;
		let validOrderCount = 0;

		for (const order of data.orders) {
			const orderYmd = toLocalYmd(order.createdAt);
			if (reportStartDate && orderYmd < reportStartDate) continue;
			if (reportEndDate && orderYmd > reportEndDate) continue;

			const st = order.status || 'pending_payment';
			if (statusBreakdown[st]) {
				statusBreakdown[st].count += 1;
				statusBreakdown[st].amount += order.totalAmount || 0;
			}

			if (validRevenueStatuses.has(st)) {
				validRevenue += order.totalAmount || 0;
				validOrderCount += 1;

				for (const it of order.items || []) {
					const key = it.productNameSnapshot;
					const prev = productSalesMap.get(key) || {
						productName: key,
						unitsSold: 0,
						revenue: 0,
						orderCount: 0,
						dates: new Set()
					};
					prev.unitsSold += it.quantity || 0;
					prev.revenue += it.subtotal || 0;
					prev.orderCount += 1;
					if (orderYmd) prev.dates.add(orderYmd);
					productSalesMap.set(key, prev);
				}
			}
		}

		const productSales = Array.from(productSalesMap.values())
			.map((item) => {
				const sortedDates = Array.from(item.dates).sort();
				let dateLabel = '-';
				if (sortedDates.length === 1) {
					dateLabel = formatDisplayDate(sortedDates[0]);
				} else if (sortedDates.length > 1) {
					dateLabel = `${formatDisplayDate(sortedDates[0])} – ${formatDisplayDate(
						sortedDates[sortedDates.length - 1]
					)}`;
				}
				return { ...item, dateLabel };
			})
			.sort((a, b) => b.revenue - a.revenue);

		return {
			productSales,
			statusBreakdown,
			validRevenue,
			validOrderCount
		};
	});

	let activePreviewUrl = $derived.by(() => {
		if (imageMode === 'upload') return uploadedPreview || '/products/placeholder.svg';
		if (imageMode === 'url') return customImageUrl.trim() || '/products/placeholder.svg';
		return presetImageUrl;
	});

	function handleImageFileChange(e) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			uploadedInfo = 'Format tidak valid. Pilih file JPG, PNG, WebP, atau SVG.';
			uploadedPreview = '';
			return;
		}

		isProcessingImage = true;
		uploadedInfo = 'Memproses gambar...';

		if (file.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = () => {
				uploadedPreview = String(reader.result || '');
				uploadedInfo = `Siap diunggah: ${file.name} (${Math.round(file.size / 1024)} KB)`;
				isProcessingImage = false;
			};
			reader.onerror = () => {
				uploadedInfo = 'Gagal membaca file SVG.';
				isProcessingImage = false;
			};
			reader.readAsDataURL(file);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const maxDim = 640;
				let width = img.width;
				let height = img.height;

				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round((height * maxDim) / width);
						width = maxDim;
					} else {
						width = Math.round((width * maxDim) / height);
						height = maxDim;
					}
				}

				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);

				const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
				const approxKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

				uploadedPreview = compressedDataUrl;
				uploadedInfo = `Siap diunggah: ${file.name} (${width}×${height} px • ${approxKb} KB)`;
				isProcessingImage = false;
			};
			img.onerror = () => {
				uploadedInfo = 'File gambar rusak atau format tidak didukung browser.';
				uploadedPreview = '';
				isProcessingImage = false;
			};
			img.src = String(reader.result || '');
		};
		reader.onerror = () => {
			uploadedInfo = 'Gagal membaca file gambar dari perangkat.';
			isProcessingImage = false;
		};
		reader.readAsDataURL(file);
	}

	const statusLabels = {
		pending_payment: 'Menunggu Pembayaran',
		paid: 'Sudah Dibayar',
		processing: 'Sedang Diproses',
		shipped: 'Dalam Pengiriman',
		completed: 'Selesai',
		cancelled: 'Dibatalkan',
		expired: 'Kedaluwarsa'
	};

	const svgPresets = [
		{ label: 'Kulit Vertikal — Tan', url: '/products/kulit-vertikal-tan.svg' },
		{ label: 'Kulit Vertikal — Hitam', url: '/products/kulit-vertikal-hitam.svg' },
		{ label: 'Kulit Horizontal — Cokelat', url: '/products/kulit-horizontal-cokelat.svg' },
		{ label: 'Akrilik Bening B2', url: '/products/akrilik-bening-b2.svg' },
		{ label: 'Akrilik Frosted B1', url: '/products/akrilik-frosted-b1.svg' },
		{ label: 'Retractable Reel Hitam', url: '/products/reel-hitam.svg' },
		{ label: 'Retractable Reel Silver', url: '/products/reel-silver.svg' },
		{ label: 'Paket Lanyard Sand', url: '/products/paket-lanyard-sand.svg' },
		{ label: 'Paket Panitia Biru', url: '/products/paket-panitia-biru.svg' }
	];

	let filteredOrders = $derived(
		orderFilterStatus === 'all'
			? data.orders
			: data.orders.filter((o) => o.status === orderFilterStatus)
	);

	function handlePrintReport() {
		activeTab = 'reports';
		setTimeout(() => {
			window.print();
		}, 80);
	}
</script>

<svelte:head>
	<title>Panel Administrator — SEMAT</title>
</svelte:head>

<!-- TOP BAR KHUSUS ADMIN -->
<header class="sticky-top hairline-bottom no-print" style="background-color: var(--bg-surface); z-index: 1020;">
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
					<span class="badge btn-taupe" style="font-size: 0.7rem;">Panel Administrator</span>
				</div>
				<span class="small text-secondary-warm d-block" style="font-size: 0.75rem;">
					{data.admin.name} ({data.admin.email})
				</span>
			</div>
		</div>

		<div class="d-flex align-items-center gap-2">
			<button
				type="button"
				class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5"
				onclick={handlePrintReport}
			>
				<Printer size={15} />
				<span>Cetak Laporan</span>
			</button>

			<form method="POST" action="/keluar">
				<button type="submit" class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5">
					<LogOut size={15} />
					<span>Keluar ke Beranda</span>
				</button>
			</form>
		</div>
	</div>
</header>

<section class="py-4 py-lg-5 print-container">
	<div class="container">
		<!-- KOP LAPORAN KHUSUS SAAT DICETAK -->
		<div class="print-only mb-4 pb-3 border-bottom border-dark">
			<div class="d-flex justify-content-between align-items-end">
				<div>
					<div class="fw-bold fs-4">SEMAT — Studio Perlengkapan Kartu Pengenal</div>
					<div class="small">Laporan Penjualan, Omzet Produk & Rekapitulasi Transaksi</div>
					<div class="small fw-semibold mt-1">Periode Laporan: {reportPeriodLabel}</div>
				</div>
				<div class="text-end small">
					<div>Dicetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
					<div>Operator: {data.admin.name}</div>
				</div>
			</div>
		</div>

		<!-- Kartu Metrik Ringkas Atas -->
		<div class="row g-3 mb-4 print-summary-grid">
			<div class="col-6 col-lg-3">
				<div class="surface-card p-3 print-box">
					<span class="small text-secondary-warm d-block mb-1">Total Pendapatan Valid</span>
					<span class="price-tabular fs-5 fw-bold">{formatRupiah(data.summary.totalRevenue)}</span>
					<span class="d-block text-secondary-warm mt-1" style="font-size: 0.72rem;">
						Dari {data.summary.totalPaidOrders} transaksi lunas/selesai
					</span>
				</div>
			</div>
			<div class="col-6 col-lg-3">
				<div class="surface-card p-3 print-box">
					<span class="small text-secondary-warm d-block mb-1">Total Pesanan</span>
					<span class="price-tabular fs-5 fw-bold">{data.summary.totalOrders} Pesanan</span>
					<span class="d-block text-secondary-warm mt-1" style="font-size: 0.72rem;">
						{data.summary.pendingActionOrders} perlu dikemas/diproses
					</span>
				</div>
			</div>
			<div class="col-6 col-lg-3">
				<div class="surface-card p-3 print-box">
					<span class="small text-secondary-warm d-block mb-1">Pelanggan Terdaftar</span>
					<span class="price-tabular fs-5 fw-bold">{data.summary.totalCustomers} Akun</span>
					<span class="d-block text-secondary-warm mt-1" style="font-size: 0.72rem;">
						{data.summary.totalProducts} produk di {data.categories.length} kategori
					</span>
				</div>
			</div>
			<div class="col-6 col-lg-3">
				<div class="surface-card p-3 print-box">
					<span class="small text-secondary-warm d-block mb-1">Peringatan Stok</span>
					<span class="price-tabular fs-5 fw-bold">{data.summary.lowStockVariants} Varian</span>
					<span class="d-block text-secondary-warm mt-1" style="font-size: 0.72rem;">
						Stok 5 unit atau kurang
					</span>
				</div>
			</div>
		</div>

		<!-- Navigasi Tab Panel Admin -->
		<div class="d-flex flex-wrap gap-2 mb-4 pb-2 hairline-bottom no-print">
			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'reports' ? 'btn-primary' : 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'reports')}
			>
				<BarChart3 size={15} />
				<span>Laporan Penjualan</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'orders' ? 'btn-primary' : 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'orders')}
			>
				<Package size={15} />
				<span>Pesanan ({data.orders.length})</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'customers' ? 'btn-primary' : 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'customers')}
			>
				<Users size={15} />
				<span>Daftar Pelanggan ({data.customers.length})</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'categories' ? 'btn-primary' : 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'categories')}
			>
				<FolderPlus size={15} />
				<span>Kategori ({data.categories.length})</span>
			</button>

			<button
				type="button"
				class="btn btn-sm d-inline-flex align-items-center gap-2 {activeTab === 'products' ? 'btn-primary' : 'btn-outline-hairline'}"
				onclick={() => (activeTab = 'products')}
			>
				<PlusCircle size={15} />
				<span>Produk & Katalog ({data.products.length})</span>
			</button>
		</div>

		<!-- Notifikasi Feedback Action -->
		{#if form?.error}
			<div class="p-3 rounded mb-4 small no-print" style="background-color: var(--status-danger-bg); color: var(--status-danger-text);">
				{form.error}
			</div>
		{/if}
		{#if form?.success}
			<div class="p-3 rounded mb-4 small d-flex align-items-center gap-2 no-print" style="background-color: var(--status-success-bg); color: var(--status-success-text);">
				<CheckCircle2 size={16} />
				<span>{form.success}</span>
			</div>
		{/if}

		<!-- ============================================================ -->
		<!-- TAB 1: DETAIL LAPORAN PENJUALAN (FILTER + KOLOM TANGGAL)     -->
		<!-- ============================================================ -->
		{#if activeTab === 'reports'}
			<!-- Bilah Filter Tanggal & Reset Filter -->
			<div class="surface-card p-3 mb-4 no-print">
				<div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
					<div class="d-flex flex-wrap align-items-center gap-2">
						<span class="small fw-semibold d-inline-flex align-items-center gap-1.5 text-dark me-1">
							<Calendar size={15} />
							<span>Filter Periode:</span>
						</span>

						<button
							type="button"
							class="btn btn-sm py-1 px-2.5 {!hasActiveDateFilter ? 'btn-primary' : 'btn-outline-hairline'}"
							style="font-size: 0.76rem;"
							onclick={() => applyReportPreset('all')}
						>
							Semua Waktu
						</button>
						<button
							type="button"
							class="btn btn-outline-hairline btn-sm py-1 px-2.5"
							style="font-size: 0.76rem;"
							onclick={() => applyReportPreset('today')}
						>
							Hari Ini
						</button>
						<button
							type="button"
							class="btn btn-outline-hairline btn-sm py-1 px-2.5"
							style="font-size: 0.76rem;"
							onclick={() => applyReportPreset('7d')}
						>
							7 Hari Terakhir
						</button>
						<button
							type="button"
							class="btn btn-outline-hairline btn-sm py-1 px-2.5"
							style="font-size: 0.76rem;"
							onclick={() => applyReportPreset('month')}
						>
							Bulan Ini
						</button>
					</div>

					<div class="d-flex flex-wrap align-items-center gap-2">
						<div class="d-flex align-items-center gap-1.5">
							<label for="repStart" class="small text-secondary-warm mb-0">Dari:</label>
							<input
								id="repStart"
								type="date"
								class="form-control form-control-sm"
								style="width: 145px;"
								bind:value={reportStartDate}
							/>
						</div>

						<div class="d-flex align-items-center gap-1.5">
							<label for="repEnd" class="small text-secondary-warm mb-0">Sampai:</label>
							<input
								id="repEnd"
								type="date"
								class="form-control form-control-sm"
								style="width: 145px;"
								bind:value={reportEndDate}
							/>
						</div>

						{#if hasActiveDateFilter}
							<button
								type="button"
								class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1 text-danger"
								onclick={() => applyReportPreset('all')}
								title="Reset filter tanggal"
							>
								<RotateCcw size={13} />
								<span>Reset</span>
							</button>
						{/if}
					</div>
				</div>

				{#if hasActiveDateFilter}
					<div class="mt-2.5 pt-2.5 hairline-top d-flex flex-wrap justify-content-between align-items-center gap-2 small">
						<span class="text-secondary-warm">
							Menampilkan periode: <strong class="text-dark">{reportPeriodLabel}</strong>
						</span>
						<span class="price-tabular text-dark">
							Pendapatan Valid Periode Ini: <strong>{formatRupiah(filteredReport.validRevenue)}</strong> ({filteredReport.validOrderCount} transaksi)
						</span>
					</div>
				{/if}
			</div>

			<div class="row g-4 print-report-layout">
				<div class="col-12 col-lg-8 print-full-width">
					<div class="surface-card p-3 p-md-4 h-100 print-box">
						<div class="d-flex flex-wrap justify-content-between align-items-start gap-2 pb-3 mb-3 hairline-bottom">
							<div>
								<h2 class="h5 font-heading fw-semibold mb-0">Detail Penjualan per Produk</h2>
								<span class="small text-secondary-warm">Akumulasi unit terjual dan omzet dari transaksi valid</span>
							</div>
							<span class="badge bg-white text-dark border small">{reportPeriodLabel}</span>
						</div>

						{#if filteredReport.productSales.length === 0}
							<p class="small text-secondary-warm mb-0">
								Tidak ada transaksi berstatus lunas atau selesai pada periode <strong>{reportPeriodLabel}</strong>.
							</p>
						{:else}
							<div class="table-responsive">
								<table class="table table-sm align-middle small mb-0 print-table">
									<thead>
										<tr class="text-secondary-warm">
											<th style="width: 34%;">Nama Produk</th>
											<th style="width: 22%;">Tanggal</th>
											<th class="text-center" style="width: 12%;">Transaksi</th>
											<th class="text-end" style="width: 14%;">Unit Terjual</th>
											<th class="text-end" style="width: 18%;">Total Pendapatan</th>
										</tr>
									</thead>
									<tbody>
										{#each filteredReport.productSales as row}
											<tr>
												<td class="fw-medium">{row.productName}</td>
												<td class="text-secondary-warm">{row.dateLabel}</td>
												<td class="text-center price-tabular">{row.orderCount}×</td>
												<td class="text-end price-tabular">{row.unitsSold} pcs</td>
												<td class="text-end price-tabular fw-semibold">{formatRupiah(row.revenue)}</td>
											</tr>
										{/each}
									</tbody>
									<tfoot class="hairline-top">
										<tr class="fw-bold">
											<td colspan="3">Total Omzet Produk</td>
											<td class="text-end price-tabular">
												{filteredReport.productSales.reduce((s, r) => s + r.unitsSold, 0)} pcs
											</td>
											<td class="text-end price-tabular">
												{formatRupiah(filteredReport.productSales.reduce((s, r) => s + r.revenue, 0))}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						{/if}
					</div>
				</div>

				<div class="col-12 col-lg-4 print-full-width">
					<div class="surface-card p-3 p-md-4 h-100 print-box">
						<h2 class="h5 font-heading fw-semibold pb-3 mb-3 hairline-bottom">Rekap Status Transaksi</h2>
						<table class="table table-sm align-middle small mb-0 print-table">
							<thead>
								<tr class="text-secondary-warm">
									<th>Status</th>
									<th class="text-center">Jumlah</th>
									<th class="text-end">Nominal</th>
								</tr>
							</thead>
							<tbody>
								{#each Object.entries(filteredReport.statusBreakdown) as [stKey, stVal]}
									<tr>
										<td class="fw-medium">{statusLabels[stKey] || stKey}</td>
										<td class="text-center price-tabular">{stVal.count}</td>
										<td class="text-end price-tabular fw-semibold">{formatRupiah(stVal.amount)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>

		<!-- ============================================================ -->
		<!-- TAB 2: MANAJEMEN & DETAIL PESANAN                            -->
		<!-- ============================================================ -->
		{:else if activeTab === 'orders'}
			<div class="surface-card p-3 p-md-4">
				<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 hairline-bottom">
					<div>
						<h2 class="h5 font-heading fw-semibold mb-0">Daftar Pesanan Masuk</h2>
						<span class="small text-secondary-warm">Kelola status pemrosesan, alamat tujuan, dan nomor resi</span>
					</div>

					<div class="d-flex align-items-center gap-2">
						<label for="filterOrderSt" class="small text-secondary-warm">Filter Status:</label>
						<select id="filterOrderSt" class="form-select form-select-sm" style="width: 210px;" bind:value={orderFilterStatus}>
							<option value="all">Semua Status ({data.orders.length})</option>
							{#each Object.entries(statusLabels) as [k, v]}
								<option value={k}>{v}</option>
							{/each}
						</select>
					</div>
				</div>

				{#if filteredOrders.length === 0}
					<p class="small text-secondary-warm mb-0">Tidak ada pesanan dengan status tersebut.</p>
				{:else}
					<div class="d-flex flex-column gap-3">
						{#each filteredOrders as order}
							<div class="p-3 rounded border" style="background-color: var(--bg-canvas);">
								<div class="d-flex flex-wrap justify-content-between align-items-start gap-2 pb-2 mb-2 hairline-bottom">
									<div>
										<div class="d-flex flex-wrap align-items-center gap-2">
											<strong class="font-heading">{order.invoiceNumber}</strong>
											<span class="badge bg-white text-dark border">
												{statusLabels[order.status] || order.status}
											</span>
											{#if order.trackingNumber}
												<span class="badge btn-taupe">Resi: {order.trackingNumber}</span>
											{/if}
										</div>
										<span class="small text-secondary-warm">
											Tanggal Pesan: {new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
										</span>
									</div>

									<div class="d-flex align-items-center gap-3">
										<div class="text-end">
											<span class="d-block text-secondary-warm" style="font-size: 0.72rem;">Total Pembayaran</span>
											<span class="price-tabular fw-bold fs-6">{formatRupiah(order.totalAmount)}</span>
										</div>
										<button
											type="button"
											class="btn btn-sm {selectedOrder?.id === order.id ? 'btn-primary' : 'btn-outline-hairline'}"
											onclick={() => (selectedOrder = selectedOrder?.id === order.id ? null : order)}
										>
											{selectedOrder?.id === order.id ? 'Tutup Form' : 'Kelola Pesanan'}
										</button>
									</div>
								</div>

								<div class="row g-3 small">
									<div class="col-12 col-md-5">
										<span class="text-secondary-warm d-block mb-1" style="font-size: 0.72rem;">Penerima & Alamat Pengiriman</span>
										<strong class="d-block">{order.recipientName || order.customer.name} ({order.recipientPhone || order.customer.whatsapp})</strong>
										<p class="text-secondary-warm mb-1">{order.resolvedAddress}</p>
										<span class="text-dark fw-medium">Kurir: {order.shippingService} ({formatRupiah(order.shippingCost || 0)})</span>
									</div>

									<div class="col-12 col-md-7">
										<span class="text-secondary-warm d-block mb-1" style="font-size: 0.72rem;">Rincian Item Dipesan</span>
										<div class="d-flex flex-column gap-1">
											{#each order.items as it}
												<div class="d-flex justify-content-between align-items-center py-1 px-2 rounded bg-white border">
													<span>
														{it.productNameSnapshot} <span class="text-secondary-warm">({it.variantNameSnapshot})</span> × <strong>{it.quantity}</strong>
													</span>
													<span class="price-tabular fw-medium">{formatRupiah(it.subtotal)}</span>
												</div>
											{/each}
										</div>
									</div>
								</div>

								{#if selectedOrder?.id === order.id}
									<div class="mt-3 pt-3 hairline-top">
										<form method="POST" action="?/updateOrderStatus" use:enhance class="row g-2 align-items-end">
											<input type="hidden" name="orderId" value={order.id} />
											<div class="col-12 col-sm-5">
												<label for="st-{order.id}" class="form-label small mb-1">Ubah Status Pesanan</label>
												<select id="st-{order.id}" name="status" class="form-select form-select-sm" value={order.status}>
													{#each Object.entries(statusLabels) as [k, v]}
														<option value={k}>{v}</option>
													{/each}
												</select>
											</div>
											<div class="col-12 col-sm-4">
												<label for="resi-{order.id}" class="form-label small mb-1">Nomor Resi Pengiriman</label>
												<input
													id="resi-{order.id}"
													name="trackingNumber"
													type="text"
													class="form-control form-control-sm"
													placeholder="Contoh: SMT-EXP-99210"
													value={order.trackingNumber || ''}
												/>
											</div>
											<div class="col-12 col-sm-3">
												<button type="submit" class="btn btn-primary btn-sm w-100">Simpan Perubahan</button>
											</div>
										</form>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		<!-- ============================================================ -->
		<!-- TAB 3: DAFTAR PELANGGAN TERDAFTAR                            -->
		<!-- ============================================================ -->
		{:else if activeTab === 'customers'}
			<div class="surface-card p-3 p-md-4">
				<div class="pb-3 mb-3 hairline-bottom">
					<h2 class="h5 font-heading fw-semibold mb-0">Direktori Pelanggan Terdaftar</h2>
					<span class="small text-secondary-warm">Data kontak, alamat utama, dan ringkasan belanja tiap pelanggan</span>
				</div>

				{#if data.customers.length === 0}
					<p class="small text-secondary-warm mb-0">Belum ada pelanggan terdaftar.</p>
				{:else}
					<div class="row g-3">
						{#each data.customers as cust}
							<div class="col-12 col-md-6">
								<div class="p-3 rounded border h-100 d-flex flex-column justify-content-between" style="background-color: var(--bg-canvas);">
									<div>
										<div class="d-flex justify-content-between align-items-start gap-2 mb-2">
											<div>
												<strong class="font-heading fs-6 d-block">{cust.name}</strong>
												<span class="small text-secondary-warm">{cust.email}</span>
											</div>
											<span class="badge bg-white text-dark border price-tabular">
												{cust.totalOrders} Pesanan
											</span>
										</div>

										<div class="small text-secondary-warm d-flex align-items-center gap-1.5 mb-1">
											<Phone size={13} />
											<span>{cust.whatsapp}</span>
										</div>

										<div class="small text-secondary-warm d-flex align-items-start gap-1.5 mb-3">
											<MapPin size={13} class="mt-1 flex-shrink-0" />
											<span>{cust.primaryAddress}</span>
										</div>
									</div>

									<div class="pt-2 hairline-top d-flex justify-content-between align-items-center small">
										<span class="text-secondary-warm">
											Bergabung: {new Date(cust.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
										</span>
										<span class="price-tabular fw-semibold">
											Belanja: {formatRupiah(cust.totalSpent)}
										</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

		<!-- ============================================================ -->
		<!-- TAB 4: MANAJEMEN KATEGORI                                    -->
		<!-- ============================================================ -->
		{:else if activeTab === 'categories'}
			<div class="row g-4">
				<div class="col-12 col-lg-5">
					<div class="surface-card p-4">
						<h2 class="h5 font-heading fw-semibold mb-3">Tambah Kategori Baru</h2>
						<form method="POST" action="?/createCategory" use:enhance>
							<div class="mb-3">
								<label for="catName" class="form-label">Nama Kategori</label>
								<input
									id="catName"
									name="name"
									type="text"
									class="form-control"
									placeholder="Contoh: Tali Lanyard Custom"
									required
								/>
							</div>
							<div class="mb-3">
								<label for="catSlug" class="form-label">Slug URL (Opsional)</label>
								<input
									id="catSlug"
									name="slug"
									type="text"
									class="form-control"
									placeholder="Otomatis dari nama jika dikosongkan"
								/>
							</div>
							<div class="mb-4">
								<label for="catDesc" class="form-label">Deskripsi Singkat</label>
								<textarea
									id="catDesc"
									name="description"
									rows="3"
									class="form-control"
									placeholder="Penjelasan singkat tentang fungsi kategori ini..."
								></textarea>
							</div>
							<button type="submit" class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2">
								<Plus size={16} />
								<span>Simpan Kategori</span>
							</button>
						</form>
					</div>
				</div>

				<div class="col-12 col-lg-7">
					<div class="surface-card p-4">
						<h2 class="h5 font-heading fw-semibold mb-3">Daftar Kategori Aktif</h2>
						<div class="table-responsive">
							<table class="table align-middle small mb-0">
								<thead>
									<tr class="text-secondary-warm">
										<th>Nama Kategori</th>
										<th>Slug</th>
										<th class="text-center">Jumlah Produk</th>
										<th class="text-end">Aksi</th>
									</tr>
								</thead>
								<tbody>
									{#each data.categories as cat}
										<tr>
											<td>
												<strong class="d-block">{cat.name}</strong>
												<span class="text-secondary-warm" style="font-size: 0.74rem;">{cat.description}</span>
											</td>
											<td><code>{cat.slug}</code></td>
											<td class="text-center price-tabular">{cat.productCount}</td>
											<td class="text-end">
												{#if cat.productCount === 0}
													<form method="POST" action="?/deleteCategory" use:enhance class="d-inline">
														<input type="hidden" name="categoryId" value={cat.id} />
														<button type="submit" class="btn btn-outline-hairline btn-sm text-danger" aria-label="Hapus kategori">
															<Trash2 size={14} />
														</button>
													</form>
												{:else}
													<span class="text-secondary-warm" style="font-size: 0.72rem;">Digunakan</span>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

		<!-- ============================================================ -->
		<!-- TAB 5: TAMBAH PRODUK BARU (DENGAN UPLOAD GAMBAR KATALOG)     -->
		<!-- ============================================================ -->
		{:else if activeTab === 'products'}
			<div class="row g-4">
				<!-- Form Tambah Produk Baru -->
				<div class="col-12 col-lg-5">
					<div class="surface-card p-4">
						<span class="catalog-kicker d-block mb-1">Input Katalog</span>
						<h2 class="h5 font-heading fw-semibold mb-3">Tambah Produk Baru</h2>

						<form
							method="POST"
							action="?/createProduct"
							use:enhance={() => {
								isSubmittingProduct = true;
								return async ({ update }) => {
									await update();
									isSubmittingProduct = false;
								};
							}}
						>
							<input type="hidden" name="imageMode" value={imageMode} />
							<input type="hidden" name="uploadedImageData" value={uploadedPreview} />

							<div class="mb-2.5">
								<label for="prodCat" class="form-label">Kategori Produk</label>
								<select id="prodCat" name="categoryId" class="form-select form-select-sm" required>
									{#each data.categories as cat}
										<option value={cat.id}>{cat.name}</option>
									{/each}
								</select>
							</div>

							<div class="mb-2.5">
								<label for="prodName" class="form-label">Nama Produk</label>
								<input
									id="prodName"
									name="name"
									type="text"
									class="form-control form-control-sm"
									placeholder="Contoh: Semat Naka Magnetic Card Holder"
									required
								/>
							</div>

							<div class="row g-2 mb-2.5">
								<div class="col-6">
									<label for="prodType" class="form-label">Tipe / Orientasi</label>
									<select id="prodType" name="productType" class="form-select form-select-sm">
										<option value="vertikal">Vertikal</option>
										<option value="horizontal">Horizontal</option>
										<option value="reel">Retractable Reel</option>
										<option value="paket">Paket Lanyard</option>
										<option value="aksesori">Aksesori</option>
									</select>
								</div>
								<div class="col-6">
									<label for="prodPrice" class="form-label">Harga Dasar (Rp)</label>
									<input
										id="prodPrice"
										name="basePrice"
										type="number"
										min="1000"
										step="500"
										class="form-control form-control-sm"
										placeholder="85000"
										required
									/>
								</div>
							</div>

							<div class="row g-2 mb-2.5">
								<div class="col-6">
									<label for="prodSize" class="form-label">Ukuran Kartu</label>
									<input
										id="prodSize"
										name="cardSizeSpec"
										type="text"
										class="form-control form-control-sm"
										value="CR80 (85.6 × 54 mm)"
										required
									/>
								</div>
								<div class="col-6">
									<label for="prodMat" class="form-label">Material Utama</label>
									<input
										id="prodMat"
										name="material"
										type="text"
										class="form-control form-control-sm"
										placeholder="Kulit Sapi Nabati"
										required
									/>
								</div>
							</div>

							<div class="mb-2.5">
								<label for="prodSub" class="form-label">Subjudul Singkat</label>
								<input
									id="prodSub"
									name="subtitle"
									type="text"
									class="form-control form-control-sm"
									placeholder="2 slot kartu dengan pengait kuningan solid"
								/>
							</div>

							<div class="mb-3">
								<label for="prodDesc" class="form-label">Deskripsi Produk</label>
								<textarea
									id="prodDesc"
									name="description"
									rows="2"
									class="form-control form-control-sm"
									placeholder="Catatan penggunaan dan detail pengerjaan..."
								></textarea>
							</div>

							<!-- Bagian Gambar Katalog Produk -->
							<div class="surface-subtle p-3 mb-3">
								<span class="small fw-semibold d-block mb-2">Gambar Produk di Katalog</span>

								<div class="btn-group btn-group-sm w-100 mb-2.5" role="group">
									<button
										type="button"
										class="btn d-inline-flex align-items-center justify-content-center gap-1 {imageMode === 'upload'
											? 'btn-primary'
											: 'btn-outline-hairline bg-white'}"
										onclick={() => (imageMode = 'upload')}
									>
										<Upload size={13} />
										<span>Unggah Foto</span>
									</button>
									<button
										type="button"
										class="btn d-inline-flex align-items-center justify-content-center gap-1 {imageMode === 'url'
											? 'btn-primary'
											: 'btn-outline-hairline bg-white'}"
										onclick={() => (imageMode = 'url')}
									>
										<Link2 size={13} />
										<span>Link URL</span>
									</button>
									<button
										type="button"
										class="btn d-inline-flex align-items-center justify-content-center gap-1 {imageMode === 'preset'
											? 'btn-primary'
											: 'btn-outline-hairline bg-white'}"
										onclick={() => (imageMode = 'preset')}
									>
										<ImageIcon size={13} />
										<span>Ilustrasi</span>
									</button>
								</div>

								<div class="d-flex gap-2.5 align-items-start">
									<div
										class="rounded border overflow-hidden flex-shrink-0"
										style="width: 78px; height: 78px; background-color: var(--bg-canvas);"
									>
										<img
											src={activePreviewUrl}
											alt="Pratinjau gambar katalog"
											class="w-100 h-100 object-fit-cover"
											onerror={(e) => {
												e.currentTarget.src = '/products/placeholder.svg';
											}}
										/>
									</div>

									<div class="flex-grow-1 min-w-0">
										{#if imageMode === 'upload'}
											<input
												id="prodImageFile"
												type="file"
												accept="image/*"
												class="form-control form-control-sm mb-1"
												onchange={handleImageFileChange}
											/>
											<span
												class="d-block {uploadedPreview ? 'text-success fw-medium' : 'text-secondary-warm'}"
												style="font-size: 0.7rem;"
											>
												{uploadedInfo || 'Pilih foto JPG, PNG, WebP, atau SVG dari perangkat.'}
											</span>
										{:else if imageMode === 'url'}
											<input
												id="prodCustomUrl"
												name="customImageUrl"
												type="url"
												class="form-control form-control-sm mb-1"
												placeholder="https://contoh.com/foto-holder.jpg"
												bind:value={customImageUrl}
											/>
											<span class="d-block text-secondary-warm" style="font-size: 0.7rem;">
												Tempel tautan langsung menuju file gambar produk.
											</span>
										{:else}
											<select
												id="varImg"
												name="presetImageUrl"
												class="form-select form-select-sm mb-1"
												bind:value={presetImageUrl}
											>
												{#each svgPresets as preset}
													<option value={preset.url}>{preset.label}</option>
												{/each}
											</select>
											<span class="d-block text-secondary-warm" style="font-size: 0.7rem;">
												Menggunakan ilustrasi vektor bawaan studio SEMAT.
											</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Varian Warna Pertama -->
							<div class="surface-subtle p-3 mb-3">
								<span class="small fw-semibold d-block mb-2">Varian Warna Pertama</span>
								<div class="row g-2 mb-2">
									<div class="col-8">
										<label for="varColor" class="form-label small mb-1">Nama Warna</label>
										<input
											id="varColor"
											name="colorName"
											type="text"
											class="form-control form-control-sm"
											placeholder="Cokelat Tan"
											required
										/>
									</div>
									<div class="col-4">
										<label for="varHex" class="form-label small mb-1">Kode Warna</label>
										<input
											id="varHex"
											name="colorHex"
											type="color"
											class="form-control form-control-sm form-control-color w-100"
											value="#8C6D53"
										/>
									</div>
								</div>

								<div class="row g-2">
									<div class="col-6">
										<label for="varSku" class="form-label small mb-1">Kode SKU</label>
										<input
											id="varSku"
											name="sku"
											type="text"
											class="form-control form-control-sm"
											placeholder="SMT-NK-TAN"
											required
										/>
									</div>
									<div class="col-6">
										<label for="varStock" class="form-label small mb-1">Stok Awal</label>
										<input
											id="varStock"
											name="stock"
											type="number"
											min="0"
											class="form-control form-control-sm"
											value="20"
											required
										/>
									</div>
								</div>
							</div>

							<div class="form-check mb-3 small">
								<input class="form-check-input" type="checkbox" id="prodFeat" name="isFeatured" />
								<label class="form-check-label" for="prodFeat">Tampilkan sebagai produk unggulan di Beranda</label>
							</div>

							<button
								type="submit"
								class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
								disabled={isProcessingImage || isSubmittingProduct}
							>
								<Plus size={16} />
								<span>
									{#if isProcessingImage}
										Memproses Gambar...
									{:else if isSubmittingProduct}
										Menyimpan Produk...
									{:else}
										Simpan Produk ke Katalog
									{/if}
								</span>
							</button>
						</form>
					</div>
				</div>

				<!-- Daftar Produk, Manajemen Stok, & Hapus Produk -->
				<div class="col-12 col-lg-7">
					<div class="surface-card p-4">
						<h2 class="h5 font-heading fw-semibold mb-3">Daftar Produk & Stok Varian</h2>
						<div class="d-flex flex-column gap-3">
							{#each data.products as prod}
								<div class="p-3 rounded border" style="background-color: var(--bg-canvas);">
									<div class="d-flex justify-content-between align-items-start gap-2 mb-2">
										<div class="d-flex gap-2.5 align-items-center">
											<img
												src={prod.primaryImage}
												alt={prod.name}
												class="rounded border object-fit-cover"
												style="width: 48px; height: 48px; background-color: var(--bg-subtle);"
											/>
											<div>
												<strong class="d-block small">{prod.name}</strong>
												<span class="text-secondary-warm" style="font-size: 0.72rem;">
													{prod.categoryName} • {formatProductType(prod.productType)} • {formatRupiah(prod.basePrice)}
												</span>
											</div>
										</div>

										<div class="d-flex align-items-center gap-1.5">
											<form method="POST" action="?/toggleProductActive" use:enhance>
												<input type="hidden" name="productId" value={prod.id} />
												<input type="hidden" name="nextActive" value={String(!prod.isActive)} />
												<button
													type="submit"
													class="btn btn-sm py-0 px-2 {prod.isActive ? 'btn-outline-hairline' : 'btn-taupe'}"
													style="font-size: 0.72rem; height: 26px;"
												>
													{prod.isActive ? 'Aktif' : 'Nonaktif'}
												</button>
											</form>

											<form
												method="POST"
												action="?/deleteProduct"
												use:enhance={({ cancel }) => {
													if (!confirm(`Hapus produk "${prod.name}" beserta seluruh variannya?`)) {
														cancel();
													}
												}}
											>
												<input type="hidden" name="productId" value={prod.id} />
												<button
													type="submit"
													class="btn btn-outline-hairline btn-sm py-0 px-2 text-danger d-inline-flex align-items-center gap-1"
													style="font-size: 0.72rem; height: 26px;"
													title="Hapus Produk"
												>
													<Trash2 size={12} />
													<span>Hapus</span>
												</button>
											</form>
										</div>
									</div>

									<!-- Tabel Varian & Update Stok Cepat -->
									<div class="d-flex flex-column gap-1.5 mt-2 pt-2 hairline-top">
										{#each prod.variants as v}
											<form method="POST" action="?/updateVariantStock" use:enhance class="d-flex flex-wrap justify-content-between align-items-center gap-2 small">
												<input type="hidden" name="variantId" value={v.id} />
												<div class="d-flex align-items-center gap-1.5">
													<span
														class="rounded-circle border"
														style="width: 11px; height: 11px; background-color: {v.colorHex}; display: inline-block;"
													></span>
													<span>{v.colorName}</span>
													<code class="text-secondary-warm" style="font-size: 0.7rem;">({v.sku})</code>
												</div>

												<div class="d-flex align-items-center gap-1.5">
													<span class="text-secondary-warm" style="font-size: 0.72rem;">Stok:</span>
													<input
														name="stock"
														type="number"
														min="0"
														class="form-control form-control-sm text-center price-tabular py-0"
														style="width: 68px; height: 26px;"
														value={v.stock}
													/>
													<button type="submit" class="btn btn-outline-hairline btn-sm py-0 px-2" style="height: 26px; font-size: 0.72rem;">
														Update
													</button>
												</div>
											</form>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.print-only {
		display: none;
	}

	@media print {
		:global(body) {
			background: #ffffff !important;
			color: #000000 !important;
			font-size: 11pt !important;
		}

		.no-print {
			display: none !important;
		}

		.print-only {
			display: block !important;
		}

		.print-container {
			padding: 0 !important;
			margin: 0 !important;
		}

		.print-container :global(.container) {
			max-width: 100% !important;
			width: 100% !important;
			padding: 0 !important;
		}

		.print-summary-grid {
			display: grid !important;
			grid-template-columns: repeat(4, 1fr) !important;
			gap: 8px !important;
		}

		.print-summary-grid > div {
			width: 100% !important;
			max-width: 100% !important;
		}

		.print-report-layout {
			display: block !important;
		}

		.print-full-width {
			width: 100% !important;
			max-width: 100% !important;
			margin-bottom: 16px !important;
		}

		.print-box {
			background: #ffffff !important;
			border: 1px solid #333333 !important;
			box-shadow: none !important;
			border-radius: 4px !important;
		}

		.print-table th,
		.print-table td {
			border-bottom: 1px solid #cccccc !important;
			padding: 6px 8px !important;
			color: #000000 !important;
		}
	}
</style>