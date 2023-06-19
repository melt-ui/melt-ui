import type { PreviewProps } from '$routes/(components)';
import Index from './code.svelte?raw';

export const CSS: PreviewProps['code'][string] = {
	'index.svelte': Index,
};
