import { builderList, isBuilderName } from '$docs/data/builders';
import { getStoredHighlighter } from '$docs/highlighter';
import { getAllPreviewSnippets, getBuilderData } from '$docs/utils';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

export const entries = (() => {
	return builderList.map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const load = async ({ params, fetch }) => {
	if (!isBuilderName(params.name)) {
		throw error(404);
	}

	// Init the highlighter
	await getStoredHighlighter(fetch);

	return {
		snippets: getAllPreviewSnippets({ slug: params.name, fetcher: fetch }),
		builderData: getBuilderData({ slug: params.name, fetcher: fetch }),
	};
};
