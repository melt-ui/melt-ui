import type { FloatingConfig } from '$lib/internal/actions';
import type {
	BuilderElements,
	BuilderHelpers,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createSelect } from './create';

export type CreateSelectProps = {
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

export type SelectOptionProps = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type Select = BuilderReturn<typeof createSelect>;
export type SelectElements = BuilderElements<Select>;
export type SelectOptions = BuilderOptions<Select>;
export type SelectStates = BuilderStates<Select>;
export type SelectHelpers = BuilderHelpers<Select>;
