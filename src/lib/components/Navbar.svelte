<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Search, Heart, User, ShoppingBag, Menu, ShieldCheck } from 'lucide-svelte';

	let { cartCount = 0, wishlistCount = 0, user = null } = $props();
	let searchQuery = $state('');

	$effect(() => {
		searchQuery = page.url.searchParams.get('q') || '';
	});

	function handleSearch(e) {
		e.preventDefault();
		const trimmed = searchQuery.trim();
		if (trimmed) {
			goto(`/katalog?q=${encodeURIComponent(trimmed)}`);
		} else {
			goto('/katalog');
		}
	}

	let firstName = $derived(user?.name ? user.name.split(' ')[0] : '');
</script>

<header class="sticky-top hairline-bottom" style="background-color: var(--bg-surface); z-index: 1020;">
	<nav class="navbar navbar-expand-lg py-2.5">
		<div class="container">
			<!-- Logo Brand -->
			<a class="navbar-brand d-flex align-items-center gap-2 font-heading fw-bold fs-4 text-dark me-4" href="/">
				<span
					class="d-inline-flex align-items-center justify-content-center border rounded"
					style="width: 30px; height: 30px; background-color: var(--bg-subtle);"
				>
					<span style="width: 10px; height: 14px; border: 1.5px solid var(--text-primary); border-radius: 2px; display: inline-block;"></span>
				</span>
				<span>SEMAT</span>
			</a>

			<!-- Aksi Kanan Mobile -->
			<div class="d-flex align-items-center gap-2 d-lg-none">
				<button
					type="button"
					class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5"
					data-bs-toggle="offcanvas"
					data-bs-target="#miniCartOffcanvas"
					aria-label="Buka keranjang belanja"
				>
					<ShoppingBag size={16} />
					<span class="badge bg-white text-dark price-tabular">{cartCount}</span>
				</button>
				<button
					class="navbar-toggler border p-1.5"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNavbarCollapse"
					aria-controls="mainNavbarCollapse"
					aria-expanded="false"
					aria-label="Buka menu navigasi"
				>
					<Menu size={20} />
				</button>
			</div>

			<!-- Menu Utama -->
			<div class="collapse navbar-collapse" id="mainNavbarCollapse">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1 small fw-medium">
					<li class="nav-item">
						<a class="nav-link px-2.5 text-dark" href="/katalog">Katalog</a>
					</li>
					<li class="nav-item">
						<a class="nav-link px-2.5 text-secondary-warm" href="/cara-pemesanan">Cara Pemesanan</a>
					</li>
					<li class="nav-item">
						<a class="nav-link px-2.5 text-secondary-warm" href="/tentang">Tentang</a>
					</li>
					<li class="nav-item">
						<a class="nav-link px-2.5 text-secondary-warm" href="/kontak">Kontak</a>
					</li>
					{#if user?.role === 'admin'}
						<li class="nav-item">
							<a
								class="nav-link px-2.5 fw-semibold d-inline-flex align-items-center gap-1"
								style="color: var(--accent-taupe);"
								href="/admin"
							>
								<ShieldCheck size={15} />
								<span>Panel Admin</span>
							</a>
						</li>
					{/if}
				</ul>

				<!-- Form Pencarian -->
				<form onsubmit={handleSearch} class="d-flex my-2 my-lg-0 me-lg-3" style="min-width: 240px; max-width: 320px; width: 100%;">
					<div class="input-group input-group-sm">
						<span class="input-group-text bg-white border-end-0 text-secondary-warm">
							<Search size={14} />
						</span>
						<input
							type="search"
							class="form-control border-start-0 ps-1"
							placeholder="Cari holder kulit, akrilik B2, reel..."
							aria-label="Cari produk"
							bind:value={searchQuery}
						/>
					</div>
				</form>

				<!-- Tombol Wishlist, Akun/Admin, & Keranjang -->
				<div class="d-flex align-items-center gap-2 pt-2 pt-lg-0">
					<a
						href="/wishlist"
						class="btn btn-outline-hairline btn-sm position-relative p-2"
						title="Wishlist Tersimpan"
						aria-label="Wishlist"
					>
						<Heart size={16} />
						{#if wishlistCount > 0}
							<span
								class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn-taupe price-tabular"
								style="font-size: 0.65rem;"
							>
								{wishlistCount}
							</span>
						{/if}
					</a>

					{#if user}
						<a
							href={user.role === 'admin' ? '/admin' : '/akun'}
							class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5"
						>
							{#if user.role === 'admin'}
								<ShieldCheck size={15} />
								<span>Admin</span>
							{:else}
								<User size={15} />
								<span>{firstName}</span>
							{/if}
						</a>
					{:else}
						<a
							href="/masuk"
							class="btn btn-outline-hairline btn-sm d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5"
						>
							<User size={15} />
							<span>Masuk</span>
						</a>
					{/if}

					<button
						type="button"
						class="btn btn-primary btn-sm d-none d-lg-inline-flex align-items-center gap-2 px-3 py-1.5"
						data-bs-toggle="offcanvas"
						data-bs-target="#miniCartOffcanvas"
					>
						<ShoppingBag size={15} />
						<span>Keranjang</span>
						<span class="badge bg-white text-dark price-tabular">{cartCount}</span>
					</button>
				</div>
			</div>
		</div>
	</nav>
</header>