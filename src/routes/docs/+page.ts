import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
	throw redirect(302, '/docs/introduction');
};
