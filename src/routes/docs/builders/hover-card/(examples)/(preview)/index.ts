import type { PreviewProps } from '$routes/(components)';
import Preview from './tailwind.svelte';
import tw from './tailwind.svelte?raw';
import TwConfig from '$routes/(configs)/tailwind.config.ts?raw';

const Tailwind: PreviewProps['code']['Tailwind'] = {
	'index.svelte': tw,
	'tailwind.config.ts': TwConfig,
};

const CSS: PreviewProps['code']['CSS'] = null;

export const preview = {
	component: Preview,
	code: {
		Tailwind,
		CSS,
	},
} satisfies PreviewProps;
