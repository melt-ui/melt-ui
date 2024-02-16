import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.svelte', '../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-styling',
		'@storybook/addon-a11y',
	],
	framework: '@storybook/sveltekit',
	docs: {
		autodocs: 'tag',
	},
};
export default config;
