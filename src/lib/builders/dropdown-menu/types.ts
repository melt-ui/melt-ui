import type { Menu } from '../menu';
import type { createDropdownMenu } from './create';

export type CreateDropdownMenu = Menu['builder'];
export type CreateDropdownMenuSub = Menu['submenu'];
export type DropdownMenuItemArgs = Menu['item'];
export type DropdownMenuCheckboxItemArgs = Menu['checkboxItem'];
export type CreateDropdownMenuRadioGroup = Menu['radioGroup'];
export type DropdownMenuRadioItemArgs = Menu['radioItem'];
export type DropdownMenuRadioItemActionArgs = Menu['radioItemAction'];

export type CreateDropdownMenuReturn = ReturnType<typeof createDropdownMenu>;
