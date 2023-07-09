import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createCombobox args',
	description: 'The configuration object passed to the `createCombobox` builder function.',
	props: [
		{
			label: 'filterFunction',
			type: '(item: T, inputValue: string)',
		},
		{
			label: 'items',
			type: 'T[]',
		},
		{
			label: 'itemToString',
			type: '(item: T)',
		},
		{
			label: 'loop',
			type: 'boolean',
			default: 'false',
		},
		{
			label: 'scrollAlignment',
			type: ['"nearest"', '"center"'],
			default: '"nearest"',
		},
	],
};

const input: APISchema = {
	title: 'Input',
	description:
		'The element that opens, closes, filters the list, and displays the selected value from the list.',
	dataAttributes: [
		{
			label: 'aria-autocomplete',
			value: '"list"',
		},
		{
			label: 'aria-disabled',
			value: ['true', 'false'],
		},
		{
			label: 'aria-expanded',
			value: ['true', 'false'],
		},
		{
			label: 'autocomplete',
			value: '"off"',
		},
		{
			label: 'disabled',
			value: 'Present if the `list` element is disabled.',
		},
		{
			label: 'role',
			value: '"combobox"',
		},
		{
			label: 'data-state',
			value: ['"open"', '"closed"'],
		},
		{
			label: 'data-disabled',
			value: 'Present if the `select` element is disabled.',
		},
	],
};

const option: APISchema = {
	title: 'Item',
	description: 'The menu item element',
	props: [
		{
			label: 'label',
			type: 'string',
		},
		{
			label: 'value',
			type: 'unknown',
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const arrow: APISchema = {
	title: 'Arrow',
	description: 'The optional arrow element',
	dataAttributes: [
		{
			label: 'data-arrow',
			value: ['"true"'],
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'Enter',
		behavior: 'selects the highlighted list item.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Highlights the next list item.',
	},
	// {
	// 	key: 'PageDown',
	// 	behavior: 'Highlights 10 list items down (or the end of the list).',
	// },
	{
		key: 'ArrowUp',
		behavior: 'Highlights the previous list item.',
	},
	// {
	// 	key: 'PageUp',
	// 	behavior: 'Highlights 10 list items up (or the top of the list).',
	// },
	{
		key: 'Home',
		behavior: 'Highlights the first list item',
	},
	{
		key: 'End',
		behavior: 'Highlights the last list item',
	},
	{
		key: 'Esc',
		behavior:
			"When focus is on the `input` and it's closed, removes focus. When the `input` is open, closes the list.",
	},
];

const schemas = {
	builder,
	input,
	option,
	arrow,
	keyboard,
};

const features = [
	'Full keyboard navigation',
	'Updatable data source',
	'Can be controlled or uncontrolled',
	'Custom positioning',
];

export const comboboxData = {
	schemas,
	features,
};
