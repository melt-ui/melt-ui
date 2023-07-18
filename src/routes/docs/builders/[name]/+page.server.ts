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

	const promises = {
		snippets: () => getAllPreviewSnippets({ slug: params.name, fetcher: fetch }),
		builderData: () => getBuilderData({ slug: params.name, fetcher: fetch }),
	};

	const stuff = await timedPromiseAll(promises);
	return {
		...stuff,
	};
};

// Given an object of promises, return a promise that resolves to an object of resolved values.
// Time each promise and log the results.
const timedPromiseAll = async (promises: Record<string, () => Promise<any>>) => {
	const start = performance.now();
	const wrappedPromises = Object.entries(promises).map(([key, promise]) => {
		return promise().then((value) => {
			console.log(`${key}: ${performance.now() - start}ms`);
			return [key, value];
		});
	});
	const res = Object.fromEntries(await Promise.all(wrappedPromises));

	return res;
};
