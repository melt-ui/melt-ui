import type { BuilderReturn } from '$lib/internal/types';
import type { Menu } from '../menu';
import type { createDropdownMenu } from './create';

export type CreateDropdownMenuProps = Menu['builder'];
export type CreateDropdownSubmenuProps = Menu['submenu'];
export type DropdownMenuItemProps = Menu['item'];
export type DropdownMenuCheckboxItemProps = Menu['checkboxItem'];
export type CreateDropdownMenuRadioGroupProps = Menu['radioGroup'];
export type DropdownMenuRadioItemProps = Menu['radioItem'];
export type DropdownMenuRadioItemActionProps = Menu['radioItemAction'];

export type DropdownMenu = BuilderReturn<typeof createDropdownMenu>;
export type DropdownMenuElements = DropdownMenu['elements'];
export type DropdownMenuOptions = DropdownMenu['options'];
export type DropdownMenuBuilders = DropdownMenu['states'];
export type DropdownMenuStates = DropdownMenu['builders'];
