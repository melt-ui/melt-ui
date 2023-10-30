import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from '@unocss/svelte-scoped/vite';

export default defineConfig({
	plugins: [
		UnoCSS({
			injectReset: `@unocss/reset/tailwind.css`, // see type definition for all included reset options or how to pass in your own
			// ...other Svelte Scoped options
		}),
		sveltekit(),
	],
	test: {
		include: ['src/**/*.spec.{js,ts}'],
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['./scripts/setupTest.ts'],
		// Exclude files in v8
		coverage: {
			exclude: ['setupTest.ts'],
		},
		alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }],
		deps: {
			inline: ['clsx'],
		},
	},
});
