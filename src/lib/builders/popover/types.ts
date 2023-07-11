import type { FloatingConfig } from '$lib/internal/actions';
import type { createPopover } from './create';

type ChangeFn<T> = (args: { prev: T; next: T }) => boolean;

export type CreatePopoverArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	/** The initial state of open */
	open?: boolean;
	/** Optional function that runs whenever open should change.
	 * When present, will control state changes instead of the default behaviour
	 * */
	onOpenChange?: ChangeFn<boolean>;
};

export type CreatePopoverReturn = ReturnType<typeof createPopover>;
