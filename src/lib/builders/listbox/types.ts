import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createListbox } from './create.js';
import type { FloatingConfig } from '$lib/internal/actions/index.js';
export type { ListboxComponentEvents } from './events.js';

export type ListboxOption<Value> = {
	value: Value;
	label?: string;
};

export type ListboxSelected<Multiple extends boolean, Value> = WhenTrue<
	Multiple,
	ListboxOption<Value>[],
	ListboxOption<Value>
>;

export type CreateListboxProps<
	Value,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: FloatingConfig;

	/**
	 * Determines behavior when scrolling items into view.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block
	 */
	scrollAlignment?: 'nearest' | 'center';

	/**
	 * Whether or not the listbox should loop through the list when
	 * the end or beginning is reached.
	 *
	 * @default true
	 */
	loop?: boolean;

	/**
	 * Whether or not the listbox should be open by default
	 * when the component is rendered.
	 *
	 * This should only be used when you are not passing a controlled `open` store.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * An optional controlled store that manages the open state of the listbox.
	 */
	open?: Writable<boolean>;

	/**
	 * Change function that is called when the listbox's `open` state changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * The default selected option.
	 *
	 * This will be overridden if you also pass a `selected` store prop.
	 *
	 * @default undefined
	 */
	defaultSelected?: S;

	/**
	 * An optional controlled store that manages the selected option of the listbox.
	 */
	selected?: Writable<S>;

	/**
	 * A change handler for the selected store called when the selected would normally change.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onSelectedChange?: ChangeFn<S | undefined>;

	/**
	 * Whether or not to close the listbox menu when the user clicks
	 * outside of the listbox.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether or not to close the listbox menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether or not to prevent scrolling the page when the
	 * listbox menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * If not undefined, the listbox menu will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean;

	multiple?: Multiple;
};

export type ListboxOptionProps<Value> = ListboxOption<Value> & {
	/**
	 *  Is the item disabled?
	 */
	disabled?: boolean;
};

export type Listbox<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = BuilderReturn<typeof createListbox<Value, Multiple, S>>;

export type ListboxElements<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Listbox<Value, Multiple, S>['elements'];

export type ListboxOptions<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Listbox<Value, Multiple, S>['options'];

export type ListboxStates<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Listbox<Value, Multiple, S>['states'];

export type ListboxHelpers<
	Value = unknown,
	Multiple extends boolean = false,
	S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>
> = Listbox<Value, Multiple, S>['helpers'];
