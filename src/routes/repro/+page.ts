import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async () => {
	redirect(303, 'https://stackblitz.com/github/melt-ui/playground');
};
