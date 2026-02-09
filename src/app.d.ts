import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
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

declare module '*.png' {
	const value: string;
	export default value;
}

declare module '*.jpg' {
	const value: string;
	export default value;
}

declare module '*.jpeg' {
	const value: string;
	export default value;
}

declare module '*.svg' {
	const value: string;
	export default value;
}

declare module '*.gif' {
	const value: string;
	export default value;
}

export {};
