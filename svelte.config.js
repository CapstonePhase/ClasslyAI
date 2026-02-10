import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'default-src': ['self'],
				'script-src': [
					'self',
					'unsafe-inline',
					'https://www.youtube.com',
					'https://s.ytimg.com',
					'https://*.ytimg.com'
				],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': [
					'self',
					'data:',
					'https://www.youtube.com',
					'https://i.ytimg.com',
					'https://*.ytimg.com',
					'https://*.googleusercontent.com'
				],
				'frame-src': ['https://www.youtube-nocookie.com', 'https://www.youtube.com'],
				'connect-src': [
					'self',
					'https://www.youtube.com',
					'https://googleads.g.doubleclick.net',
					'https://*.google.com'
				],
				'font-src': ['self', 'data:'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['self'],
				'upgrade-insecure-requests': true
			}
		}
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;
