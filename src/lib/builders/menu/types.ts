import type {
	ClickOutsideBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
} from '$lib/internal/actions/index.js';
import type { TextDirection } from '$lib/internal/types.js';
import type { ChangeFn, FocusProp, IdObj } from '$lib/internal/helpers/index.js';
import type { Writable } from 'svelte/store';
import type { _MenuIdParts, createMenuBuilder } from './create.js';
import type { WithGet } from '$lib/internal/helpers/withGet.js';

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
	 * Whether or not to close the menu when an internal item is clicked.
	 *
	 * @default true
	 */
	closeOnItemClick?: boolean;

	/**
	 * If not `undefined`, the menu will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: HTMLElement | string | null;

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
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: (event: InteractOutsideEvent) => void;

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

	/**
	 * Override the default autofocus behavior of the menu
	 * on close.
	 */
	closeFocus?: FocusProp;

	/**
	 * Optionally prevent focusing the first item in the menu
	 */
	disableFocusFirstItem?: boolean;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<_MenuIdParts>>;
};

export type _CreateSubmenuProps = Pick<
	_CreateMenuProps,
	'arrowSize' | 'positioning' | 'open' | 'onOpenChange' | 'ids'
> & {
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
	rootOpen: WithGet<Writable<boolean>>;
	rootActiveTrigger: WithGet<Writable<HTMLElement | null>>;
	rootOptions: {
		positioning: WithGet<Writable<FloatingConfig>>;
		arrowSize: WithGet<Writable<number | undefined>>;
		preventScroll: WithGet<Writable<boolean | undefined>>;
		loop: WithGet<Writable<boolean | undefined>>;
		dir: WithGet<Writable<TextDirection>>;
		closeOnEscape: WithGet<Writable<boolean>>;
		clickOutsideBehavior: WithGet<Writable<ClickOutsideBehaviorType>>;
		portal: WithGet<Writable<string | HTMLElement | undefined | null>>;
		forceVisible: WithGet<Writable<boolean>>;
		typeahead: WithGet<Writable<boolean>>;
		closeFocus: WithGet<Writable<FocusProp | undefined>>;
		disableFocusFirstItem: WithGet<Writable<boolean>>;
		closeOnItemClick: WithGet<Writable<boolean>>;
		onOutsideClick: WithGet<Writable<((event: InteractOutsideEvent) => void) | undefined>>;
	};

	nextFocusable: WithGet<Writable<HTMLElement | null>>;
	prevFocusable: WithGet<Writable<HTMLElement | null>>;
	selector: string;
	/**
	 * When you want to handle the scroll removal in the specific menu builder,
	 * rather than in the menu builder factory.
	 */
	removeScroll: boolean;

	ids?: Partial<IdObj<_MenuIdParts>>;
};

export type _MenuParts =
	| 'trigger'
	| 'arrow'
	| 'checkbox-item'
	| 'item'
	| 'overlay'
	| 'radio-group'
	| 'radio-item'
	| 'submenu'
	| 'subtrigger'
	| 'subarrow'
	| 'group'
	| 'group-label';

export type Selector = (part?: _MenuParts | undefined) => string;

export type _CreateMenuReturn = ReturnType<typeof createMenuBuilder>;
