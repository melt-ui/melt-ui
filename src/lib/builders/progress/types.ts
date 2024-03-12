import type { ReadableProp } from '$lib/internal/helpers/props.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { createProgress } from './create.js';

export type CreateProgressProps = {
	/**
	 * The uncontrolled default value of the progress.
	 *
	 * @default 0
	 */
	value?: ReadableProp<number | null>;

	/**
	 * The maximum value of the progress.
	 *
	 * @default 100
	 */
	max?: ReadableProp<number>;
};

export type Progress = BuilderReturn<typeof createProgress>;
export type ProgressElements = Progress['elements'];
export type ProgressOptions = Progress['options'];
export type ProgressStates = Progress['states'];
