import type { FloatingConfig } from '$lib/internal/actions';
import type { createSelect } from './create';

export type CreateSelectArgs = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	value?: unknown;
	label?: string;
	name?: string;
	preventScroll?: boolean;
	loop?: boolean;
};

export type OptionArgs = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type CreateSelectReturn = ReturnType<typeof createSelect>;
