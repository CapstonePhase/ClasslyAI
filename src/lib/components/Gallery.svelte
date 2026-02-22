<script lang="ts">
	import { onMount } from 'svelte';

	// Svelte 5 Props
	let { preset = 'default' }: { preset?: string } = $props();

	let media: string[] = $state([]);
	let loading = $state(true);

	onMount(() => {
		// 1. GLOB IMPORT: specific pattern for Vite
		// This looks for images in src/lib/assets/
		const modules = import.meta.glob('$lib/assets/*.{jpg,jpeg,png,webp,gif}', {
			eager: true,
			query: '?url',
			import: 'default'
		}) as Record<string, string | { default: string }>;
		console.log('Gallery Found Modules:', modules); // Check your console!

		// No specific type needed here anymore; TypeScript infers it correctly!
		media = Object.values(modules).map((mod) => {
			return typeof mod === 'object' && mod !== null ? mod.default : mod;
		});
		loading = false;
	});
</script>

<div class="gallery-wrapper">
	{#if loading}
		<div class="empty-state">Loading gallery...</div>
	{:else if media.length > 0}
		<div class="gallery" data-preset={preset}>
			{#each media as src, i (src)}
				{#if typeof src === 'string'}
					<div class="item">
						<img {src} alt="Gallery item {i}" loading="lazy" />
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<div class="debug-info">
				<p><strong>0 images found.</strong></p>
				<small>Ensure images are located in: <code>src/lib/assets/</code></small>
				<br />
				<small>(Current path searched: <code>$lib/assets/</code>)</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.gallery-wrapper {
		width: 100%;
		height: 100%;
		min-height: 400px; /* Prevents collapse */
		display: flex;
		flex-direction: column;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		grid-auto-rows: 150px;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
		overflow-y: auto; /* Internal scrolling */
	}

	.item {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius);
		background: none;
		border: 1px solid var(--text-muted);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--speed) ease;
		display: block;
		/* Removes bottom spacing */
	}

	img:hover {
		transform: scale(1.05);
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		background: var(--bg-front);
		border: 2px dashed var(--text-muted);
		border-radius: var(--radius);
		color: var(--text-muted);
		text-align: center;
		padding: 2rem;
	}

	.debug-info code {
		background: rgba(0, 0, 0, 0.1);
		padding: 2px 4px;
		border-radius: 4px;
	}
</style>
