import { DESCRIPTIONS, KBD, PROPS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genProps } from '$docs/utils/content';
import type { BuilderData } from '.';
import { builder as dropdownBuilder } from './dropdown-menu';
import { getMenuSchemas, getMenuTriggerDataAttrs } from './menu';
const BUILDER_NAME = 'menubar';

const builder: APISchema = {
	title: 'createMenubar',
	description: DESCRIPTIONS.BUILDER(BUILDER_NAME),
	isBuilder: true,
	props: genProps(BUILDER_NAME, [PROPS.LOOP, PROPS.CLOSE_ON_ESCAPE]),
};

const menuBuilder: APISchema = {
	...dropdownBuilder,
	title: 'createMenu',
};
const {
	menu,
	arrow,
	item,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	separator,
	submenuBuilder,
	submenu,
	subTrigger,
} = getMenuSchemas('menubar menu');

const trigger: APISchema = {
	title: 'trigger',
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: getMenuTriggerDataAttrs('menubar menu'),
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior:
			'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
	},
	{
		key: KBD.ENTER,
		behavior:
			'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'When focused on a `trigger`, opens the associated menu. When focused on an `item`, shifts focus to the next item.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'When focused on an `item`, shifts focus to the next item..',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior:
			'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item. When focus is within the menu, opens the next menu in the menubar',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior:
			"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`. When focus is within the menu, opens the previous menu in the menubar",
	},
	{
		key: KBD.ESCAPE,
		behavior: "Closes the open menu and focuses that menu's `trigger`.",
	},
];

const schemas = [
	builder,
	menuBuilder,
	trigger,
	menu,
	item,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	submenuBuilder,
	subTrigger,
	submenu,
	separator,
	arrow,
];

const features = [
	'Can be controlled or uncontrolled.',
	'Supports submenus with configurable reading direction.',
	'Customize menu positioning.',
	'Optionally render a pointing arrow.',
	'Fully managed focus.',
	'Full keyboard navigation.',
	'Typeahead support',
];

export const menubarData: BuilderData = {
	schemas,
	features,
	keyboard,
};
