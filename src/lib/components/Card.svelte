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
		background:
			linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
			var(--border-card) border-box;
		border: 1px solid transparent;
		border-radius: var(--radius);
		box-shadow: var(--card-shadow);
		transition:
			box-shadow var(--transition-speed),
			transform var(--transition-speed);
		flex: 1;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	article:hover {
		background:
			linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
			var(--border-card-hover) border-box;
		box-shadow: var(--card-shadow-hover);
		transform: translateY(-2px);
	}

	h3 {
		margin: 0;
		padding: var(--gap) var(--gap) 0.5rem;
		font-weight: 600;
		color: var(--card-foreground);
		border-bottom: 1px solid var(--border);
	}

	div {
		padding: var(--gap);
		color: var(--card-foreground);
		flex: 1;
	}
</style>
