import { ATTRS, DESCRIPTIONS, KBD, PROPS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';
import { getMenuArrowSchema } from './menu';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'filterFunction',
		type: '(item: T, inputValue: string)',
		description:
			'A function that returns `true` if the item should be included in the filtered list.',
	},
	{
		name: 'itemToString',
		type: '(item: T)',
		description: 'A function that returns a string representation of the item.',
	},
	{
		name: 'scrollAlignment',
		type: ['"nearest"', '"center"'],
		default: '"nearest"',
		description: 'The alignment of the highlighted item when scrolling.',
	},
	PROPS.LOOP,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.PREVENT_SCROLL,
	PROPS.PORTAL,
	PROPS.POSITIONING,
	PROPS.FORCE_VISIBLE,
];

const builder: APISchema = {
	title: 'createCombobox',
	description: DESCRIPTIONS.BUILDER('combobox'),
	isBuilder: true,
	props: genProps('combobox menu', [
		{
			name: 'items',
			type: 'T[]',
			description: 'The list of items to display in the combobox list.',
		},
		...OPTION_PROPS,
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
	]),
	elements: genElements('combobox', [
		{
			name: 'menu',
			description: 'The builder store used to create the collapsible menu.',
		},
		{
			name: 'input',
			description: 'The builder store used to create the collapsible input.',
		},
		{
			name: 'item',
			description: 'The builder store used to create the menu item.',
		},
		{
			name: 'label',
			description: 'The builder store used to create the label for the combobox.',
		},
	]),
	states: [
		{
			name: 'open',
			type: 'Readable<boolean>',
			description: 'A readable store with the open state of the combobox menu.',
		},
		{
			name: 'inputValue',
			type: 'Readable<string>',
			description: 'A readable store with the value of the input.',
		},
		{
			name: 'filteredItems',
			type: 'Readable<T[]>',
			description: 'A readable store whose value is the filtered list of items.',
		},
		{
			name: 'selectedItem',
			type: 'Readable<T>',
			description: 'A readable store whose value is the selected item.',
		},
	],
	helpers: [
		{
			name: 'isSelected',
			type: 'Readable<(item: T) => boolean>',
			description:
				'A derived store that returns a function that returns whether or not the item is selected.',
		},
		{
			name: 'updateItems',
			type: 'UpdaterFunction: (items: T[]) => T[]',
			description: 'A function that updates the list of items.',
		},
	],
	options: propsToOptions('combobox menu', OPTION_PROPS),
};

const menu: APISchema = {
	title: 'menu',
	description: 'The combobox menu element',
	dataAttributes: [
		{
			name: 'data-melt-combobox-menu',
			value: ATTRS.MELT('menu'),
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
			name: 'item',
			type: 'T',
			description: 'The item that the option represents.',
		},
		{
			name: 'index',
			type: 'number',
			description: 'The array index of the item.',
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
			name: 'data-index',
			value: 'The index of the item in the list.',
		},
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('`item`'),
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED(),
		},
		{
			name: 'data-melt-combobox-item',
			value: ATTRS.MELT('item'),
		},
	],
};

const label: APISchema = {
	title: 'label',
	description: 'The label element for the combobox',
	dataAttributes: [
		{
			name: 'data-melt-combobox-label',
			value: ATTRS.MELT('combobox label'),
		},
	],
};

const arrow: APISchema = getMenuArrowSchema('combobox');

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

const schemas = [builder, menu, input, item, label, arrow];

const features = [
	'Full keyboard navigation',
	'Updatable data source',
	'Can be controlled or uncontrolled',
	'Custom positioning',
];

export const comboboxData: BuilderData = {
	schemas,
	features,
	keyboard,
};
