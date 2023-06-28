import type { APISchema } from '$routes/(components)/api.svelte';

const builder: APISchema = {
	title: 'CreateDropdownMenuArgs',
	description: 'The configuration object passed to the `createDropdownMenu` builder function.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "{ placement: 'bottom' }",
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: 8,
		},
	],
};

const menu: APISchema = {
	title: 'Menu',
	description: 'The element which wraps the entire dropdown menu.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: '"menu"',
		},
		{
			label: '[data-melt-menu]',
			value: 'Present on the menu element.',
		},
	],
};

const trigger: APISchema = {
	title: 'Trigger',
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: [
		{
			label: '[data-melt-part]',
			value: '"trigger"',
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
			value: 'true',
		},
		{
			label: '[data-melt-part]',
			value: '"arrow"',
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
			value: "'item'",
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
			value: "'item'",
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
			value: '"radio-group"',
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
			value: "'item'",
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description: 'When the `trigger` of a collapsed section is focused, expands the section.',
		},
		{
			key: 'Enter',
			description: 'When the `trigger` of a collapsed section is focused, expands the section.',
		},
		{
			key: 'Tab',
			description: 'Moves focus to the next focusable element.',
		},
		{
			key: 'Shift + Tab',
			description: 'Moves focus to the previous focusable element',
		},
		{
			key: 'ArrowDown',
			description: 'Moves focus to the next `trigger` element.',
		},
		{
			key: 'ArrowUp',
			description: 'Moves focus to the previous `trigger` element.',
		},
		{
			key: 'Home',
			description: 'When focus is on a `trigger`, moves focus to the first `trigger`.',
		},
		{
			key: 'End',
			description: 'When focus is on a `trigger`, moves focus to the last `trigger`.',
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
};
