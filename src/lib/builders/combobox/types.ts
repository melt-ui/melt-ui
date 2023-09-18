import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createCombobox } from './create.js';
import type { FloatingConfig } from '$lib/internal/actions/index.js';
export type { ComboboxComponentEvents } from './events.js';

export type ComboboxOption<Value> = {
	value: Value;
	label?: string;
};

export type ComboboxSelected<Multiple extends boolean, Value> = WhenTrue<
	Multiple,
	ComboboxOption<Value>[],
	ComboboxOption<Value>
>;

export type CreateComboboxProps<
	Value,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
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
	 * Whether or not the combobox should loop through the list when
	 * the end or beginning is reached.
	 *
	 * @default true
	 */
	loop?: boolean;

	/**
	 * Whether or not the combobox should be open by default
	 * when the component is rendered.
	 *
	 * This should only be used when you are not passing a controlled `open` store.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * An optional controlled store that manages the open state of the combobox.
	 */
	open?: Writable<boolean>;

	/**
	 * Change function that is called when the combobox's `open` state changes.
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
	 * An optional controlled store that manages the selected option of the combobox.
	 */
	selected?: Writable<S>;

	/**
	 * A change handler for the selected store called when the selected would normally change.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onSelectedChange?: ChangeFn<S>;

	/**
	 * Whether or not to close the combobox menu when the user clicks
	 * outside of the combobox.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether or not to close the combobox menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether or not to prevent scrolling the page when the
	 * combobox menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * If not undefined, the combobox menu will be rendered within the provided element or selector.
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

export type ComboboxItemProps<Value> = ComboboxOption<Value> & {
	/**
	 *  Is the item disabled?
	 */
	disabled?: boolean;
};

export type Combobox<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
> = BuilderReturn<typeof createCombobox<Value, Multiple, S>>;

export type ComboboxElements<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['elements'];

export type ComboboxOptions<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['options'];

export type ComboboxStates<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['states'];

export type ComboboxHelpers<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>
> = Combobox<Value, Multiple, S>['helpers'];
