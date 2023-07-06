import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDocData, getMainPreviewComponent, getPreviewSnippets } from '$docs/utils';
import { data, isBuilderName } from '$docs/data/builders';

export const load: PageLoad = async (event) => {
	if (!isBuilderName(event.params.name)) {
		throw error(404);
	}

	return {
		doc: getDocData(event.params.name),
		mainPreview: getMainPreviewComponent(event.params.name),
		snippets: getPreviewSnippets(event.params.name),
		builderData: data[event.params.name],
	};
};
