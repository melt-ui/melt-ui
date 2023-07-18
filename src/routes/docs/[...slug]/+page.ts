import type { EntryGenerator, PageLoad } from './$types';
import { getDoc } from '$docs/utils';
import { navConfig } from '$docs/config';

export const entries = (() => {
	return navConfig.sidebarNav[0].items.map((item) => {
		return { slug: item.title.toLowerCase().replaceAll(' ', '-') };
	});
}) satisfies EntryGenerator;

export const load: PageLoad = async (event) => {
	const doc = await getDoc(event.params.slug);

	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title,
	};
};
