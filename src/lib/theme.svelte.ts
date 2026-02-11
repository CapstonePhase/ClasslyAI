// src/lib/theme.svelte.ts

// We create a class to hold our reactive state
class Color {
	// $state is a Svelte 5 rune for reactivity
	current = $state<Theme>('light');

	constructor() {
		// Only run on the client
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('theme') as Theme;
			if (saved) {
				this.setTheme(saved);
			}
		}
	}

	setTheme(theme: Theme) {
		this.current = theme;
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
			document.documentElement.dataset.theme = theme;
		}
	}
}

// THIS IS THE KEY: Exporting an instance of the class
export const theme = new Color();
