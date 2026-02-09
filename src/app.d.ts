import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Link {
			name: string;
			path: string;
			icon?: IconDefinition;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
