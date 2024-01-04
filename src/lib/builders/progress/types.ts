import type { BuilderReturn } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createProgress } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';

export type CreateProgressProps = {
	/**
	 * The uncontrolled default value of the progress.
	 *
	 * @default 0
	 */
	defaultValue?: number | null;

	/**
	 * The controlled value store for the radio group.
	 * If provided, this will override the value passed to `defaultValue`.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	value?: Writable<number | null>;

	/**
	 * The callback invoked when the value store of the progress changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onValueChange?: ChangeFn<number | null>;

	/**
	 * The maximum value of the progress.
	 *
	 * @default 100
	 */
	max?: number;
};

export type Progress = BuilderReturn<typeof createProgress>;
export type ProgressElements = Progress['elements'];
export type ProgressOptions = Progress['options'];
export type ProgressStates = Progress['states'];
