import type { APISchema } from '$routes/(components)/api.svelte';

const builder: APISchema = {
	title: 'createDropdownMenu',
	description: 'The builder function used to create a dropdown menu.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "{ placement: 'bottom' }",
			description: 'The positioning configuration for the floating menu.',
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: '8',
			description: 'The size of the arrow which points to the trigger.',
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to prevent scrolling when the menu is open.',
		},
	],
};

const menu: APISchema = {
	title: 'menu',
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
	title: 'trigger',
	description: 'The button which toggles the dropdown menu.',
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
	title: 'arrow',
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
	title: 'item',
	description: 'A basic menu item.',
	args: [
		{
			label: 'onSelect',
			type: 'function',
			description: 'A callback function which is called when the item is selected.',
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
	title: 'checkboxItem',
	description: 'A checkbox menu item.',
	args: [
		{
			label: 'checked',
			type: 'Writable<boolean>',
			description: 'A writable boolean which controls the checked state of the checkbox.',
		},
		{
			label: 'onSelect',
			type: 'function',
			description: 'A callback function which is called when the item is selected.',
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

const radioGroupBuilder: APISchema = {
	title: 'createMenuRadioGroup',
	description: 'The builder function used to create a menu radio group.',
	args: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the selected radio item. Set this to have a default selection.',
		},
	],
};

const radioGroup: APISchema = {
	title: 'radioGroup',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"radio-group"'],
		},
	],
};

const radioItem: APISchema = {
	title: 'radioItem',
	description: 'A radiogroup menu item.',
	args: [
		{
			label: 'value',
			type: 'string',
			description: 'The value of the radio item.',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the item is disabled.',
		},
		{
			label: 'onSelect',
			type: 'function',
			description: 'A callback function which is called when the item is selected.',
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
	title: 'separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: ['"separator"'],
		},
	],
};

const submenuBuilder: APISchema = {
	title: 'createDropdownSubmenu',
	description: 'The builder function used to create a dropdown submenu.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'right'",
			description: 'The positioning configuration for the submenu.',
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
	title: 'subTrigger',
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
