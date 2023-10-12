import type { BuilderReturn } from '$lib/internal/types.js';
import type { ListboxSelected } from '../listbox/types.js';
import type { createCombobox } from './create.js';
export type { ComboboxComponentEvents } from './events.js';

export type {
	ListboxOption as ComboboxOption,
	ListboxSelected as ComboboxSelected,
	CreateListboxProps as CreateComboboxProps,
	ListboxOptionProps as ComboboxOptionProps,
} from '../listbox/types.js';

export type Combobox<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = BuilderReturn<typeof createCombobox<Value, Multiple, S>>;

export type ComboboxElements<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['elements'];

export type ComboboxOptions<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['options'];

export type ComboboxStates<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['states'];

export type ComboboxHelpers<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['helpers'];
