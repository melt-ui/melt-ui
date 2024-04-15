import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async () => {
	redirect(303, 'https://discord.gg/cee8gHrznd');
};
