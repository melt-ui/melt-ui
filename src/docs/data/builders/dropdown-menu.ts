import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createDropdownMenu',
	description: 'The builder function used to create a dropdown menu component.',
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
			description: DESCRIPTIONS.PREVENT_SCROLL('dropdown menu'),
		},
	],
};

const menu: APISchema = {
	title: 'menu',
	description: 'The element which wraps the entire dropdown menu.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-dropdown-menu',
			value: ATTRS.MELT('menu'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: [
		{
			label: 'data-melt-dropdown-menu-trigger',
			value: ATTRS.MELT('trigger'),
		},
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
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
			label: 'data-melt-dropdown-menu-arrow',
			value: ATTRS.MELT('arrow'),
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
			label: 'data-melt-dropdown-menu-item',
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
			label: 'data-melt-dropdown-menu-checkbox-item',
			value: ATTRS.MELT('checkbox item'),
		},
	],
};

const radioGroupBuilder = {
	title: 'createMenuRadioGroup',
	description: 'The configuration object passed to the `createMenuRadioGroup` builder function.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
	],
};

const radioGroup: APISchema = {
	title: 'radioGroup',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			label: 'data-melt-dropdown-menu-radio-group',
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
			label: 'data-melt-dropdown-menu-radio-item',
			value: ATTRS.MELT('radio item'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			label: 'data-melt-dropdown-menu-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const submenuBuilder: APISchema = {
	title: 'createSubmenu',
	description: 'The builder function used to create submenu components.',
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'right'",
			description: DESCRIPTIONS.FLOATING_CONFIG,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the submenu is disabled.',
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
			label: 'data-melt-dropdown-menu-submenu',
			value: ATTRS.MELT('submenu'),
		},
	],
};

const subTrigger: APISchema = {
	title: 'subTrigger',
	description: 'A button which opens its associated submenu.',
	dataAttributes: [
		{
			label: 'data-melt-dropdown-menu-subtrigger',
			value: ATTRS.MELT('subtrigger'),
		},
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-disabled',
			value: ATTRS.DISABLED('subtrigger'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior:
			'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
	},
	{
		key: KBD.ENTER,
		behavior:
			'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior:
			'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'When focused on an `item`, shifts focus to the next item..',
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior:
			"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`.",
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the dropdown menu and focuses the `trigger`.',
	},
];

const schemas = {
	builder,
	radioGroup,
	radioItem,
	radioGroupBuilder,
	checkboxItem,
	menu,
	arrow,
	item,
	trigger,
	keyboard,
	subTrigger,
	submenu,
	submenuBuilder,
	separator,
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

export const dropdownMenuData = {
	schemas,
	features,
};
