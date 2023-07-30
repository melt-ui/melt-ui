import { ATTRS, DESCRIPTIONS, KBD, PROPS, propToOption } from '$docs/constants';
import type { APISchema, KeyboardSchema, Prop } from '$docs/types';
import type { BuilderData } from '.';

const FILTER_FUNCTION: Prop = {
	name: 'filterFunction',
	type: '(item: T, inputValue: string)',
	description:
		'A function that returns `true` if the item should be included in the filtered list.',
};

const ITEM_TO_STRING: Prop = {
	name: 'itemToString',
	type: '(item: T)',
	description: 'A function that returns a string representation of the item.',
};

const SCROLL_ALIGNMENT: Prop = {
	name: 'scrollAlignment',
	type: ['"nearest"', '"center"'],
	default: '"nearest"',
	description: 'The alignment of the highlighted item when scrolling.',
};

const builder: APISchema = {
	title: 'createCombobox',
	description: DESCRIPTIONS.BUILDER('combobox'),
	props: [
		{
			name: 'items',
			type: 'T[]',
			description: 'The list of items to display in the combobox list.',
		},
		FILTER_FUNCTION,
		ITEM_TO_STRING,
		SCROLL_ALIGNMENT,
		PROPS.DEFAULT_OPEN({ name: 'combobox menu' }),
		PROPS.OPEN({ name: 'combobox menu' }),
		PROPS.ON_OPEN_CHANGE,
		PROPS.LOOP({ name: 'combobox' }),
		PROPS.CLOSE_ON_OUTSIDE_CLICK({ name: 'combobox menu' }),
		PROPS.CLOSE_ON_ESCAPE({ name: 'combobox menu' }),
		PROPS.PREVENT_SCROLL({ name: 'combobox menu' }),
		PROPS.PORTAL({ name: 'combobox menu' }),
		PROPS.POSITIONING({ name: 'combobox menu' }),
		PROPS.FORCE_VISIBLE({ name: 'combobox menu' }),
	],
	elements: [
		{
			name: 'menu',
			description: 'The builder store used to create the collapsible menu.',
			link: '#menu',
		},
		{
			name: 'input',
			description: 'The builder store used to create the collapsible input.',
			link: '#input',
		},
		{
			name: 'item',
			description: 'The builder store used to create the menu item.',
			link: '#item',
		},
		{
			name: 'label',
			description: 'The builder store used to create the label for the combobox.',
			link: '#label',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls whether or not the combobox is open.',
		},
		{
			name: 'inputValue',
			type: 'Writable<string>',
			description: 'A writable store that controls the value of the input.',
		},
		{
			name: 'filteredItems',
			type: 'Readable<T[]>',
			description: 'A derived store that returns the filtered list of items.',
		},
		{
			name: 'selectedItem',
			type: 'Writable<T>',
			description: 'A writable store that controls the selected item.',
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
	options: [
		propToOption(PROPS.LOOP({ name: 'combobox' })),
		propToOption(PROPS.CLOSE_ON_OUTSIDE_CLICK({ name: 'combobox menu' })),
		propToOption(PROPS.CLOSE_ON_ESCAPE({ name: 'combobox menu' })),
		propToOption(PROPS.PREVENT_SCROLL({ name: 'combobox menu' })),
		propToOption(PROPS.PORTAL({ name: 'combobox menu' })),
		propToOption(PROPS.POSITIONING({ name: 'combobox menu' })),
		propToOption(PROPS.FORCE_VISIBLE({ name: 'combobox menu' })),
		propToOption(ITEM_TO_STRING),
		propToOption(FILTER_FUNCTION),
		propToOption(SCROLL_ALIGNMENT),
	],
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
