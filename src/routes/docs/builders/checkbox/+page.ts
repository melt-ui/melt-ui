import type { PreviewProps } from '$routes/(components)';
import { Tailwind } from './(tailwind)';
import exampleString from './(tailwind)/code.svelte?raw';

import Example from './example.svelte';

export async function load({ fetch }) {
	const res = await fetch('/api/styles', {
		method: 'POST',
		body: exampleString,
	});
	const { raw } = await res.json();

	return {
		preview: {
			component: Example,
			code: {
				Tailwind,
				CSS: {
					'index.svelte': raw,
				},
			},
		} satisfies PreviewProps,
	};
}
