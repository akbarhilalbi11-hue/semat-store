<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Simulasi Lupa Kata Sandi — SEMAT</title>
</svelte:head>

<section class="py-5">
	<div class="container" style="max-width: 500px;">
		<div class="surface-card p-4 p-md-5">
			<span class="badge mb-2" style="background-color: var(--status-warning-bg); color: var(--status-warning-text);">
				Mode Simulasi Akademik
			</span>
			<h1 class="h3 font-heading fw-bold mb-2">Atur Ulang Kata Sandi</h1>
			<p class="small text-secondary-warm mb-4">
				Karena aplikasi berjalan tanpa layanan email berbayar, Anda dapat mengatur ulang kata sandi akun terdaftar secara langsung di halaman ini.
			</p>

			{#if form?.error}
				<div class="p-3 rounded mb-3 small" style="background-color: var(--status-danger-bg); color: var(--status-danger-text);">
					{form.error}
				</div>
			{/if}

			{#if form?.success}
				<div class="p-3 rounded mb-3 small" style="background-color: var(--status-success-bg); color: var(--status-success-text);">
					{form.message}
					<div class="mt-2">
						<a href="/masuk" class="fw-semibold text-dark">Lanjut ke halaman masuk</a>
					</div>
				</div>
			{/if}

			<form method="POST" use:enhance>
				<div class="mb-3">
					<label for="resetEmail" class="form-label">Email Akun Terdaftar</label>
					<input
						id="resetEmail"
						name="email"
						type="email"
						class="form-control"
						value={form?.email || ''}
						required
					/>
				</div>
				<div class="mb-4">
					<label for="resetPass" class="form-label">Kata Sandi Baru</label>
					<input
						id="resetPass"
						name="newPassword"
						type="password"
						class="form-control"
						placeholder="Minimal 6 karakter"
						required
					/>
				</div>
				<button type="submit" class="btn btn-primary w-100">Simpan Kata Sandi Baru</button>
			</form>
		</div>
	</div>
</section>