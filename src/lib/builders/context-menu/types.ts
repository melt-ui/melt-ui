import type { Menu } from '../menu';
import type { createContextMenu } from './create';

export type CreateContextMenu = Menu['builder'];
export type CreateContextMenuSub = Menu['submenu'];
export type ContextMenuItemArgs = Menu['item'];
export type ContextMenuCheckboxItemArgs = Menu['checkboxItem'];
export type CreateContextMenuRadioGroup = Menu['radioGroup'];
export type ContextMenuRadioItemArgs = Menu['radioItem'];
export type ContextMenuRadioItemActionArgs = Menu['radioItemAction'];

export type CreateContextMenuReturn = ReturnType<typeof createContextMenu>;
