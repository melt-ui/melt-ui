import { json } from '@sveltejs/kit';
import { extractTailwindStyles } from '../../../utils/tw-to-css/style-extractor';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async (event: RequestEvent) => {
	const body = await event.request.text();
	const exampleComponent = await extractTailwindStyles(body);

	return json({ raw: exampleComponent });
};
