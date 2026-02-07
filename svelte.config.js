import { mdsvex } from 'mdsvex';
import vercelAdapter from '@sveltejs/adapter-vercel';
import staticAdapter from '@sveltejs/adapter-static';

// Use the static adapter on Windows by default to avoid symlink permission errors
// when building locally (Vercel adapter will still be used in non-Windows environments).
const useStatic = process.platform === 'win32' || process.env.USE_STATIC_ADAPTER === '1';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: useStatic ? staticAdapter({ strict: false }) : vercelAdapter() },
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;
