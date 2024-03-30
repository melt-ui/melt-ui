import type { IdObj } from '$lib/internal/helpers/id.js';
import type { BuilderReturn } from '$lib/internal/types.js';
import type { _Menu } from '../menu/index.js';
import type { MenubarIdParts, createMenubar } from './create.js';
export type { MenubarComponentEvents } from './events.js';

// Props
export type CreateMenubarProps = {
	/**
	 * Whether or not the menubar should loop when
	 * navigating with the arrow keys.
	 *
	 * @default true
	 */
	loop?: boolean;

	/**
	 * Whether to close the active menu when the escape key is pressed.
	 *
	 * @default true
	 */
	closeOnEscape?: boolean | null;

	/**
	 * Whether to prevent scrolling the body when any menu within
	 * the menubar is open.
	 *
	 * @default true
	 */
	preventScroll?: boolean;

	/**
	 * Optionally override the default ids we assign to the elements
	 */
	ids?: Partial<IdObj<MenubarIdParts>>;
};

export type CreateMenubarMenuProps = Omit<_Menu['builder'], 'preventScroll'>;
export type CreateMenubarSubmenuProps = _Menu['submenu'];
export type MenubarMenuItemProps = _Menu['item'];
export type CreateMenuRadioGroupProps = _Menu['radioGroup'];
export type CreateMenuCheckboxItemProps = _Menu['checkboxItem'];
export type MenubarRadioItemProps = _Menu['radioItem'];
export type MenubarRadioItemActionProps = _Menu['radioItemAction'];

// Returns
export type Menubar = BuilderReturn<typeof createMenubar>;
export type MenubarElements = Menubar['elements'];
export type MenubarOptions = Menubar['options'];
export type MenubarBuilders = Menubar['builders'];

export type MenubarMenu = BuilderReturn<MenubarBuilders['createMenu']>;
export type MenubarMenuElements = MenubarMenu['elements'];
export type MenubarMenuOptions = MenubarMenu['options'];
export type MenubarMenuStates = MenubarMenu['states'];
export type MenubarMenuBuilders = MenubarMenu['builders'];

export type MenubarMenuSubmenu = BuilderReturn<MenubarMenuBuilders['createSubmenu']>;
export type MenubarMenuSubmenuElements = MenubarMenuSubmenu['elements'];
export type MenubarMenuSubmenuOptions = MenubarMenuSubmenu['options'];
export type MenubarMenuSubmenuStates = MenubarMenuSubmenu['states'];

export type MenubarMenuRadioGroup = BuilderReturn<MenubarMenuBuilders['createMenuRadioGroup']>;
export type MenubarMenuRadioGroupElements = MenubarMenuRadioGroup['elements'];
export type MenubarMenuRadioGroupStates = MenubarMenuRadioGroup['states'];
export type MenubarMenuRadioGroupHelpers = MenubarMenuRadioGroup['helpers'];

export type MenubarMenuCheckboxItem = BuilderReturn<MenubarMenuBuilders['createCheckboxItem']>;
export type MenubarMenuCheckboxItemElements = MenubarMenuCheckboxItem['elements'];
export type MenubarMenuCheckboxItemStates = MenubarMenuCheckboxItem['states'];
export type MenubarMenuCheckboxItemHelpers = MenubarMenuCheckboxItem['helpers'];
