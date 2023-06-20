import type { PreviewProps } from '$routes/(components)';
import { Tailwind } from './(tailwind)';
import Example from './example.svelte';

export const drawer = {
	component: Example,
	code: {
		Tailwind,
		CSS: null,
	},
} satisfies PreviewProps;
