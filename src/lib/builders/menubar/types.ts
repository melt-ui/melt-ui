import type { Menu } from '../menu';
import type { createMenubar } from './create';

export type CreateMenubarProps = {
	/**
	 * Whether or not the menubar should loop when
	 * navigating with the arrow keys.
	 *
	 * @default true
	 */
	loop?: boolean;
};
export type CreateMenubarMenuProps = Menu['builder'];
export type CreateMenubarSubmenuProps = Menu['submenu'];
export type MenubarMenuItemProps = Menu['item'];
export type MenubarCheckboxItemProps = Menu['checkboxItem'];
export type CreateMenuRadioGroupProps = Menu['radioGroup'];
export type MenubarRadioItemProps = Menu['radioItem'];
export type MenubarRadioItemActionProps = Menu['radioItemAction'];

export type CreateMenubarReturn = ReturnType<typeof createMenubar>;
