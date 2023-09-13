import type { APISchema, KeyboardSchema } from '$docs/types.js';
import { accordionData } from './accordion.js';
import { avatarData } from './avatar.js';
import { checkboxData } from './checkbox.js';
import { collapsibleData } from './collapsible.js';
import { colorPickerData } from './color-picker.js';
import { comboboxData } from './combobox.js';
import { contextMenuData } from './context-menu.js';
import { dialogData } from './dialog.js';
import { dropdownMenuData } from './dropdown-menu.js';
import { labelData } from './label.js';
import { linkPreviewData } from './link-preview.js';
import { menubarData } from './menubar.js';
import { paginationData } from './pagination.js';
import { pinInputData } from './pin-input.js';
import { popoverData } from './popover.js';
import { progressData } from './progress.js';
import { radioGroupData } from './radio-group.js';
import { selectData } from './select.js';
import { separatorData } from './separator.js';
import { sliderData } from './slider.js';
import { switchData } from './switch.js';
import { tabsData } from './tabs.js';
import { tagsInputData } from './tags-input.js';
import { toastData } from './toast.js';
import { toggleData } from './toggle.js';
import { toggleGroupData } from './toggle-group.js';
import { treeData } from './tree.js';
import { tableOfContentsData } from './table-of-contents.js';
import { toolbarData } from './toolbar.js';
import { tooltipData } from './tooltip.js';

export const builderList = [
	'accordion',
	'avatar',
	'checkbox',
	'collapsible',
	'color-picker',
	'combobox',
	'context-menu',
	'dialog',
	'dropdown-menu',
	'label',
	'link-preview',
	'menubar',
	'pagination',
	'pin-input',
	'popover',
	'progress',
	'radio-group',
	'select',
	'separator',
	'slider',
	'switch',
	'table-of-contents',
	'tabs',
	'tags-input',
	'toast',
	'toggle',
	'toggle-group',
	'toolbar',
	'tooltip',
	'tree',
] as const;

export type Builder = (typeof builderList)[number];

export function isBuilderName(key: string): key is (typeof builderList)[number] {
	return builderList.includes(key as (typeof builderList)[number]);
}

export type BuilderData = {
	schemas?: APISchema[];
	features: string[];
	keyboard?: KeyboardSchema;
};

export type Builders = Record<(typeof builderList)[number], BuilderData>;

export const data: Builders = {
	accordion: accordionData,
	avatar: avatarData,
	checkbox: checkboxData,
	collapsible: collapsibleData,
	"color-picker": colorPickerData,
	combobox: comboboxData,
	'context-menu': contextMenuData,
	dialog: dialogData,
	'dropdown-menu': dropdownMenuData,
	label: labelData,
	'link-preview': linkPreviewData,
	menubar: menubarData,
	pagination: paginationData,
	'pin-input': pinInputData,
	popover: popoverData,
	progress: progressData,
	'radio-group': radioGroupData,
	select: selectData,
	separator: separatorData,
	slider: sliderData,
	switch: switchData,
	'table-of-contents': tableOfContentsData,
	tabs: tabsData,
	'tags-input': tagsInputData,
	toast: toastData,
	'toggle-group': toggleGroupData,
	toggle: toggleData,
	toolbar: toolbarData,
	tooltip: tooltipData,
	tree: treeData,
};
