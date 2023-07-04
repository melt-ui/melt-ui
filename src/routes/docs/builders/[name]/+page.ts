import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { DocResolver } from '$docs/types';
import { createPreviewsObject, previewPathMatcher, slugFromPath } from '$docs/utils';

export const load: PageLoad = async (event) => {
	const modules = import.meta.glob('/src/docs/content/builders/**/*.md');

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		const strippedPath = slugFromPath(path).split('/')[1];
		if (strippedPath === event.params.name) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		throw error(404);
	}

	const previewsCode = import.meta.glob(`/src/docs/previews/**/*.svelte`, {
		as: 'raw',
		eager: true,
	});

	const previewCodeMatches: { path: string; content: string }[] = [];

	for (const [path, resolver] of Object.entries(previewsCode)) {
		const isMatch = previewPathMatcher(path, event.params.name);
		if (isMatch) {
			const prev = { path, content: resolver };
			previewCodeMatches.push(prev);
		}
	}

	const previews = createPreviewsObject(event.params.name, previewCodeMatches);

	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title,
		previews,
	};
};
