import type { FloatingConfig } from '$lib/internal/actions';
import type { TextDirection } from '$lib/internal/types';
import type { ChangeFn } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';
import type { createMenuBuilder } from './create';

export type CreateMenuProps = {
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
	 * The direction of the text in the dropdown menu
	 *
	 * @default 'ltr'
	 */
	dir?: TextDirection;

	/**
	 * Whether or not to prevent scrolling when the menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * Whether or not to close the menu when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean;

	/**
	 * Whether the element should be portaled to the body or not.
	 * If an element's parent is being portaled to the body, any child elements will
	 * automatically be portaled into that element.
	 *
	 * @default true
	 */
	portal?: boolean;

	/**
	 * Whether or not to close the menu when a click occurs outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean;

	/**
	 * Whether or not to loop the menu navigation.
	 *
	 * @default false
	 */
	loop?: boolean;

	/**
	 * Whether the menu is open by default or not.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * A controlled open state for the menu.
	 */
	open?: Writable<boolean>;

	/**
	 * A callback for when the open state changes.
	 */
	onOpenChange?: ChangeFn<boolean>;

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

export type CreateSubmenuProps = CreateMenuProps & {
	disabled?: boolean;
};

export type CreateRadioGroupProps = {
	value?: string;
};

export type ItemProps = {
	onSelect?: (e: Event) => void;
};

export type CheckboxItemProps = ItemProps & {
	checked: Writable<boolean | 'indeterminate'>;
};

export type RadioItemProps = {
	value: string;
	disabled?: boolean;
};

export type RadioItemActionProps = ItemProps;

export type Menu = {
	builder: CreateMenuProps;
	submenu: CreateSubmenuProps;
	radioGroup: CreateRadioGroupProps;
	item: ItemProps;
	checkboxItem: CheckboxItemProps;
	radioItem: RadioItemProps;
	radioItemAction: RadioItemActionProps;
};

export type MenuBuilderOptions = {
	rootOpen: Writable<boolean>;
	rootActiveTrigger: Writable<HTMLElement | null>;
	rootOptions: {
		positioning: Writable<FloatingConfig>;
		arrowSize: Writable<number | undefined>;
		preventScroll: Writable<boolean | undefined>;
		loop: Writable<boolean | undefined>;
		dir: Writable<TextDirection>;
		closeOnEscape: Writable<boolean>;
		closeOnOutsideClick: Writable<boolean>;
		portal: Writable<boolean>;
		forceVisible: Writable<boolean>;
	};
	disableTriggerRefocus?: boolean;
	disableFocusFirstItem?: boolean;
	nextFocusable: Writable<HTMLElement | null>;
	prevFocusable: Writable<HTMLElement | null>;
	selector: string;
};

export type MenuParts =
	| 'trigger'
	| 'arrow'
	| 'checkbox-item'
	| 'item'
	| 'radio-group'
	| 'radio-item'
	| 'submenu'
	| 'subtrigger'
	| 'subarrow';

export type Selector = (part?: MenuParts | undefined) => string;

export type CreateMenuReturn = ReturnType<typeof createMenuBuilder>;
