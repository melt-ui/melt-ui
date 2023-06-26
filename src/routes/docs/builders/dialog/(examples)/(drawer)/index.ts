import type { PreviewProps } from '$routes/(components)';
import tw from './tailwind.ignore-svelte?raw';
import TwConfig from '$routes/(other)/tailwind.config.ts?raw';
import Drawer from './drawer.svelte';

const Tailwind: PreviewProps['code']['Tailwind'] = {
	'index.svelte': tw,
	'tailwind.config.ts': TwConfig,
};

const CSS: PreviewProps['code']['CSS'] = null;

export const drawer = {
	component: Drawer,
	code: {
		Tailwind,
		CSS,
	},
};
