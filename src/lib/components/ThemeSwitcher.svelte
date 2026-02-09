<script lang="ts">
	let theme = $state<'light' | 'dark'>('light');

	// On mount: read saved preference or system preference
	$effect(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || stored === 'light') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}

		// Return a cleanup that does nothing — ensures effect only runs on mount).
		return () => {};
	});

	// Sync DOM + storage whenever theme changes
	$effect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		localStorage.setItem('theme', theme);
	});

	function toggleTheme(): void {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<button
	class="theme-toggle"
	aria-pressed={theme === 'dark'}
	aria-label="Toggle color theme"
	onclick={toggleTheme}
>
	{theme === 'dark' ? '🌙' : '☀️'}
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
