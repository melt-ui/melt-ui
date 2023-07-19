import type { FloatingConfig } from '$lib/internal/actions';
import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createTooltip } from './create';

export type CreateTooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
};

export type Tooltip = BuilderReturn<typeof createTooltip>;
export type TooltipElements = BuilderElements<Tooltip>;
export type TooltipOptions = BuilderOptions<Tooltip>;
export type TooltipStates = BuilderStates<Tooltip>;
