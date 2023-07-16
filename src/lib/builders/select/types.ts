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

type MultipleSelectProps<T> =
	| {
			type: 'multiple';
			value?: Writable<T[]>;
			defaultValue?: never;
	  }
	| {
			type: 'multiple';
			value?: never;
			defaultValue?: T[];
	  };

type SingleSelectProps<T> =
	| {
			type: 'single';
			value?: Writable<T>;
			defaultValue?: never;
	  }
	| {
			type: 'single';
			value?: never;
			defaultValue?: T;
	  };

export type CreateSelectProps<T> = BaseSelectProps &
	(MultipleSelectProps<T> | SingleSelectProps<T>);

export type SelectOptionProps = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type CreateSelectReturn = ReturnType<typeof createSelect>;
