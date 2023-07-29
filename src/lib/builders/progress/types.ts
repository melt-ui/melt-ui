import type { BuilderReturn } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createProgress } from './create';
import type { ChangeFn } from '$lib/internal/helpers';

export type CreateProgressProps = {
	defaultValue?: number;
	value?: Writable<number>;
	onValueChange?: ChangeFn<number>;
	max?: number;
};

export type Progress = BuilderReturn<typeof createProgress>;
export type ProgressElements = Progress['elements'];
export type ProgressOptions = Progress['options'];
export type ProgressStates = Progress['states'];
