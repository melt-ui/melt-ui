import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
	],
	test: {
		include: ['src/**/*.spec.{js,ts}'],
	},
});
