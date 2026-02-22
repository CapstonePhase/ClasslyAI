<script lang="ts">
	import Fa, { type IconSize } from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	// Define standard FA sizes for validation
	const FA_SIZES = ['xs', 'sm', 'lg', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'];

	let {
		icon,
		size = '1em',
		preset = 'default',
		color,
		class: className = '',
		...rest // Captures title, aria-label, onclick, etc.
	}: {
		icon: IconDefinition;
		size?: IconSize | string;
		preset?: 'default' | 'primary' | 'muted' | 'accent';
		color?: string;
		class?: string;
		[key: string]: any;
	} = $props();

	// If the size is a valid FontAwesome string, we pass it to the component.
	// Otherwise, we treat it as a CSS value (px, rem, em).
	const isFaSize = $derived(typeof size === 'string' && FA_SIZES.includes(size));
</script>

<span
	class="icon-wrapper {className}"
	data-preset={preset}
	style:--icon-size={isFaSize ? 'auto' : size}
	style:--icon-color={color}
	{...rest}
>
	<Fa {icon} size={isFaSize ? (size as IconSize) : undefined} color={color || 'currentColor'} />
</span>

<style>
	.icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		/* Use app tokens for dimensions if not a standard FA size */
		width: var(--icon-size);
		height: var(--icon-size);

		/* Timing and easing from your app tokens */
		transition:
			color var(--speed, 0.2s) ease,
			transform var(--speed, 0.2s) ease;
	}

	/* Preset mappings using your app.css tokens */
	.icon-wrapper[data-preset='primary'] {
		color: var(--text);
	}

	.icon-wrapper[data-preset='muted'] {
		color: var(--text-muted);
	}

	.icon-wrapper[data-preset='accent'] {
		color: var(--text-accent);
	}

	/* Optional: Interaction pattern matching your Card hover */
	.icon-wrapper:hover {
		filter: brightness(1.1);
	}
</style>
