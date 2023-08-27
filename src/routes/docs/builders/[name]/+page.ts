import { builderList, isBuilderName } from '$docs/data/builders/index.js';
import { getAllPreviewComponents, getDocData, getMainPreviewComponent } from '$docs/utils/index.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types.js';

export const entries = (() => {
	return builderList.map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const load = async ({ params, data }) => {
	if (!isBuilderName(params.name)) {
		throw error(404);
	}

	return {
		...data,
		mainPreview: getMainPreviewComponent(params.name),
		doc: getDocData(params.name),
		previews: getAllPreviewComponents(params.name),
	};
};
