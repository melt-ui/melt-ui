import type { ChangeFn } from '$lib/internal/helpers';
import type { Orientation, TextDirection } from '$lib/internal/types';

export type CreateNavigationMenuProps = {
	onValueChange?: ChangeFn<string>;
	direction?: TextDirection;
	orientation?: Orientation;
	/**
	 * The duration from when the pointer enters the trigger until the menu is shown.
	 * @defaultValue 200
	 */
	delayMs?: number;
	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 * @defaultValue 200
	 */
	skipDelayMs?: number;

	label?: string;
};
