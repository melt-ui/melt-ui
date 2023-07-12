import type { FloatingConfig } from '$lib/internal/actions';
import type { createTooltip } from './create';

export type CreateTooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	open?: boolean;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
};

export type CreateTooltipReturn = ReturnType<typeof createTooltip>;
