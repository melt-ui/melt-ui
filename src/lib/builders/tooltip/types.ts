import type { FloatingConfig } from '$lib/internal/actions';
import type { BuilderReturn } from '$lib/internal/types';
import type { createTooltip } from './create';

export type CreateTooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
	/**
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string;
};

export type Tooltip = BuilderReturn<typeof createTooltip>;
export type TooltipElements = Tooltip['elements'];
export type TooltipOptions = Tooltip['options'];
export type TooltipStates = Tooltip['states'];
