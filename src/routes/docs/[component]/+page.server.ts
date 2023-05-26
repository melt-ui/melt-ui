import { getPropsObj } from '$lib/internal/helpers/preview.js';
import { schemas } from '$routes/(previews)/schemas';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const cmp = params.component;
	if (!(cmp in schemas)) {
		throw error(404, 'Component not found');
	}

	const cmpSchema = schemas[cmp as keyof typeof schemas];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const props = getPropsObj<{}>(cmpSchema.meta) as any;

	return {
		cmp,
		props,
	};
}
