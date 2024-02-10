import { navConfig } from '$docs/config.js';
import type { EntryGenerator, PageLoad } from './$types.js';
import fs from 'fs';

import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

export const entries = (() => {
	return navConfig.sidebarNav[0].items.map((item) => {
		return { slug: item.title.toLowerCase().replaceAll(' ', '-') };
	});
}) satisfies EntryGenerator;



