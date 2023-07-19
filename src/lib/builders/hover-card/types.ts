import type { FloatingConfig } from '$lib/internal/actions';
import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
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
export type HoverCardElements = BuilderElements<HoverCard>;
export type HoverCardOptions = BuilderOptions<HoverCard>;
export type HoverCardStates = BuilderStates<HoverCard>;
