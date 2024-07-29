import type {
	EscapeBehaviorType,
	FloatingConfig,
	PortalConfig,
} from '$lib/internal/actions/index.js';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { TooltipIdParts, createTooltip } from './create.js';
export type { TooltipComponentEvents } from './events.js';
export type CreateTooltipProps = {
	positioning?: FloatingConfig | undefined;
	arrowSize?: number | undefined;
	defaultOpen?: boolean | undefined;
	open?: Writable<boolean> | undefined;
	onOpenChange?: ChangeFn<boolean> | undefined;
	closeOnPointerDown?: boolean | undefined;
	openDelay?: number | undefined;
	closeDelay?: number | undefined;
	forceVisible?: boolean | undefined;
	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	escapeBehavior?: EscapeBehaviorType | undefined;

	disableHoverableContent?: boolean | undefined;
	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: boolean | string | undefined;
	/**
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: PortalConfig | null | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<TooltipIdParts>> | undefined;
};

export type Tooltip = BuilderReturn<typeof createTooltip>;
export type TooltipElements = Tooltip['elements'];
export type TooltipOptions = Tooltip['options'];
export type TooltipStates = Tooltip['states'];
