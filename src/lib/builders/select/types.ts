import type { BuilderReturn } from '$lib/internal/types.js';
import type { CreateListboxProps, ListboxSelected } from '../listbox/types.js';
import type { createSelect } from './create.js';
export type { SelectComponentEvents } from './events.js';

export type {
	ListboxOption as SelectOption,
	ListboxSelected as SelectSelected,
	ListboxOptionProps as SelectOptionProps,
} from '../listbox/types.js';

export type CreateSelectProps<Value = unknown> = Omit<CreateListboxProps<Value>, 'builder'>;

export type Select<Value = unknown> = BuilderReturn<typeof createSelect<Value>>;
export type SelectElements<Value = unknown> = Select<Value>['elements'];
export type SelectOptions<Value = unknown> = Select<Value>['options'];
export type SelectStates<Value = unknown> = Select<Value>['states'];
export type SelectHelpers<Value = unknown> = Select<Value>['helpers'];