import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { IdObjProp, ReadableProp } from '$lib/internal/helpers/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { TooltipIdParts, createTooltip } from './create.js';
export type { TooltipComponentEvents } from './events.js';

export type CreateTooltipProps = {
	positioning?: ReadableProp<FloatingConfig>;
	arrowSize?: ReadableProp<number>;
	open?: ReadableProp<boolean>;
	closeOnPointerDown?: ReadableProp<boolean>;
	openDelay?: ReadableProp<number>;
	closeDelay?: ReadableProp<number>;
	forceVisible?: ReadableProp<boolean>;
	closeOnEscape?: ReadableProp<boolean>;
	disableHoverableContent?: ReadableProp<boolean>;
	/**
	 * If set to `true`, whenever you open this tooltip, all other tooltips
	 * with `group` also set to `true` will close. If you pass in a string
	 * instead, only tooltips with the same `group` value will be closed.
	 */
	group?: ReadableProp<boolean | string>;
	/**
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<HTMLElement | string | null>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObjProp<TooltipIdParts>>;
};

export type Tooltip = BuilderReturn<typeof createTooltip>;
export type TooltipElements = Tooltip['elements'];
export type TooltipOptions = Tooltip['options'];
export type TooltipStates = Tooltip['states'];
