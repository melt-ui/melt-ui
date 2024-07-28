import type {
	EscapeBehaviorType,
	FloatingConfig,
	InteractOutsideEvent,
	PortalConfig,
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
	positioning?: FloatingConfig | undefined;

	/**
	 * The size of the arrow in pixels.
	 * @default 8
	 */
	arrowSize?: number | undefined;

	/**
	 * The direction of the text in the dropdown menu
	 *
	 * @default 'ltr'
	 */
	dir?: TextDirection | undefined;

	/**
	 * Whether or not to prevent scrolling when the menu is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean | undefined;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to the Escape key.
	 *
	 * @defaultValue `close`
	 */
	escapeBehavior?: EscapeBehaviorType | undefined;

	/**
	 * Whether or not to close the menu when an internal item is clicked.
	 *
	 * @default true
	 */
	closeOnItemClick?: boolean | undefined;

	/**
	 * If not `undefined`, the menu will be rendered within the provided element or selector.
	 *
	 * @default 'body'
	 */
	portal?: PortalConfig | null | undefined;

	/**
	 * Whether or not to close the menu when a click occurs outside of it.
	 *
	 * @default true
	 */
	closeOnOutsideClick?: boolean | undefined;

	/**
	 * A custom event handler for the "outside click" event, which
	 * is handled by the `document`.
	 * If `event.preventDefault()` is called within the function,
	 * the dialog will not close when the user clicks outside of it.
	 */
	onOutsideClick?: ((event: InteractOutsideEvent) => void) | undefined;

	/**
	 * Whether should prevent text selection overflowing the element when the element is the top layer.
	 *
	 * @defaultValue `true`
	 */
	preventTextSelectionOverflow?: boolean | undefined;

	/**
	 * Whether or not to loop the menu navigation.
	 *
	 * @default false
	 */
	loop?: boolean | undefined;

	/**
	 * Whether the menu is open by default or not.
	 *
	 * This option is ignore if you also pass an `open` store prop.
	 *
	 * @default false
	 */
	defaultOpen?: boolean | undefined;

	/**
	 * A controlled open state store for the menu. If provided, the
	 * value of this store will override the `defaultOpen` prop.
	 *
	 * @see https://melt-ui.com/docs/controlled#bring-your-own-store
	 */
	open?: Writable<boolean> | undefined;

	/**
	 * A callback for when the open state changes.
	 *
	 * @see https://melt-ui.com/docs/controlled#change-functions
	 */
	onOpenChange?: ChangeFn<boolean> | undefined;

	/**
	 * Whether the menu content should be displayed even if it is not open.
	 * This is useful for animating the content in and out using transitions.
	 *
	 * @see https://melt-ui.com/docs/transitions
	 *
	 * @default false
	 */
	forceVisible?: boolean | undefined;

	/**
	 * Whether to use typeahead to automatically focus elements.
	 * @default true
	 */
	typeahead?: boolean | undefined;

	/**
	 * Override the default autofocus behavior of the menu
	 * on close.
	 */
	closeFocus?: FocusProp | undefined;

	/**
	 * Optionally prevent focusing the first item in the menu
	 */
	disableFocusFirstItem?: boolean | undefined;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<_MenuIdParts>> | undefined;
};

export type _CreateSubmenuProps = Pick<
	_CreateMenuProps,
	'arrowSize' | 'positioning' | 'open' | 'onOpenChange' | 'ids'
> & {
	disabled?: boolean | undefined;
};

export type _CreateRadioGroupProps = {
	defaultValue?: string | undefined;
	value?: Writable<string> | undefined;
	onValueChange?: ChangeFn<string | null> | undefined;
};

export type _ItemProps = {
	disabled?: boolean | undefined;
};

export type _CheckboxItemProps = _ItemProps & {
	defaultChecked?: boolean | 'indeterminate' | undefined;
	checked?: Writable<boolean | 'indeterminate'> | undefined;
	onCheckedChange?: ChangeFn<boolean | 'indeterminate'> | undefined;
};

export type _RadioItemProps = {
	value: string;
	disabled?: boolean | undefined;
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
		escapeBehavior: WithGet<Writable<EscapeBehaviorType>>;
		closeOnOutsideClick: WithGet<Writable<boolean>>;
		preventTextSelectionOverflow: WithGet<Writable<boolean>>;
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

	ids?: Partial<IdObj<_MenuIdParts>> | undefined;
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
