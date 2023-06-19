import type { PreviewProps } from '$routes/(components)';
import { getImporters } from '../../../helpers';
import Example from './example.svelte';

export async function load() {
	const { getCode } = getImporters(import.meta.url);

	return {
		preview: {
			component: Example,
			code: {
				Tailwind: {
					'index.svelte': await getCode('./(tailwind)/code.svelte'),
					'tailwind.config.ts': await getCode('./(tailwind)/tailwind.config.ts'),
				},
				CSS: {
					'index.svelte': await getCode('./(css)/code.svelte'),
				},
			},
		} satisfies PreviewProps,
	};
}
