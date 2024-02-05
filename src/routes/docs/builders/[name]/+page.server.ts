import { builderMap, isBuilderName } from '$docs/data/builders/index.js';
import { getStoredHighlighter } from '$docs/highlighter.js';
import { getAllPreviewSnippets, getBuilderData } from '$docs/utils/index.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types.js';

export const entries = (() => {
	return Object.keys(builderMap).map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const load = async ({ params, fetch }) => {
	if (!isBuilderName(params.name)) {
		error(404);
	}

	// Init the highlighter
	await getStoredHighlighter(fetch);

	return {
		snippets: await getAllPreviewSnippets({ slug: params.name, fetcher: fetch }),
		builderData: await getBuilderData({ slug: params.name, fetcher: fetch }),
	};
};
