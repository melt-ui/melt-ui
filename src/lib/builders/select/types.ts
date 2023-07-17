import type { FloatingConfig } from '$lib/internal/actions';
import type { Writable } from 'svelte/store';
import type { createSelect } from './create';

type MultipleSelectProps<O> =
	| {
			type: 'multiple';
			value?: Writable<O[]>;
			defaultValue?: never;
	  }
	| {
			type: 'multiple';
			value?: never;
			defaultValue?: O[];
	  };

type SingleSelectProps<O> =
	| {
			value?: Writable<O>;
			defaultValue?: never;
	  }
	| {
			value?: never;
			defaultValue?: O;
	  };

type SelectType = 'single' | 'multiple';

export type CreateSelectProps<Type extends SelectType = 'single', O = unknown> = {
	type?: Type;
	positioning?: FloatingConfig;
	arrowSize?: number;
	required?: boolean;
	disabled?: boolean;
	value?: unknown;
	label?: string;
	name?: string;
	preventScroll?: boolean;
	loop?: boolean;
} & (Type extends 'single' ? SingleSelectProps<O> : MultipleSelectProps<O>);


export type SelectOptionProps = {
	value: unknown;
	label?: string;
	disabled?: boolean;
};

export type CreateSelectReturn = ReturnType<typeof createSelect>;
