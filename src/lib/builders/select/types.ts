import type { FloatingConfig } from '$lib/internal/actions';
import type { Writable } from 'svelte/store';
import type { createSelect } from './create';

type BaseSelectProps = {
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	label?: string;
	name?: string;
	preventScroll?: boolean;
	loop?: boolean;
};

type MultipleSelectProps =
	| {
			type: 'multiple';
			value?: Writable<unknown[]>;
			defaultValue?: never;
	  }
	| {
			type: 'multiple';
			value?: never;
			defaultValue?: unknown[];
	  };

type SingleSelectProps =
	| {
			type: 'single';
			value?: Writable<unknown>;
			defaultValue?: never;
	  }
	| {
			type: 'single';
			value?: never;
			defaultValue?: unknown;
	  };

export type CreateSelectProps = BaseSelectProps & (MultipleSelectProps | SingleSelectProps);

export type SelectOptionProps = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type CreateSelectReturn = ReturnType<typeof createSelect>;
