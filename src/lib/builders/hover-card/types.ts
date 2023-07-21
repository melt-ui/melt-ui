import type { FloatingConfig } from '$lib/internal/actions';
import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createHoverCard } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateHoverCardProps = {
	defaultOpen?: boolean;
	open?: Writable<boolean>;
	onOpenChange?: ChangeFn<boolean>;
	openDelay?: number;
	closeDelay?: number;
	closeOnOutsideClick?: boolean;
	positioning?: FloatingConfig;
	arrowSize?: number;
};

export type HoverCard = BuilderReturn<typeof createHoverCard>;
export type HoverCardElements = HoverCard['elements'];
export type HoverCardOptions = HoverCard['options'];
export type HoverCardStates = HoverCard['states'];
