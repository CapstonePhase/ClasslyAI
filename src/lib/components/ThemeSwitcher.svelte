<script lang="ts">
	import { browser } from '$app/environment';
	import { untrack } from 'svelte';

	type Theme = 'light' | 'dark' | 'solar';

	const THEMES: Theme[] = ['light', 'dark', 'solar'];
	const THEME_ICONS: Record<Theme, string> = {
		light: '☀️',
		dark: '🌙',
		solar: '🌤️'
	};

	let theme = $state<Theme>(getTheme());

	/** Determine initial theme from localStorage / system preference (SSR-safe). */
	function getTheme(): Theme {
		if (!browser) return 'light';
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || stored === 'light' || stored === 'solar') return stored;
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
		return 'light';
	}

	// Sync DOM class + localStorage whenever theme changes (browser-only)
	$effect(() => {
		if (!browser) return;

		const current = theme; // track `theme`

		untrack(() => {
			const root = document.documentElement;
			root.classList.remove('dark', 'solar');
			if (current !== 'light') {
				root.classList.add(current);
			}
			localStorage.setItem('theme', current);
		});
	});

	function toggleTheme(): void {
		const i = THEMES.indexOf(theme);
		theme = THEMES[(i + 1) % THEMES.length];
	}
</script>

<button class="theme-toggle" aria-label="Toggle color theme ({theme})" onclick={toggleTheme}>
	{THEME_ICONS[theme]}
</button>

<style>
	.theme-toggle {
		font: inherit;
		background: none;
		border: none;
		cursor: pointer;
		margin-left: auto;
		padding: 0;
		font-size: 1.1rem;
		line-height: 1;
	}
</style>
