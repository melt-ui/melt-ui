import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createTooltip } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
export type { TooltipComponentEvents } from './events.js';
export type CreateTooltipProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	defaultOpen?: boolean;
	open?: Writable<boolean>;
	onOpenChange?: ChangeFn<boolean>;
	closeOnPointerDown?: boolean;
	openDelay?: number;
	closeDelay?: number;
	forceVisible?: boolean;
	closeOnEscape?: boolean;
	/**
	 * If not undefined, the tooltip will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;
};

export type Tooltip = BuilderReturn<typeof createTooltip>;
export type TooltipElements = Tooltip['elements'];
export type TooltipOptions = Tooltip['options'];
export type TooltipStates = Tooltip['states'];
