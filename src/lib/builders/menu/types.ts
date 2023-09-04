import type { FloatingConfig } from '$lib/internal/actions/index.js';
import type { TextDirection } from '$lib/internal/types.js';
import type { ChangeFn } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { createMenuBuilder } from './create.js';

export type _CreateMenuProps = {
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
	 * If not `undefined`, the menu will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

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
	 * This option is ignore if you also pass an `open` store prop.
	 *
	 * @default false
	 */
	defaultOpen?: boolean;

	/**
	 * A controlled open state store for the menu. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean>;

	/**
	 * A callback for when the open state changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
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

	/**
	 * Whether to use typeahead to automatically focus elements.
	 * @default true
	 */
	typeahead?: boolean;
};

export type _CreateSubmenuProps = Pick<_CreateMenuProps, 'arrowSize' | 'positioning'> & {
	disabled?: boolean;
};

export type _CreateRadioGroupProps = {
	defaultValue?: string;
	value?: Writable<string>;
	onValueChange?: ChangeFn<string | null>;
};

export type _ItemProps = {
	disabled?: boolean;
};

export type _CheckboxItemProps = _ItemProps & {
	defaultChecked?: boolean | 'indeterminate';
	checked?: Writable<boolean | 'indeterminate'>;
	onCheckedChange?: ChangeFn<boolean | 'indeterminate'>;
};

export type _RadioItemProps = {
	value: string;
	disabled?: boolean;
};

export type _RadioItemActionProps = _ItemProps;

export type _Menu = {
	builder: _CreateMenuProps;
	submenu: _CreateSubmenuProps;
	radioGroup: _CreateRadioGroupProps;
	item: _ItemProps;
	checkboxItem: _CheckboxItemProps;
	radioItem: _RadioItemProps;
	radioItemAction: _RadioItemActionProps;
};

export type _MenuBuilderOptions = {
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
		portal: Writable<string | HTMLElement | undefined | null>;
		forceVisible: Writable<boolean>;
		typeahead: Writable<boolean>;
	};
	disableTriggerRefocus?: boolean;
	disableFocusFirstItem?: boolean;
	nextFocusable: Writable<HTMLElement | null>;
	prevFocusable: Writable<HTMLElement | null>;
	selector: string;
	/**
	 * When you want to handle the scroll removal in the specific menu builder,
	 * rather than in the menu builder factory.
	 */
	removeScroll: boolean;
};

export type _MenuParts =
	| 'trigger'
	| 'arrow'
	| 'checkbox-item'
	| 'item'
	| 'radio-group'
	| 'radio-item'
	| 'submenu'
	| 'subtrigger'
	| 'subarrow'
	| 'group'
	| 'group-label';

export type Selector = (part?: _MenuParts | undefined) => string;

export type _CreateMenuReturn = ReturnType<typeof createMenuBuilder>;
