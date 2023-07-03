import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { createHoverCard } from './create';

export type CreateHoverCardArgs = {
	defaultOpen?: boolean;
	openDelay?: number;
	closeDelay?: number;
	closeOnOutsideClick?: boolean;
	positioning?: FloatingConfig;
	arrowSize?: number;
};

export type CreateHoverCardReturn = ReturnType<typeof createHoverCard>;
