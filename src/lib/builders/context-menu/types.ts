import type { BuilderReturn } from '$lib/internal/types';
import type { _Menu } from '../menu';
import type { createContextMenu } from './create';

// Props
export type CreateContextMenuProps = _Menu['builder'];
export type CreateContextSubmenuProps = _Menu['submenu'];
export type ContextMenuItemProps = _Menu['item'];
export type ContextMenuCheckboxItemProps = _Menu['checkboxItem'];
export type CreateContextMenuRadioGroupProps = _Menu['radioGroup'];
export type ContextMenuRadioItemProps = _Menu['radioItem'];
export type ContextMenuRadioItemActionProps = _Menu['radioItemAction'];

// Returns
export type ContextMenu = BuilderReturn<typeof createContextMenu>;
export type ContextMenuElements = ContextMenu['elements'];
export type ContextMenuOptions = ContextMenu['options'];
export type ContextMenuStates = ContextMenu['states'];
export type ContextMenuBuilders = ContextMenu['builders'];

export type ContextMenuSubmenu = BuilderReturn<ContextMenuBuilders['createSubmenu']>;
export type ContextMenuSubmenuElements = ContextMenuSubmenu['elements'];
export type ContextMenuSubmenuOptions = ContextMenuSubmenu['options'];
export type ContextMenuSubmenuStates = ContextMenuSubmenu['states'];

export type ContextMenuRadioGroup = BuilderReturn<ContextMenuBuilders['createMenuRadioGroup']>;
export type ContextMenuRadioGroupElements = ContextMenuRadioGroup['elements'];
export type ContextMenuRadioGroupStates = ContextMenuRadioGroup['states'];
export type ContextMenuRadioGroupHelpers = ContextMenuRadioGroup['helpers'];
