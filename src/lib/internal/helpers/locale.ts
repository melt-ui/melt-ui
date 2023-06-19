import { isBrowser } from '$lib/internal/helpers/is';
import type { TextDirection } from '$lib/internal/types';

/**
 * Detects the text direction in the browser based on the user preffered language locale.
 * @returns {TextDirection} The text direction ('ltr' for left-to-right or 'rtl' for right-to-left).
 */
export function getBrowserTextDirection(): TextDirection {
	if (!isBrowser) return 'ltr';

	const language = navigator.language;
	const locale = new Intl.Locale(language);
	const direction = locale.textInfo?.direction;

	return direction ?? 'ltr';
}
