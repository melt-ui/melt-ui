import type { FloatingConfig } from '$lib/internal/actions';
import type { createSelect } from './create';

export type CreateSelectProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	value?: unknown;
	valueLabel?: string;
	name?: string;
	preventScroll?: boolean;
	loop?: boolean;
};

export type SelectOptionProps = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type CreateSelectReturn = ReturnType<typeof createSelect>;
