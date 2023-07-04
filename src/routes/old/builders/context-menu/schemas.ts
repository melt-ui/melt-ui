import type { APISchema } from '$routes/(components)/api.svelte';

const builder: APISchema = {
	title: 'CreateContextMenuArgs',
	description: 'The configuration object passed to the `createContextMenu` builder function.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'bottom'",
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: 8,
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: true,
		},
	],
};

const menu: APISchema = {
	title: 'Menu',
	description: 'The element which wraps the entire dropdown menu.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"menu"'],
		},
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
		{
			label: '[data-melt-menu]',
			value: 'Present on the menu element.',
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The element which when right clicked inside, opens the context menu.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"trigger"'],
		},
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'An optional arrow element which points to the trigger.',
	dataAttributes: [
		{
			label: '[data-arrow]',
			value: '`true`',
		},
		{
			label: '[data-melt-part]',
			value: ['"arrow"'],
		},
	],
};

const item: APISchema = {
	title: 'Item',
	description: 'A basic menu item.',
	args: [
		{
			label: 'onSelect',
			type: 'function',
		},
	],
	dataAttributes: [
		{
			label: '[data-orientation]',
			value: ['"vertical"', '"horizontal"'],
		},
		{
			label: '[data-melt-part]',
			value: ['"item"'],
		},
	],
};

const checkboxItem: APISchema = {
	title: 'Checkbox Item',
	description: 'A checkbox menu item.',
	args: [
		{
			label: 'checked',
			type: 'Writable<boolean>',
		},
		{
			label: 'onSelect',
			type: 'function',
		},
	],
	dataAttributes: [
		{
			label: '[data-orientation]',
			value: ['"vertical"', '"horizontal"'],
		},
		{
			label: '[data-melt-part]',
			value: ['"item"'],
		},
	],
};

const radioGroupBuilder = {
	title: 'CreateMenuRadioGroupArgs',
	description: 'The configuration object passed to the `createMenuRadioGroup` builder function.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
	],
};

const radioGroup: APISchema = {
	title: 'Menu Radio Group',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"radio-group"'],
		},
	],
};

const radioItem: APISchema = {
	title: 'Radio Group Item',
	description: 'A radiogroup menu item.',
	args: [
		{
			label: 'value',
			type: 'string',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'onSelect',
			type: 'function',
		},
	],
	dataAttributes: [
		{
			label: '[data-orientation]',
			value: ['"vertical"', '"horizontal"'],
		},
		{
			label: '[data-melt-part]',
			value: ['"item"'],
		},
	],
};

const separator: APISchema = {
	title: 'Separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"separator"'],
		},
	],
};

const submenuBuilder: APISchema = {
	title: 'CreateDropdownSubMenuArgs',
	description: 'The configuration object passed to the `createDropdownSubMenu` builder function.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'right'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const submenu: APISchema = {
	title: 'Submenu',
	description: 'A submenu element displayed when its trigger is selected.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"submenu"'],
		},
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
		{
			label: '[data-melt-menu]',
			value: 'Present on the submenu element.',
		},
	],
};

const subTrigger: APISchema = {
	title: 'Sub Trigger',
	description: 'A button which opens its associated submenu.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"subtrigger"'],
		},
		{
			label: '[data-state]',
			value: ['"open"', '"closed"'],
		},
		{
			label: '[data-disabled]',
			value: 'Present if the element is disabled',
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
		},
		{
			key: 'Enter',
			description:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
		},
		{
			key: 'ArrowDown',
			description:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item.',
		},
		{
			key: 'ArrowUp',
			description: 'When focused on an `item`, shifts focus to the next item..',
		},
		{
			key: 'ArrowRight',
			description:
				'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item.',
		},
		{
			key: 'ArrowLeft',
			description:
				"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`.",
		},
		{
			key: 'Esc',
			description: 'Closes the dropdown menu and focuses the `trigger`.',
		},
	],
};

export const schemas = {
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
