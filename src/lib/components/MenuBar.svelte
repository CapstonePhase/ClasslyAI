<script lang="ts">
	// Svelte 5: use runes and snippets. Accept snippet props instead of slots.
	let {
		class: classAttr,
		className: classNameProp = '',
		role = 'toolbar',
		ariaLabel = '',
		ariaLabelledby = '',
		enhance = undefined,
		method = 'GET',
		action = '',
		children = undefined,
		actions = undefined,
		legend = undefined
	} = $props();

	let classes = $derived(
		[classAttr, classNameProp, 'menubar', 'toolbar'].filter(Boolean).join(' ')
	);
</script>

<form
	class={classes}
	{role}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
	{method}
	{action}
	use:enhance={enhance}
>
	{#if ariaLabelledby}
		<div id={ariaLabelledby} class="menubar-legend">{@render legend?.()}</div>
	{/if}

	<div class="content">
		{@render children?.()}
	</div>
	<div class="actions">
		{@render actions?.()}
	</div>
</form>

<style>
	.menubar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.menubar .content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.menubar .actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto; /* keep actions pinned to the far right */
	}

	.menubar-legend {
		/* Visually hidden by default; user can style via slot if desired */
		position: absolute !important;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 640px) {
		.menubar {
			flex-wrap: wrap;
		}
		.menubar .actions {
			order: 2;
			margin-left: 0;
		}
	}
</style>
