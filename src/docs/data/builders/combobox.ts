import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createCombobox',
	description: DESCRIPTIONS.BUILDER('combobox'),
	props: [
		{
			name: 'filterFunction',
			type: '(item: T, inputValue: string)',
			description:
				'A function that returns `true` if the item should be included in the filtered list.',
		},
		{
			name: 'items',
			type: 'T[]',
			description: 'The list of items to display in the combobox list.',
		},
		{
			name: 'itemToString',
			type: '(item: T)',
			description: 'A function that returns a string representation of the item.',
		},
		{
			name: 'loop',
			type: 'boolean',
			default: 'false',
			description:
				'Whether or not the combobox should loop through the list when the end or beginning is reached.',
		},
		{
			name: 'scrollAlignment',
			type: ['"nearest"', '"center"'],
			default: '"nearest"',
			description: 'The alignment of the highlighted item when scrolling.',
		},
	],
};

const input: APISchema = {
	title: 'input',
	description:
		'The element that opens, closes, filters the list, and displays the selected value from the list.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('`select`'),
		},
		{
			name: 'data-melt-combobox-input',
			value: ATTRS.MELT('input'),
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'The menu item element',
	props: [
		{
			name: 'label',
			type: 'string',
			description: 'The label of the `item`.',
		},
		{
			name: 'value',
			type: 'unknown',
			description: 'The value of the `item`.',
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the `item` is disabled.',
		},
	],
	dataAttributes: [
		{
			name: 'data-melt-combobox-item',
			value: ATTRS.MELT('item'),
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('`item`'),
		},
		{
			name: 'data-index',
			value: 'The index of the item in the list.',
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED(),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'An optional arrow element',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-combobox-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.ENTER,
		behavior: 'selects the highlighted list item.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Highlights the next list item.',
	},
	// {
	// 	key: 'PageDown',
	// 	behavior: 'Highlights 10 list items down (or the end of the list).',
	// },
	{
		key: KBD.ARROW_UP,
		behavior: 'Highlights the previous list item.',
	},
	// {
	// 	key: 'PageUp',
	// 	behavior: 'Highlights 10 list items up (or the top of the list).',
	// },
	{
		key: KBD.HOME,
		behavior: 'Highlights the first list item',
	},
	{
		key: KBD.END,
		behavior: 'Highlights the last list item',
	},
	{
		key: KBD.ESCAPE,
		behavior:
			"When focus is on the `input` and it's closed, removes focus. When the `input` is open, closes the list.",
	},
];

const schemas = {
	builder,
	input,
	item,
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
