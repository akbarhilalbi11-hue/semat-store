<script>
	import { enhance } from '$app/forms';
	import { ArrowRight, AlertCircle } from 'lucide-svelte';

	let { form } = $props();
	let email = $state(form?.email || '');
	let password = $state('');
	let isSubmitting = $state(false);
	let showResetHint = $state(false);
</script>

<svelte:head>
	<title>Masuk ke Akun — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<div class="surface-card overflow-hidden">
			<div class="row g-0">
				<!-- Kolom Kiri: Visual Katalog & Informasi -->
				<div
					class="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between"
					style="background-color: var(--bg-subtle);"
				>
					<div>
						<span class="catalog-kicker d-block mb-2">Akses Pelanggan & Studio</span>
						<h1 class="h2 font-heading fw-bold mb-3">
							Masuk untuk melanjutkan pesanan dan menyimpan alamat.
						</h1>
						<p class="small text-secondary-warm mb-4" style="max-width: 440px;">
							Keranjang belanja yang Anda isi sebelum masuk akan otomatis digabungkan ke akun Anda.
						</p>
					</div>

					<div class="surface-card p-3 p-md-4 bg-white">
						<div
							class="rounded overflow-hidden mb-3 d-flex align-items-center justify-content-center"
							style="height: 230px; background-color: var(--bg-canvas);"
						>
							<img
								src="/products/kulit-vertikal-tan.svg"
								alt="Seri Loka Kulit Nabati — CR80"
								class="h-100 w-auto object-fit-contain p-3"
							/>
						</div>
						<div class="d-flex justify-content-between align-items-center small">
							<strong class="font-heading">Seri Loka Kulit Nabati — CR80</strong>
							<span class="text-secondary-warm">Katalog 2026</span>
						</div>
					</div>
				</div>

				<!-- Kolom Kanan: Formulir Autentikasi -->
				<div class="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
					<div class="mx-auto w-100" style="max-width: 400px;">
						<span class="catalog-kicker d-block mb-1">Autentikasi Akun</span>
						<h2 class="h3 font-heading fw-bold mb-4">Masuk ke SEMAT</h2>

						{#if form?.error}
							<div
								class="p-3 rounded mb-3 small d-flex align-items-center gap-2"
								style="background-color: var(--status-danger-bg); color: var(--status-danger-text);"
							>
								<AlertCircle size={16} class="flex-shrink-0" />
								<span>{form.error}</span>
							</div>
						{/if}

						<form
							method="POST"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									await update();
									isSubmitting = false;
								};
							}}
						>
							<div class="mb-3">
								<label for="loginEmail" class="form-label small fw-medium">Alamat Email</label>
								<input
									id="loginEmail"
									name="email"
									type="email"
									class="form-control"
									placeholder="nama@email.com"
									autocomplete="email"
									bind:value={email}
									required
								/>
							</div>

							<div class="mb-4">
								<div class="d-flex justify-content-between align-items-center mb-1">
									<label for="loginPassword" class="form-label small fw-medium mb-0">Kata Sandi</label>
									<button
										type="button"
										class="btn btn-link btn-sm p-0 text-decoration-none text-secondary-warm"
										style="font-size: 0.78rem;"
										onclick={() => (showResetHint = !showResetHint)}
									>
										Lupa kata sandi?
									</button>
								</div>
								<input
									id="loginPassword"
									name="password"
									type="password"
									class="form-control"
									placeholder="Masukkan kata sandi"
									autocomplete="current-password"
									bind:value={password}
									required
								/>
								{#if showResetHint}
									<p class="small text-secondary-warm mt-1.5 mb-0" style="font-size: 0.75rem;">
										Hubungi administrator studio SEMAT untuk melakukan pengaturan ulang kata sandi akun Anda.
									</p>
								{/if}
							</div>

							<button
								type="submit"
								class="btn btn-primary w-100 py-2.5 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
								disabled={isSubmitting}
							>
								<span>{isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
								<ArrowRight size={16} />
							</button>
						</form>

						<div class="mt-4 pt-3 hairline-top text-center small">
							<span class="text-secondary-warm">Belum memiliki akun?</span>
							<a href="/daftar" class="fw-semibold text-dark text-decoration-none ms-1">
								Daftar akun baru
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>