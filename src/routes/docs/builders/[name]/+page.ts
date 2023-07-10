import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import {
	getDocData,
	getMainPreviewComponent,
	getAllPreviewSnippets,
	getAllPreviewComponents,
} from '$docs/utils';
import { builderList, data, isBuilderName } from '$docs/data/builders';

export const entries = (() => {
	return builderList.map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const prerender = 'auto';

export const load: PageLoad = async (event) => {
	if (!isBuilderName(event.params.name)) {
		throw error(404);
	}

	return {
		doc: getDocData(event.params.name),
		mainPreview: getMainPreviewComponent(event.params.name),
		snippets: getAllPreviewSnippets(event.params.name),
		previews: getAllPreviewComponents(event.params.name),
		builderData: data[event.params.name],
	};
};
