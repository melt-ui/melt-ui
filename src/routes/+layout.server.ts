import { getStoredHighlighter } from '$docs/highlighter.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async () => {
	// initialize the highlighter
	await getStoredHighlighter();
};
