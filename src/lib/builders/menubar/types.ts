import type { Menu } from '../menu';
import type { createMenubar } from './create';

export type CreateMenubar = {
	/**
	 * Whether or not the menubar should loop when
	 * navigating with the arrow keys.
	 *
	 * @default true
	 */
	loop?: boolean;
};
export type CreateMenu = Menu['builder'];
export type CreateSubMenu = Menu['submenu'];
export type MenuItem = Menu['item'];
export type MenuCheckboxItem = Menu['checkboxItem'];
export type CreateMenuRadioGroup = Menu['radioGroup'];
export type MenuRadioItem = Menu['radioItem'];
export type MenuRadioItemAction = Menu['radioItemAction'];

export type CreateMenubarReturn = ReturnType<typeof createMenubar>;
