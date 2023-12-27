import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-styling',
		'@storybook/addon-a11y',
		// '@chromaui/addon-visual-tests',
	],
	framework: '@storybook/sveltekit',
	docs: {
		autodocs: 'tag',
	},
};
export default config;
