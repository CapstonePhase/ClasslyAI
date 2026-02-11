import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	type Theme = 'light' | 'dark' | 'forest';

	namespace App {
		interface Link {
			name: string;
			path: '/' | '/dashboard' | '/quizzes' | '/about';
			icon?: IconDefinition;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
