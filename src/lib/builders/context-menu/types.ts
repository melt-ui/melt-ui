import type { BuilderReturn } from '$lib/internal/types';
import type { Menu } from '../menu';
import type { createContextMenu } from './create';

export type CreateContextMenuProps = Menu['builder'];
export type CreateContextSubmenuProps = Menu['submenu'];
export type ContextMenuItemProps = Menu['item'];
export type ContextMenuCheckboxItemProps = Menu['checkboxItem'];
export type CreateContextMenuRadioGroupProps = Menu['radioGroup'];
export type ContextMenuRadioItemProps = Menu['radioItem'];
export type ContextMenuRadioItemActionProps = Menu['radioItemAction'];

export type ContextMenu = BuilderReturn<typeof createContextMenu>;
export type ContextMenuElements = ContextMenu['elements'];
export type ContextMenuOptions = ContextMenu['options'];
export type ContextMenuStates = ContextMenu['states'];
export type ContextMenuBuilders = ContextMenu['builders'];
