<script lang="ts">
	/**
	 * Dropdown
	 * Props (via $props):
	 *  - value: string (current value)
	 *  - options: (string | number | { value: string; label: string })[]
	 *  - label?: string (visible label)
	 *  - ariaLabel?: string (for accessibility)
	 *  - disabled?: boolean
	 *  - className?: string
	 *  - change?: (value: string) => void (callback prop; preferred - Svelte 5)
	 *
	 * Note: `createEventDispatcher` is deprecated in Svelte 5. This component prefers a `change` callback prop
	 * and also emits a legacy DOM 'change' CustomEvent on the root element for backward compatibility.
	 */

	let {
		value = '',
		options = [],
		label = undefined,
		ariaLabel = undefined,
		disabled = false,
		className = '',
		change = undefined
	}: {
		value?: string;
		options?: Array<string | number | { value: string; label: string }>;
		label?: string;
		ariaLabel?: string;
		disabled?: boolean;
		className?: string;
		change?: (value: string) => void;
	} = $props();

	// associate label with the control for accessibility
	let id = `dropdown-${Math.random().toString(36).slice(2)}`;

	let rootEl: HTMLElement | null = null;

	function handleChange(e: Event) {
		const newVal = (e.target as HTMLSelectElement).value;
		// update local value and notify parent (preferred: callback prop)
		value = newVal;
		change?.(newVal);

		// legacy: emit DOM CustomEvent on root element for compatibility with `<Dropdown on:change={...}>`
		if (rootEl) {
			rootEl.dispatchEvent(new CustomEvent('change', { detail: newVal }));
		}
	}
</script>

<div class={`dropdown ${className}`} bind:this={rootEl}>
	{#if label}
		<label class="dropdown-label" for={id}>{label}</label>
	{/if}

	<select
		{id}
		class="select dropdown-select"
		{disabled}
		{value}
		aria-label={ariaLabel}
		onchange={handleChange}
	>
		{#each options as opt (String(opt))}
			{#if typeof opt === 'object'}
				<option value={opt.value}>{opt.label}</option>
			{:else}
				<option value={String(opt)}>{opt}</option>
			{/if}
		{/each}
	</select>
</div>

<style>
	/* Layout and sizing are local to the component */
	.dropdown {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dropdown-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		/* keep label visually connected to control */
	}

	.dropdown-select {
		min-width: 88px;
		/* height is driven by global menubar control height when used there */
	}

	/* Ensure select fills available space when used in flexible layouts */
	@media (max-width: 640px) {
		.dropdown {
			width: 100%;
		}
		.dropdown-select {
			width: 100%;
		}
	}
</style>
