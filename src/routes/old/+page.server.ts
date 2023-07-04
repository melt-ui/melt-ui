import { redirect } from '@sveltejs/kit';

export async function load() {
	throw redirect(303, '/docs/overview/introduction');
}
