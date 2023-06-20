import type { PreviewProps } from '$routes/(components)';
import Index from './code.svelte?raw';
import TwConfig from './tailwind.config.ts?raw';

export const Tailwind: PreviewProps['code'][string] = {
	'index.svelte': Index,
	'tailwind.config.ts': TwConfig,
};
