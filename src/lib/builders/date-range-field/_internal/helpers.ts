import { isBrowser } from '$lib/internal/helpers/index.js';

export function removeDescriptionElement(id: string) {
	if (!isBrowser) return;
	const el = document.getElementById(id);
	if (!el) return;
	document.body.removeChild(el);
}
