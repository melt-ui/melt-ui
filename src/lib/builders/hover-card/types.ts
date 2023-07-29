import type { FloatingConfig, PortalConfig } from '$lib/internal/actions';
import type { createHoverCard } from './create';

export type CreateHoverCardProps = {
	defaultOpen?: boolean;
	openDelay?: number;
	closeDelay?: number;
	closeOnOutsideClick?: boolean;
	positioning?: FloatingConfig;
	arrowSize?: number;

	/**
	 * The container element that the card would portal to.
	 *
	 * @default null
	 */
	portal?: PortalConfig | null;
};

export type CreateHoverCardReturn = ReturnType<typeof createHoverCard>;
