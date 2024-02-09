import { builderMap, isBuilderName } from '$docs/data/builders/index.js';
import { getAllPreviewComponents, getDocData, getMainPreviewComponent } from '$docs/utils/index.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types.js';

export const entries = (() => {
	return Object.keys(builderMap).map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const load = async ({ params, data }) => {
	if (!isBuilderName(params.name)) {
		error(404);
	}

	return {
		...data,
		mainPreview: await getMainPreviewComponent(params.name),
		doc: await getDocData(params.name),
		previews: await getAllPreviewComponents(params.name),
	};
};
