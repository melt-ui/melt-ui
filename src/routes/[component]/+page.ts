import { allSchemas } from '$routes/(previews)/schemas';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const cmp = params.component;
	if (cmp in allSchemas) {
		return {
			schema: allSchemas[cmp as keyof typeof allSchemas],
		};
	}

	throw error(404, 'Component not found');
};
