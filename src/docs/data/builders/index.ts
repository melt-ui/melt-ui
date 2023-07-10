import type { APISchema, KeyboardSchema } from '$docs/types';
import { accordionData } from './accordion';
import { avatarData } from './avatar';
import { checkboxData } from './checkbox';
import { collapsibleData } from './collapsible';
import { comboboxData } from './combobox';
import { contextMenuData } from './context-menu';
import { dialogData } from './dialog';
import { dropdownMenuData } from './dropdown-menu';
import { hoverCardData } from './hover-card';
import { labelData } from './label';
import { menubarData } from './menubar';
import { paginationData } from './pagination';
import { pinInputData } from './pin-input';
import { popoverData } from './popover';
import { progressData } from './progress';
import { radioGroupData } from './radio-group';
import { selectData } from './select';
import { separatorData } from './separator';
import { sliderData } from './slider';
import { switchData } from './switch';
import { tabsData } from './tabs';
import { tagsInputData } from './tags-input';
import { toggleData } from './toggle';
import { toggleGroupData } from './toggle-group';
import { toolbarData } from './toolbar';
import { tooltipData } from './tooltip';

export const builderList = [
	'accordion',
	'avatar',
	'checkbox',
	'collapsible',
	'combobox',
	'context-menu',
	'dialog',
	'dropdown-menu',
	'hover-card',
	'label',
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
	'tabs',
	'tags-input',
	'toggle',
	'toggle-group',
	'toolbar',
	'tooltip',
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
	combobox: comboboxData,
	'context-menu': contextMenuData,
	dialog: dialogData,
	'dropdown-menu': dropdownMenuData,
	'hover-card': hoverCardData,
	label: labelData,
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
	tabs: tabsData,
	'tags-input': tagsInputData,
	'toggle-group': toggleGroupData,
	toggle: toggleData,
	toolbar: toolbarData,
	tooltip: tooltipData,
};
