import { error } from '@sveltejs/kit';
import schemas from '$routes/(previews)/schemas';

export const load = async ({ params }) => {
	const cmp = params.component;
	if (cmp in schemas) {
		return {
			schema: schemas[cmp as keyof typeof schemas]
		};
	}

	throw error(404, 'Component not found');
};
