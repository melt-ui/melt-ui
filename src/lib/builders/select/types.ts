import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { BuilderReturn, WhenTrue } from '$lib/internal/types.js';
import type { Writable } from 'svelte/store';
import type { createSelect } from './create.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';

export type { SelectComponentEvents } from './events.js';

export type SelectOption<Value> = {
	value: Value;
	label?: string;
};

export type SelectSelected<Multiple extends boolean, Value> = WhenTrue<
	Multiple,
	SelectOption<Value>[],
	SelectOption<Value>
>;

export type CreateSelectProps<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default  placement: 'bottom'
	 */
	positioning?: FloatingConfig;

	/**
	 * The size of the arrow in pixels.
	 * @default 8
	 */
	arrowSize?: number;

	/**
	 * Whether or not the select is required.
	 *
	 * @default false
	 */
	required?: boolean;

	/**
	 * Whether or not the select input is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * An optional controlled store that manages the open state of the select menu.
	 */
	defaultOpen?: boolean;

	/**
	 * A controlled open state store for the menu. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @default Writable<false>
	 */
	open?: Writable<boolean>;

	/**
	 * A callback for when the open state changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * The name for the select input.
	 *
	 * @default undefined
	 */
	name?: string;

	/**
	 * Whether or not to prevent scrolling the body when the menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * Whether or not to loop through the menu options once the end or beginning is reached.
	 */
	loop?: boolean;

	/**
	 * Whether or not to close the select menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether or not to close the select menu when the user clicks
	 * outside of the menu.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * If not undefined, the select menu will be rendered within the provided element or selector.
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

	/**
	 * The default value set on the select input.
	 *
	 * This will be overridden if you also pass a `value` store prop.
	 *
	 * @default undefined
	 */
	defaultSelected?: S;

	/**
	 * An optional controlled store that manages the value state of the combobox.
	 */
	selected?: Writable<S | undefined>;

	/**
	 * A change handler for the value store called when the value would normally change.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onSelectedChange?: ChangeFn<S | undefined>;

	multiple?: Multiple;
};

export type SelectOptionProps<Value = unknown> = SelectOption<Value> & {
	disabled?: boolean;
};

export type Select<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>;
export type SelectElements<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>['elements'];
export type SelectOptions<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>['options'];
export type SelectStates<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>['states'];
export type SelectHelpers<
	Value = unknown,
	Multiple extends boolean = false,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	S extends SelectSelected<Multiple, Value> = SelectSelected<Multiple, Value>
> = BuilderReturn<typeof createSelect<Value, Multiple, S>>['helpers'];
