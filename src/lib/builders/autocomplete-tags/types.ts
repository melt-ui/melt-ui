import type { BuilderReturn } from '$lib/internal/types.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createAutocompleteTags } from './create.js';
import type { FloatingConfig } from '$lib/internal/actions/index.js';
export type { AutocompleteTagsComponentEvents } from './events.js';

export type AutocompleteTagsOption<Value> = {
	value: Value;
	label?: string;
};

export type CreateAutocompleteTagsProps<
	Value,
	Selected extends Array<AutocompleteTagsOption<Value>> = Array<AutocompleteTagsOption<Value>>
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
	 * Whether or not the AutocompleteTags should loop through the list when
	 * the end or beginning is reached.
	 *
	 * @default true
	 */
	loop?: boolean;

	/**
	 * Whether or not the AutocompleteTags should be open by default
	 * when the component is rendered.
	 *
	 * This should only be used when you are not passing a controlled `open` store.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * An optional controlled store that manages the open state of the AutocompleteTags.
	 */
	open?: Writable<boolean>;

	/**
	 * Change function that is called when the AutocompleteTags' `open` state changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean>;

	/**
	 * The default value set on the select input.
	 *
	 * This will be overridden if you also pass a `value` store prop.
	 *
	 * @default undefined
	 */
	defaultSelected?: Selected;

	/**
	 * An optional controlled store that manages the value state of the AutocompleteTags.
	 */
	selected?: Writable<Selected>;

	/**
	 * A change handler for the value store called when the value would normally change.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onSelectedChange?: ChangeFn<Selected>;

	/**
	 * Whether or not to close the AutocompleteTags menu when the user clicks
	 * outside of the AutocompleteTags.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether or not to close the AutocompleteTags menu when the user presses
	 * the escape key.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether or not to prevent scrolling the page when the
	 * AutocompleteTags menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * If not undefined, the AutocompleteTags menu will be rendered within the provided element or selector.
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
};

export type AutocompleteTagsItemProps<Value> = AutocompleteTagsOption<Value> & {
	/**
	 *  Is the item disabled?
	 */
	disabled?: boolean;
};

export type AutocompleteTags = BuilderReturn<typeof createAutocompleteTags>;
export type AutocompleteTagsElements = AutocompleteTags['elements'];
export type AutocompleteTagsOptions = AutocompleteTags['options'];
export type AutocompleteTagsStates = AutocompleteTags['states'];
export type AutocompleteTagsHelpers = AutocompleteTags['helpers'];
