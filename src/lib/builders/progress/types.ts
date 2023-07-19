import type { BuilderReturn } from '$lib/internal/types';
import type { createProgress } from './create';

export type CreateProgressProps = {
	value?: number;
	max?: number;
};

export type Progress = BuilderReturn<typeof createProgress>;
export type ProgressElements = Progress['elements'];
export type ProgressOptions = Progress['options'];
export type ProgressBuilders = Progress['states'];
