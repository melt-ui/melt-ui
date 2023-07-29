import type { FloatingConfig,PortalConfig } from '$lib/internal/actions';
import type { ChangeFn } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';
import type { createPopover } from './create';

export type CreatePopoverProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	/** The initial state of open. Should only be used if the popover is uncontrolled */
	defaultOpen?: boolean;
	/** A store that controls the open state. Use when you want to directly control
	 * the popover.
	 */
	open?: Writable<boolean>;
	/** Optional function that runs whenever open should change.
	 * When present, will control state changes instead of the default behaviour
	 * */
	onOpenChange?: ChangeFn<boolean>;
	disableFocusTrap?: boolean;

	/**
	 * The container element that the popover would portal to.
	 *
	 * @default null
	 */
	portal?: PortalConfig | null;
};

export type CreatePopoverReturn = ReturnType<typeof createPopover>;
