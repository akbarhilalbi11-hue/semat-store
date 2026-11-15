<script>
	import { X } from 'lucide-svelte';
	import { shopUI } from '#lib/stores/shop-ui.svelte.js';
</script>

{#if shopUI.toasts.length > 0}
	<div
		class="position-fixed top-0 end-0 p-3 d-flex flex-column gap-2"
		style="z-index: 1080; max-width: 360px; margin-top: 64px;"
	>
		{#each shopUI.toasts as toast (toast.id)}
			<div
				class="surface-card p-3 d-flex align-items-start justify-content-between gap-2 small"
				style="box-shadow: var(--shadow-overlay); border-left: 3px solid {toast.type === 'warning'
					? '#8a6424'
					: '#8a7f6a'};"
				role="status"
			>
				<span>{toast.message}</span>
				<button
					type="button"
					class="btn btn-sm p-0 text-secondary-warm"
					aria-label="Tutup notifikasi"
					onclick={() => shopUI.dismissToast(toast.id)}
				>
					<X size={15} />
				</button>
			</div>
		{/each}
	</div>
{/if}