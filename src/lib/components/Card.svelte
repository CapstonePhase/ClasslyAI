<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, content }: { title: string; content: Snippet } = $props();
</script>

<article>
	{#if title}<h3>{title}</h3>{/if}

	<div>
		{@render content()}
	</div>
</article>

<style>
	article {
		background: var(--border-card);
		border-radius: var(--radius);
		padding: 1px;
		box-shadow: var(--card-shadow);
		transition:
			box-shadow var(--transition-speed),
			transform var(--transition-speed);
		flex: 1;
		min-width: 200px;
	}
	article:hover {
		background: var(--border-card-hover);
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-2px);
	}

	h3 {
		margin: 0;
		padding: var(--gap) var(--gap) 0.5rem;
		font-weight: 600;
		color: var(--card-foreground);
		background: var(--card-bg);
		border-radius: 11px 11px 0 0;
	}

	div {
		background: var(--card-bg);
		padding: var(--gap);
		color: var(--card-foreground);
		border-radius: 0 0 11px 11px;
	}

	article:not(:has(h3)) div {
		border-radius: 11px;
	}
</style>
