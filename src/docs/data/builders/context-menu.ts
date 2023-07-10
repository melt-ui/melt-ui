import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createContextMenu',
	description: 'The builder function used to create a context menu component.',
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'right'",
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
			description: DESCRIPTIONS.PREVENT_SCROLL('context menu'),
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
			label: 'data-melt-context-menu',
			value: ATTRS.MELT('context-menu'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which when right clicked inside, opens the context menu.',
	dataAttributes: [
		{
			label: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			label: 'data-melt-context-menu-trigger',
			value: ATTRS.MELT('trigger'),
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
			label: 'data-melt-context-menu-arrow',
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
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-context-menu-item',
			value: ATTRS.MELT('item'),
		},
		{
			label: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('item'),
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
			description: 'A writable store which controls the checked state of the checkbox item.',
		},
		{
			label: 'onSelect',
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-context-menu-checkbox-item',
			value: ATTRS.MELT('checkbox item'),
		},
		{
			label: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('checkbox item'),
		},
	],
};

const radioGroupBuilder: APISchema = {
	title: 'createMenuRadioGroup',
	description: 'The configuration object passed to the `createMenuRadioGroup` builder function.',
	props: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the selected radio item.',
		},
	],
};

const radioGroup: APISchema = {
	title: 'radioGroup',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			label: 'data-melt-context-menu-radio-group',
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
			required: true,
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the radio item is disabled.',
		},
		{
			label: 'onSelect',
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			label: 'data-melt-context-menu-radio-item',
			value: ATTRS.MELT('radio item'),
		},
		{
			label: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('radio item'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			label: 'data-melt-context-menu-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const submenuBuilder: APISchema = {
	title: 'createSubMenu',
	description: 'The configuration object passed to the `createDropdownSubMenu` builder function.',
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
			description: 'Whether the submenu is disabled.',
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
			label: 'data-melt-context-menu-submenu',
			value: ATTRS.MELT('submenu'),
		},
	],
};

const subTrigger: APISchema = {
	title: 'subTrigger',
	description: 'A button which opens its associated submenu.',
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
			label: 'data-melt-context-menu-subtrigger',
			value: ATTRS.MELT('subtrigger'),
		},
		{
			label: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('subtrigger'),
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

export const contextMenuData = {
	schemas,
	features,
};
