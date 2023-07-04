import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
import type { TextDirection } from '@melt-ui/svelte/internal/types';
import type { Writable } from 'svelte/store';
import type { createMenuBuilder } from './create';

export type CreateMenuArgs = {
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

export type CreateSubmenuArgs = CreateMenuArgs & {
	disabled?: boolean;
};

export type CreateRadioGroupArgs = {
	value?: string;
};

export type ItemArgs = {
	onSelect?: (e: Event) => void;
};

export type CheckboxItemArgs = ItemArgs & {
	checked: Writable<boolean | 'indeterminate'>;
};

export type RadioItemArgs = {
	value: string;
	disabled?: boolean;
};

export type RadioItemActionArgs = ItemArgs;

export type Menu = {
	builder: CreateMenuArgs;
	submenu: CreateSubmenuArgs;
	radioGroup: CreateRadioGroupArgs;
	item: ItemArgs;
	checkboxItem: CheckboxItemArgs;
	radioItem: RadioItemArgs;
	radioItemAction: RadioItemActionArgs;
};

export type MenuBuilderOptions = {
	rootOpen: Writable<boolean>;
	rootActiveTrigger: Writable<HTMLElement | null>;
	rootOptions: Writable<CreateMenuArgs>;
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
