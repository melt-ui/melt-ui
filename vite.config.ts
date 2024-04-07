import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { pagefind } from 'vite-plugin-pagefind';

export default defineConfig({
	plugins: [
		sveltekit(),
		pagefind({ publicDir: 'static', buildDir: 'build', buildScript: 'deploy' }),
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
		retry: 5,
		allowOnly: !process.env.CI,
	},
});
