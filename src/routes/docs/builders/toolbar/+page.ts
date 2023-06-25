import type { PreviewProps } from '$routes/(components)';
import { Tailwind, CSS, Preview } from './(examples)/(preview)';

export async function load() {
	return {
		preview: {
			component: Preview,
			code: {
				Tailwind,
				CSS,
			},
		} satisfies PreviewProps,
	};
}
