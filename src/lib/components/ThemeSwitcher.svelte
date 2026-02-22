<script lang="ts">
	import { onMount } from 'svelte';
	import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		// 1. Check LocalStorage OR System Preference on load
		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
		const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

		theme = saved || system;
		applyTheme(theme);
	});

	function applyTheme(newTheme: 'light' | 'dark') {
		// Update HTML attribute for CSS
		document.documentElement.setAttribute('data-theme', newTheme);
		// Save preference
		localStorage.setItem('theme', newTheme);
	}

	function toggle() {
		theme = theme === 'light' ? 'dark' : 'light';
		applyTheme(theme);
	}
</script>

<button onclick={toggle} aria-label="Toggle Dark Mode" class="theme-toggle">
	<div class="icon-container" data-show={theme === 'light'}>
		<Fa icon={faSun} size="lg" />
	</div>
	<div class="icon-container" data-show={theme === 'dark'}>
		<Fa icon={faMoon} size="lg" />
	</div>
</button>

<style>
	.theme-toggle {
		width: 1.2rem;
		height: 1.2rem;
		background: var(--color-surface);
		border: 0px none var(--color-border);
		color: var(--color-text);
		border-radius: var(--radius-base);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: all var(--transition-speed);
	}

	.theme-toggle:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.icon-container {
		position: absolute;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	/* Animation Logic: Rotate and fade based on state */
	[data-show='true'] {
		opacity: 1;
		transform: rotate(0deg) scale(1);
	}

	[data-show='false'] {
		opacity: 0;
		transform: rotate(90deg) scale(0.5);
	}
</style>
