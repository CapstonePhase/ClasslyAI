<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let {
		open = $bindable(false),
		ariaLabel = undefined,
		className = '',
		summary = undefined,
		content = undefined,
		toggle = undefined,
		select = undefined
	}: {
		open?: boolean;
		ariaLabel?: string;
		className?: string;
		summary?: Snippet;
		content?: Snippet<[{ handleItemClick?: (d: any) => void }]>;
		toggle?: (payload: { open: boolean }) => void;
		select?: (detail: any) => void;
	} = $props();

	let rootEl: HTMLElement | null = null;

	function toggleOpen(e?: Event) {
		if (e) e.preventDefault();
		open = !open;
		// preferred: callback prop
		toggle?.({ open });
		// legacy: emit DOM CustomEvent for backwards compatibility
		if (rootEl) rootEl.dispatchEvent(new CustomEvent('toggle', { detail: { open } }));
	}

	function handleItemClick(detail?: any) {
		select?.(detail);
		if (rootEl) rootEl.dispatchEvent(new CustomEvent('select', { detail }));
		open = false;
	}

	// close on Escape
	onMount(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				open = false;
				emitToggleEvent();
			}
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	function emitToggleEvent() {
		toggle?.({ open });
		if (rootEl) rootEl.dispatchEvent(new CustomEvent('toggle', { detail: { open } }));
	}
</script>

<div class={`menudropdown ${className}`} bind:this={rootEl}>
	<button
		class="btn btn-ghost trigger"
		onclick={toggleOpen}
		aria-expanded={open}
		aria-label={ariaLabel}
	>
		{#if summary}{@render summary()}{/if}
		<svg
			width="10"
			height="10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="chev"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	</button>

	{#if open}
		<div class="dropdown-panel" role="menu">
			{#if content}{@render content({ handleItemClick })}{/if}
		</div>
	{/if}
</div>

<style>
	/* Minimal local styles; visual layout and colors are defined globally in app.css */
</style>
