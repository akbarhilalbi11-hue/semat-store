<script>
	import { enhance } from '$app/forms';
	import { ArrowRight } from 'lucide-svelte';

	let { data, form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Daftar Akun Baru — SEMAT</title>
</svelte:head>

<section class="py-4 py-lg-5">
	<div class="container">
		<div class="surface-card overflow-hidden">
			<div class="row g-0 align-items-stretch">
				<!-- Kolom Kiri: Visual Katalog Besar -->
				<div
					class="col-12 col-lg-5 d-flex flex-column justify-content-between p-4 p-lg-5 hairline-bottom"
					style="background-color: var(--bg-subtle);"
				>
					<div>
						<span class="catalog-kicker mb-2">Registrasi Pelanggan</span>
						<h1 class="h2 fw-bold mb-3">Buat akun untuk checkout dan lacak pesanan.</h1>
						<p class="small text-secondary-warm mb-4">
							Simpan beberapa titik pengiriman kantor maupun rumah dan pantau status pengemasan dari satu tempat.
						</p>
					</div>

					<div class="surface-card p-3">
						<img
							src="/products/paket-lanyard-sand.svg"
							alt="Paket Kantor Loka Kulit dan Lanyard Tissue"
							class="w-100 rounded object-fit-cover"
							style="max-height: 280px; background-color: var(--bg-canvas);"
						/>
						<div class="pt-3 d-flex justify-content-between align-items-center small">
							<span class="fw-medium">Paket Kantor Loka + Lanyard Tissue</span>
							<span class="text-secondary-warm">Set Lengkap</span>
						</div>
					</div>
				</div>

				<!-- Kolom Kanan: Form Pendaftaran -->
				<div class="col-12 col-lg-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
					<div style="max-width: 460px; width: 100%; margin: 0 auto;">
						<span class="catalog-kicker d-block mb-1">Formulir Akun Baru</span>
						<h2 class="h3 fw-bold mb-4">Daftar Pelanggan SEMAT</h2>

						{#if form?.error}
							<div
								class="p-3 rounded mb-3 small"
								style="background-color: var(--status-danger-bg); color: var(--status-danger-text);"
								role="alert"
							>
								{form.error}
							</div>
						{/if}

						<form
							method="POST"
							use:enhance={() => {
								submitting = true;
								return async ({ update }) => {
									await update();
									submitting = false;
								};
							}}
						>
							<input type="hidden" name="redirectTo" value={data.redirectTo} />

							<div class="mb-3">
								<label for="regName" class="form-label">Nama Lengkap</label>
								<input
									id="regName"
									name="name"
									type="text"
									class="form-control"
									placeholder="Contoh: Brian Akbar"
									value={form?.name || ''}
									required
								/>
							</div>

							<div class="row g-3 mb-3">
								<div class="col-12 col-sm-6">
									<label for="regEmail" class="form-label">Alamat Email</label>
									<input
										id="regEmail"
										name="email"
										type="email"
										class="form-control"
										placeholder="nama@email.com"
										value={form?.email || ''}
										required
									/>
								</div>
								<div class="col-12 col-sm-6">
									<label for="regWa" class="form-label">Nomor WhatsApp</label>
									<input
										id="regWa"
										name="whatsapp"
										type="tel"
										class="form-control"
										placeholder="0812xxxxxxxx"
										value={form?.whatsapp || ''}
										required
									/>
								</div>
							</div>

							<div class="row g-3 mb-4">
								<div class="col-12 col-sm-6">
									<label for="regPass" class="form-label">Kata Sandi</label>
									<input
										id="regPass"
										name="password"
										type="password"
										class="form-control"
										placeholder="Minimal 6 karakter"
										required
									/>
								</div>
								<div class="col-12 col-sm-6">
									<label for="regPassConfirm" class="form-label">Konfirmasi Sandi</label>
									<input
										id="regPassConfirm"
										name="confirmPassword"
										type="password"
										class="form-control"
										placeholder="Ulangi kata sandi"
										required
									/>
								</div>
							</div>

							<button
								type="submit"
								class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
								disabled={submitting}
							>
								<span>{submitting ? 'Membuat akun...' : 'Daftar & Lanjutkan'}</span>
								<ArrowRight size={16} />
							</button>
						</form>

						<div class="hairline-top mt-4 pt-3 small text-secondary-warm">
							Sudah punya akun?
							<a
								href={data.redirectTo ? `/masuk?redirect=${encodeURIComponent(data.redirectTo)}` : '/masuk'}
								class="fw-semibold text-dark text-decoration-none ms-1"
							>
								Masuk di sini
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>