import { KBD, PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import type { BuilderData } from './index.js';
import { builder as dropdownBuilder } from './dropdown-menu.js';
import { getMenuSchemas, getMenuTriggerDataAttrs } from './menu.js';
import { menubarEvents } from '$lib/builders/menubar/events.js';

const OPTION_PROPS = [PROPS.CLOSE_ON_ESCAPE, PROPS.LOOP];
const BUILDER_NAME = 'menubar';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createMenubar',
	props: OPTION_PROPS,
	builders: [
		{
			name: 'createMenu',
			description: 'Creates a menu inside the menubar',
		},
	],
	options: OPTION_PROPS,
});

const menuBuilder = {
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

const TRIGGER_NAME = 'trigger' as const;

const trigger = elementSchema(TRIGGER_NAME, {
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: getMenuTriggerDataAttrs('menubar-menu'),
	events: menubarEvents[TRIGGER_NAME],
});

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
