import { navConfig } from '$docs/config.js';
import type { EntryGenerator } from './$types.js';

export const entries = (() => {
	return navConfig.sidebarNav[0].items.map((item) => {
		return { slug: item.title.toLowerCase().replaceAll(' ', '-') };
	});
}) satisfies EntryGenerator;
