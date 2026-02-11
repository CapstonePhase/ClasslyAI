<script lang="ts">
	import { theme } from '$lib/theme.svelte';
</script>

<nav id="theme-controls">
	<button
		id="btn-light"
		onclick={() => theme.setTheme('light')}
		aria-pressed={theme.current === 'light'}
	>
		Light
	</button>
	<button
		id="btn-dark"
		onclick={() => theme.setTheme('dark')}
		aria-pressed={theme.current === 'dark'}
	>
		Dark
	</button>
	<button
		id="btn-forest"
		onclick={() => theme.setTheme('forest')}
		aria-pressed={theme.current === 'forest'}
	>
		Forest
	</button>
</nav>

<style>
	#theme-controls {
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	button[aria-pressed='true'] {
		background-color: var(--color-accent);
		color: white;
		border-color: var(--color-accent);
	}
</style>
