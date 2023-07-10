import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { dropdownMenuData } from './dropdown-menu';

const menuSchemas = dropdownMenuData.schemas;

const builder: APISchema = {
	title: 'createMenubar',
	description: DESCRIPTIONS.BUILDER('menubar'),
	props: [
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.LOOP,
		},
	],
};

const menuBuilder: APISchema = {
	title: 'createMenu',
	description: DESCRIPTIONS.BUILDER('menubar menu'),
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'bottom'",
			description: DESCRIPTIONS.FLOATING_CONFIG,
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: DESCRIPTIONS.PREVENT_SCROLL('menu'),
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'false',
			description: DESCRIPTIONS.LOOP,
		},
	],
};
const item: APISchema = {
	title: 'item',
	description: 'A basic menu item.',
	props: [
		{
			label: 'onSelect',
			type: [TYPES.EVENT_HANDLER, 'undefined'],
			default: 'undefined',
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-menubar-menu-item',
			value: ATTRS.MELT('item'),
		},
	],
};

const checkboxItem: APISchema = {
	title: 'checkboxItem',
	description: 'A checkbox menu item.',
	props: [
		{
			label: 'checked',
			type: 'Writable<boolean>',
			default: 'Writable<false>',
			description: 'A writable boolean which determines whether or not the checkbox is checked.',
		},
		{
			label: 'onSelect',
			type: [TYPES.EVENT_HANDLER, 'undefined'],
			default: 'undefined',
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-menubar-menu-checkbox-item',
			value: ATTRS.MELT('checkbox item'),
		},
	],
};

const radioGroup: APISchema = {
	title: 'radioGroup',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			label: 'data-melt-menubar-menu-radio-group',
			value: ATTRS.MELT('radio group'),
		},
	],
};

const radioItem: APISchema = {
	title: 'radioItem',
	description: 'A radiogroup menu item.',
	props: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the radio item.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the radio item is disabled.',
		},
		{
			label: 'onSelect',
			type: [TYPES.EVENT_HANDLER, 'undefined'],
			default: 'undefined',
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-menubar-menu-radio-item',
			value: ATTRS.MELT('radio item'),
		},
	],
};

const menu: APISchema = {
	title: 'menu',
	description: 'The menu element.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-menubar-menu',
			value: ATTRS.MELT('menu'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'An optional arrow element which points to the trigger.',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			label: 'data-melt-menubar-menu-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which opens the menu.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-menubar-menu-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			label: 'data-melt-menubar-menu-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const submenu: APISchema = {
	title: 'submenu',
	description: 'A submenu element displayed when its trigger is selected.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-menubar-menu-submenu',
			value: ATTRS.MELT('submenu'),
		},
	],
};

const subTrigger: APISchema = {
	title: 'subTrigger',
	description: 'A menuitem which opens its associated submenu.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('subtrigger'),
		},
		{
			label: 'data-melt-menubar-menu-subtrigger',
			value: ATTRS.MELT('subtrigger'),
		},
	],
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

const schemas = {
	builder,
	menuBuilder,
	item,
	checkboxItem,
	radioGroup,
	radioItem,
	menu,
	arrow,
	trigger,
	separator,
	submenu,
	subTrigger,
	radioGroupBuilder: menuSchemas.radioGroupBuilder,
	submenuBuilder: menuSchemas.submenuBuilder,
	keyboard,
};
const features = [
	'Can be controlled or uncontrolled.',
	'Supports submenus with configurable reading direction.',
	'Customize menu positioning.',
	'Optionally render a pointing arrow.',
	'Fully managed focus.',
	'Full keyboard navigation.',
	'Typeahead support',
];

export const menubarData = {
	schemas,
	features,
};
