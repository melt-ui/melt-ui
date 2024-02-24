import type { BuilderReturn } from '$lib/internal/types.js';
import type { CreateListboxProps, ListboxSelected } from '../listbox/types.js';
import type { createCombobox } from './create.js';
export type { ComboboxComponentEvents } from './events.js';

export type {
	ListboxOption as ComboboxOption,
	ListboxSelected as ComboboxSelected,
	ListboxOptionProps as ComboboxOptionProps,
} from '../listbox/types.js';

export type CreateComboboxProps<Value = unknown> = Omit<
	CreateListboxProps<Value>,
	'builder' | 'typeahead'
>;

export type Combobox<Value = unknown> = BuilderReturn<typeof createCombobox<Value>>;
export type ComboboxElements<Value = unknown> = Combobox<Value>['elements'];
export type ComboboxOptions<Value = unknown> = Combobox<Value>['options'];
export type ComboboxStates<Value = unknown> = Combobox<Value>['states'];
export type ComboboxHelpers<Value = unknown> = Combobox<Value>['helpers'];
