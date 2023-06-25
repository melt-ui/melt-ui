import type { PreviewProps } from '$routes/(components)';
import tw from './tailwind.ignore.svelte?raw';
import css from './css.ignore.svelte?raw';
import TwConfig from '$routes/(other)/tailwind.config.ts?raw';
import GlobalReset from '$routes/(other)/globals.css?raw';

export { default as Preview } from './preview.svelte';
export const Tailwind: PreviewProps['code']['Tailwind'] = {
	'index.svelte': tw,
	'tailwind.config.ts': TwConfig,
};

export const CSS: PreviewProps['code']['CSS'] = {
	'index.svelte': css,
	'globals.css': GlobalReset,
};
