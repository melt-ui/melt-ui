import { schemas } from '$routes/(previews)/schemas';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const cmp = params.component;
	if (!(cmp in schemas)) {
		throw error(404, 'Component not found');
	}

	return {
		cmp,
	};
}
