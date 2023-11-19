import type { BuilderReturn } from '$lib/internal/types.js';
import type { CreateListboxProps, ListboxSelected } from '../listbox/types.js';
import type { createSelect } from './create.js';
export type { SelectComponentEvents } from './events.js';

export type {
	ListboxOption as SelectOption,
	ListboxSelected as SelectSelected,
	ListboxOptionProps as SelectOptionProps,
} from '../listbox/types.js';

export type CreateSelectProps<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Omit<CreateListboxProps<Value, Multiple, S>, 'builder'>;

export type Select<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>;

export type SelectElements<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Select<Value, Multiple, S>['elements'];

export type SelectOptions<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Select<Value, Multiple, S>['options'];

export type SelectStates<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Select<Value, Multiple, S>['states'];

export type SelectHelpers<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Select<Value, Multiple, S>['helpers'];
