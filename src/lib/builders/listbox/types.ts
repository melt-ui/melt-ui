import type {
	ClickOutsideBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
} from '$lib/internal/actions/index.js';
import type { ChangeFn, IdObj } from '$lib/internal/helpers/index.js';
import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { ListboxIdParts, createListbox } from './create.js';
export type { ListboxComponentEvents } from './events.js';

export type ListboxOption<Value = unknown> = {
	value: Value;
	label?: string;
};

export type ListboxSelected<Multiple extends boolean, Value> = WhenTrue<
	Multiple,
	ListboxOption<Value>[],
	ListboxOption<Value>
>;

export type CreateListboxProps<
	Value = unknown,
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
	 * The size of the arrow in pixels.
	 * @default undefined
	 */
	arrowSize?: number;

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

	disabled?: boolean;
	required?: boolean;
	name?: string;

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
	 * Click outside behavior type.
	 * `close`: Closes the element immediately.
	 * `defer`: Delegates the action to the parent floating element.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an outside click.
	 *
	 * @defaultValue `close`
	 */
	clickOutsideBehavior?: ClickOutsideBehaviorType;

	/**
	 * Whether or not to close the listbox menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: InteractOutsideEvent) => void;

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

	/**
	 * The name of the builder using listbox.
	 *
	 * @default 'listbox
	 */
	builder?: string;

	/**
	 * Whether or not to enable typeahead.
	 *
	 * @default true
	 */
	typeahead?: boolean;

	/**
	 * IF true, whenever an option is hovered, the highlightedItem will be set to that option.
	 *
	 * @default true
	 */
	highlightOnHover?: boolean;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<ListboxIdParts>>;
};

export type ListboxOptionProps<Value = unknown> = ListboxOption<Value> & {
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
