<script lang="ts">
	let { children, preset = 'default' } = $props();
</script>

<div class="card" data-preset={preset}>
	{@render children()}
</div>

<style>
	.card {
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-text);
		padding: 1rem;
		border-radius: var(--radius-base);
		box-shadow: var(--shadow-card);
		transition:
			box-shadow var(--transition-speed),
			transform var(--transition-speed);
	}

	.card:hover {
		box-shadow: var(--shadow-card-hover);
		transform: translateY(-2px);
	}

	/* Preset variations */
	.card[data-preset='compact'] {
		padding: 0.5rem;
		font-size: 0.9rem;
	}

	.card[data-preset='featured'] {
		border-color: var(--color-accent);
		padding: 2rem;
		box-shadow: var(--shadow-card-hover);
	}
	.card[data-preset='media'] {
		border: none;
		padding: none;
		background: transparent;
		box-shadow: none;
		overflow: hidden;
	}

	.card[data-preset='background'] {
		padding: 0;
		min-height: 180px;
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
		overflow: hidden;
	}

	.card[data-preset='todo'] {
		display: flex;
		flex-direction: column;
		/* allow the card to stretch to the available space and let internal content scroll */
		min-height: 0;
		flex: 1 1 auto;
		overflow: hidden;
	}

	@keyframes cardEntrance {
		from {
			opacity: 0;
			transform: scale(0.3);
			filter: hue-rotate(180deg);
		}
		to {
			opacity: 1;
			transform: scale(1);
			filter: hue-rotate(0deg);
		}
	}
</style>
