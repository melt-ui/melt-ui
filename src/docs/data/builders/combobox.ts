import { ATTRS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { comboboxEvents } from '$lib/builders/combobox/events.js';
import type { BuilderData } from './index.js';
import { getMenuArrowSchema } from './menu.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'filterFunction',
		type: '({ itemValue: T; input: string; })',
		description:
			'A function that returns `true` if the item should be included in the filtered list.',
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

const BUILDER_NAME = 'combobox';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createCombobox',
	props: [
		{
			name: 'defaultValue',
			type: 'T',
			description: 'The initial value of the select.',
		},
		{
			name: 'value',
			type: 'Writable<T>',
			description: 'A writable store that can be used to get or update or the select value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<T>',
			description: 'A callback that is called when the value of the select changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
		...OPTION_PROPS,
	],
	elements: [
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
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store with the open state of the combobox menu.',
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
			name: 'value',
			type: 'Writable<T>',
			description: 'A writable store whose value is the selected item.',
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
	options: OPTION_PROPS,
});

const menu = elementSchema('menu', {
	description: 'The combobox menu element',
	dataAttributes: [
		{
			name: 'data-melt-combobox-menu',
			value: ATTRS.MELT('menu'),
		},
	],
	events: comboboxEvents['menu'],
});

const input = elementSchema('input', {
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
	events: comboboxEvents['input'],
});

const item = elementSchema('item', {
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
	events: comboboxEvents['item'],
});

const label = elementSchema('label', {
	description: 'The label element for the combobox',
	dataAttributes: [
		{
			name: 'data-melt-combobox-label',
			value: ATTRS.MELT('combobox label'),
		},
	],
});

const arrow = getMenuArrowSchema(BUILDER_NAME);

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
