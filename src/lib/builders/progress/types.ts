import type {
	BuilderElements,
	BuilderOptions,
	BuilderReturn,
	BuilderStates,
} from '$lib/internal/types';
import type { createProgress } from './create';

export type CreateProgressProps = {
	value?: number;
	max?: number;
};

export type Progress = BuilderReturn<typeof createProgress>;
export type ProgressElements = BuilderElements<Progress>;
export type ProgressOptions = BuilderOptions<Progress>;
export type ProgressStates = BuilderStates<Progress>;
