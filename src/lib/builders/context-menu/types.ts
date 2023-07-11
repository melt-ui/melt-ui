import type { Menu } from '../menu';
import type { createContextMenu } from './create';

export type CreateContextMenuProps = Menu['builder'];
export type CreateContextSubmenuProps = Menu['submenu'];
export type ContextMenuItemProps = Menu['item'];
export type ContextMenuCheckboxItemProps = Menu['checkboxItem'];
export type CreateContextMenuRadioGroupProps = Menu['radioGroup'];
export type ContextMenuRadioItemProps = Menu['radioItem'];
export type ContextMenuRadioItemActionProps = Menu['radioItemAction'];

export type CreateContextMenuReturn = ReturnType<typeof createContextMenu>;
