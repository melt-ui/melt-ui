import type { BuilderReturn } from '$lib/internal/types';
import type { Menu } from '../menu';
import type { createDropdownMenu } from './create';

// Props
export type CreateDropdownMenuProps = Menu['builder'];
export type CreateDropdownSubmenuProps = Menu['submenu'];
export type DropdownMenuItemProps = Menu['item'];
export type DropdownMenuCheckboxItemProps = Menu['checkboxItem'];
export type CreateDropdownMenuRadioGroupProps = Menu['radioGroup'];
export type DropdownMenuRadioItemProps = Menu['radioItem'];
export type DropdownMenuRadioItemActionProps = Menu['radioItemAction'];

// Returns
export type DropdownMenu = BuilderReturn<typeof createDropdownMenu>;
export type DropdownMenuElements = DropdownMenu['elements'];
export type DropdownMenuOptions = DropdownMenu['options'];
export type DropdownMenuStates = DropdownMenu['states'];
export type DropdownMenuBuilders = DropdownMenu['builders'];

export type DropdownMenuSubmenu = BuilderReturn<DropdownMenuBuilders['createSubmenu']>;
export type DropdownMenuSubmenuElements = DropdownMenuSubmenu['elements'];
export type DropdownMenuSubmenuOptions = DropdownMenuSubmenu['options'];
export type DropdownMenuSubmenuStates = DropdownMenuSubmenu['states'];

export type DropdownMenuRadioGroup = BuilderReturn<DropdownMenuBuilders['createMenuRadioGroup']>;
export type DropdownMenuRadioGroupElements = DropdownMenuRadioGroup['elements'];
export type DropdownMenuRadioGroupStates = DropdownMenuRadioGroup['states'];
export type DropdownMenuRadioGroupHelpers = DropdownMenuRadioGroup['helpers'];
