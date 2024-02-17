import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export const load: PageLoad = () => {
	redirect(302, '/docs/builders/accordion');
};
