import type { WithGet } from '$lib/internal/helpers/withGet.js';
import type { Readable } from 'svelte/store';

export type PreventTextSelectionOverflowConfig = {
	/**
	 * Whether should prevent text selection overflowing the element when the element is the top layer.
	 *
	 * @defaultValue `true`
	 */
	enabled?: boolean | WithGet<Readable<boolean>>;
};
