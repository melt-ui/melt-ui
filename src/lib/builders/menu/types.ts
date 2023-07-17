import type { FloatingConfig } from '$lib/internal/actions';
import type { TextDirection } from '$lib/internal/types';
import type { Writable } from 'svelte/store';
import type { createMenuBuilder } from './create';

export type CreateMenuProps = {
	/**
	 * Options for positioning the popover menu.
	 *
	 * @default { placement: 'bottom' }
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
	 * Whether or not to loop the menu navigation.
	 *
	 * @default false
	 */
	loop?: boolean;
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
		arrowSize: Writable<number>;
		preventScroll: Writable<boolean>;
		loop: Writable<boolean>;
		dir: Writable<TextDirection>;
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
