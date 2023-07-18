import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import {
	getDocData,
	getMainPreviewComponent,
	getAllPreviewSnippets,
	getAllPreviewComponents,
	getBuilderData,
} from '$docs/utils';
import { builderList, isBuilderName } from '$docs/data/builders';
import { getStoredHighlighter } from '$docs/highlighter';

export const entries = (() => {
	return builderList.map((item) => {
		return { name: item.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const load = async ({ params, fetch }) => {
	if (!isBuilderName(params.name)) {
		throw error(404);
	}
	console.log(`\nLoading ${params.name}...`);

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

	// return {
	// 	doc: getDocData(params.name),
	// 	mainPreview: getMainPreviewComponent(params.name),
	// 	snippets: getAllPreviewSnippets({slug: params.name, fetcher: fetch}),
	// 	previews: getAllPreviewComponents(params.name),
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	builderData: getBuilderData({slug: params.name as any, fetcher: fetch}),
	// };
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
