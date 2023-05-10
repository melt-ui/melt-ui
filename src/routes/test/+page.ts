import { isDevelopment } from '$constants';
import { error } from '@sveltejs/kit';

export async function load() {
	if (!isDevelopment) throw error(404);
}
