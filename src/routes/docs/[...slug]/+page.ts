import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import type { DocResolver } from '$docs/types';
import { slugFromPath } from '$docs/utils';
import { navConfig } from '$docs/config';

export const entries = (() => {
	return navConfig.sidebarNav[0].items.map((item) => {
		return { slug: item.title.toLowerCase() };
	});
}) satisfies EntryGenerator;

export const prerender = true;

export const load: PageLoad = async (event) => {
	const modules = import.meta.glob('/src/docs/content/**/*.md');

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === event.params.slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		throw error(404);
	}
	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title,
	};
};
