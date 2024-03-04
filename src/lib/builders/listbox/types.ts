import type { FloatingConfig, InteractOutsideEvent } from '$lib/internal/actions/index.js';
import type { ChangeFn, IdObjProp, ReadableProp } from '$lib/internal/helpers/index.js';
import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { ListboxIdParts, createListbox } from './create.js';
export type { ListboxComponentEvents } from './events.js';

export type ListboxOption<Value = unknown> = {
	value: Value;
	label?: string;
};

export type ListboxSelected<Value> = ListboxOption<Value>[];

export type CreateListboxProps<Value = unknown> = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: ReadableProp<FloatingConfig>;

	/**
	 * The size of the arrow in pixels.
	 * @default 8
	 */
	arrowSize?: ReadableProp<number>;

	/**
	 * Determines behavior when scrolling items into view.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#block
	 */
	scrollAlignment?: ReadableProp<'nearest' | 'center'>;

	/**
	 * Whether or not the listbox should loop through the list when
	 * the end or beginning is reached.
	 *
	 * @default true
	 */
	loop?: ReadableProp<boolean>;

	disabled?: ReadableProp<boolean>;
	required?: ReadableProp<boolean>;
	name?: ReadableProp<string>;

	/**
	 * Whether or not the listbox should be open
	 *
	 * @default false
	 */
	open?: ReadableProp<boolean>;

	/**
	 * The selected options.
	 *
	 * @default []
	 */
	selected?: ReadableProp<ListboxSelected<Value>>;

	/**
	 * Whether or not to close the listbox menu when the user clicks
	 * outside of the listbox.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: ReadableProp<boolean>;

	/**
	 * Whether or not to close the listbox menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: ReadableProp<boolean>;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ReadableProp<(event: InteractOutsideEvent) => void>;

	/**
	 * Whether or not to prevent scrolling the page when the
	 * listbox menu is open.
	 *
	 * @default true
	 */
	preventScroll?: ReadableProp<boolean>;

	/**
	 * If not undefined, the listbox menu will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: ReadableProp<HTMLElement | string | null>;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: ReadableProp<boolean>;

	multiple?: ReadableProp<boolean>;

	/**
	 * The name of the builder using listbox.
	 *
	 * @default 'listbox'
	 */
	builder?: string;

	/**
	 * Whether or not to enable typeahead.
	 *
	 * @default true
	 */
	typeahead?: ReadableProp<boolean>;

	/**
	 * IF true, whenever an option is hovered, the highlightedItem will be set to that option.
	 *
	 * @default true
	 */
	highlightOnHover?: ReadableProp<boolean>;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObjProp<ListboxIdParts>>;
};

export type ListboxOptionProps<Value = unknown> = ListboxOption<Value> & {
	/**
	 *  Is the item disabled?
	 */
	disabled?: boolean;
};

export type Listbox<Value = unknown> = BuilderReturn<typeof createListbox<Value>>;
export type ListboxElements<Value = unknown> = Listbox<Value>['elements'];
export type ListboxOptions<Value = unknown> = Listbox<Value>['options'];
export type ListboxStates<Value = unknown> = Listbox<Value>['states'];
export type ListboxHelpers<Value = unknown> = Listbox<Value>['helpers'];
