import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = 'auto';

export const load: PageLoad = async () => {
	throw redirect(302, '/docs/introduction');
};
