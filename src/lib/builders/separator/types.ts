import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn, Orientation } from '$lib/internal/types.js';
import type { createSeparator } from './create.js';

export type CreateSeparatorProps = {
	/*
	 * The orientation of the separator.
	 *
	 * @default 'horizontal'
	 */
	orientation?: ReadableProp<Orientation>;

	/*
	 * Whether the separator is purely decorative or not. If true,
	 * the separator will have a role of 'none' and will be hidden from screen
	 * readers and removed fro the accessibility tree.
	 *
	 * @default false
	 */
	decorative?: ReadableProp<boolean>;
};

export type Separator = BuilderReturn<typeof createSeparator>;
export type SeparatorElements = Separator['elements'];
export type SeparatorOptions = Separator['options'];
