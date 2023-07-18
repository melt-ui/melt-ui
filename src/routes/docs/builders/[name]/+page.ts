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
	console.log(`\nLoading ${event.params.name}...`);
	const promises = {
		doc: () => getDocData(event.params.name),
		mainPreview: () => getMainPreviewComponent(event.params.name),
		snippets: () => getAllPreviewSnippets(event.params.name),
		previews: () => getAllPreviewComponents(event.params.name),
		builderData: () => getBuilderData(event.params.name),
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
