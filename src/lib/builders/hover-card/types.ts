import type { FloatingConfig } from '$lib/internal/actions';
import type { BuilderReturn } from '$lib/internal/types';
import type { createHoverCard } from './create';

export type CreateHoverCardProps = {
	defaultOpen?: boolean;
	openDelay?: number;
	closeDelay?: number;
	closeOnOutsideClick?: boolean;
	positioning?: FloatingConfig;
	arrowSize?: number;
};

export type HoverCard = BuilderReturn<typeof createHoverCard>;
export type HoverCardElements = HoverCard['elements'];
export type HoverCardOptions = HoverCard['options'];
export type HoverCardBuilders = HoverCard['states'];
