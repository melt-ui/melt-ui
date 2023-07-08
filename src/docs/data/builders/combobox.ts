import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'createCombobox args',
	description: 'The configuration object passed to the `createCombobox` builder function.',
	args: [
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
			default: false,
		},
		{
			label: 'scrollAlignment',
			type: '"nearest" | "center"',
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
	args: [
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
			default: false,
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

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description:
		'All of the following keyboard events first open the list if the list `input` is focused and the list is closed. The exception to this is `ESC`.',
	keyboardInteractions: [
		{
			key: 'Enter',
			description: 'selects the highlighted list item.',
		},
		{
			key: 'ArrowDown',
			description: 'Highlights the next list item.',
		},
		// {
		// 	key: 'PageDown',
		// 	description: 'Highlights 10 list items down (or the end of the list).',
		// },
		{
			key: 'ArrowUp',
			description: 'Highlights the previous list item.',
		},
		// {
		// 	key: 'PageUp',
		// 	description: 'Highlights 10 list items up (or the top of the list).',
		// },
		{
			key: 'Home',
			description: 'Highlights the first list item',
		},
		{
			key: 'End',
			description: 'Highlights the last list item',
		},
		{
			key: 'Esc',
			description:
				"When focus is on the `input` and it's closed, removes focus. When the `input` is open, closes the list.",
		},
	],
};

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
