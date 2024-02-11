import type { IdObj } from '$lib/internal/helpers/index.js';
import type { TextDirection } from '$lib/internal/types.js';
import type { ScrollAreaIdParts } from './index.js';

export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover';

export type CreateScrollAreaProps = {
	/**
	 * Determines when the scrollbar should be visible
	 *
	 * @default 'hover'
	 */
	type?: ScrollAreaType;

	/**
	 * If the type is `"scroll"` or `"hover"`, this determines how long
	 * (in milliseconds) the scrollbar should be visible after the user
	 * either stops scrolling or stops hovering over the scroll area.
	 *
	 * @default 600
	 */
	hideDelay?: number;

	/**
	 * The reading direction of the scroll area.
	 *
	 * @default 'ltr'
	 */
	dir?: TextDirection;

	/**
	 * Optionally override the default ids assigned to the
	 * elements.
	 */
	ids?: Partial<IdObj<ScrollAreaIdParts>>;
};
