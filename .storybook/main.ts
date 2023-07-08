import type { Plugin, InlineConfig } from 'vite';
import type { StorybookConfig } from '@storybook/sveltekit';

const workaroundSvelteDocgenPluginConflictWithUnpluginIcons = (config: InlineConfig) => {
	if (!config.plugins) return config;

	const [_internalPlugins, ...userPlugins] = config.plugins as Plugin[];
	const docgenPlugin = userPlugins.find(
		(plugin) => plugin.name === 'storybook:svelte-docgen-plugin'
	);
	if (docgenPlugin) {
		const origTransform = docgenPlugin.transform;
		const newTransform: typeof origTransform = (code, id, options) => {
			if (id.startsWith('~icons/')) {
				return;
			}
			return (origTransform as Function)?.call(docgenPlugin, code, id, options);
		};
		docgenPlugin.transform = newTransform;
		docgenPlugin.enforce = 'post';
	}
	return config;
};

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		{
			name: '@storybook/addon-styling',
			options: {
				// Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
				// For more details on this addon's options.
				postCss: true,
			},
		},
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
};
export default config;
