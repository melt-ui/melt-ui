import type { APISchema, KeyboardSchema } from '$docs/types';
import { dropdownMenuData } from './dropdown-menu';

const menuSchemas = dropdownMenuData.schemas;

const builder: APISchema = {
	title: 'createMenubar',
	description: 'The configuration object passed to the `createMenubar` builder function.',
	props: [
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
	],
};

const menuBuilder: APISchema = {
	title: 'createMenu',
	description:
		'The configuration object passed to the `createMenu` builder function returned from the `createMenubar` builder function.',
	props: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'bottom'",
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'false',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Space',
		behavior:
			'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
	},
	{
		key: 'Enter',
		behavior:
			'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
	},
	{
		key: 'ArrowDown',
		behavior:
			'When focused on a `trigger`, opens the associated menu. When focused on an `item`, shifts focus to the next item.',
	},
	{
		key: 'ArrowUp',
		behavior: 'When focused on an `item`, shifts focus to the next item..',
	},
	{
		key: 'ArrowRight',
		behavior:
			'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item. When focus is within the menu, opens the next menu in the menubar',
	},
	{
		key: 'ArrowLeft',
		behavior:
			"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`. When focus is within the menu, opens the previous menu in the menubar",
	},
	{
		key: 'Esc',
		behavior: "Closes the open menu and focuses that menu's `trigger`.",
	},
];

const schemas = {
	builder,
	menuBuilder,
	radioGroup: menuSchemas.radioGroup,
	radioItem: menuSchemas.radioItem,
	radioGroupBuilder: menuSchemas.radioGroupBuilder,
	checkboxItem: menuSchemas.checkboxItem,
	menu: menuSchemas.menu,
	arrow: menuSchemas.arrow,
	item: menuSchemas.item,
	trigger: menuSchemas.trigger,
	keyboard,
	subTrigger: menuSchemas.subTrigger,
	submenu: menuSchemas.submenu,
	submenuBuilder: menuSchemas.submenuBuilder,
	separator: menuSchemas.separator,
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
