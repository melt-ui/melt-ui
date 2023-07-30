import { ATTRS, DESCRIPTIONS, KBD, SEE } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

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
		{
			name: 'defaultOpen',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the combobox is open by default.',
		},
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls whether or not the combobox is open.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onOpenChange',
			type: 'ChangeFn<boolean>',
			description: 'A callback called when the value of the `open` store should be changed.',
			see: SEE.CHANGE_FUNCTIONS,
		},
		{
			name: 'closeOnOutsideClick',
			type: 'boolean',
			default: 'true',
			description:
				'Whether or not the combobox should close when clicking outside of the combobox.',
		},
		{
			name: 'closeOnEscape',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not the combobox should close when pressing the escape key.',
		},
		{
			name: 'preventScroll',
			type: 'boolean',
			default: 'true',
			description: 'Whether or not to prevent scrolling the body when the combobox menu is open.',
		},
		{
			name: 'portal',
			type: 'string | HTMLElement',
			description: 'The element to render the combobox menu into.',
			default: 'body',
		},
		{
			name: 'forceVisible',
			type: 'boolean',
			description:
				'Whether or not to force the combobox menu to be visible. This is useful for custom transitions and animations.',
			default: 'false',
		},
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
		{
			name: 'loop',
			type: 'Writable<boolean>',
			description:
				'Whether or not the combobox should loop through the list when the end or beginning is reached.',
		},
		{
			name: 'portal',
			type: 'Writable<string | HTMLElement>',
			description: 'The element to render the combobox menu into.',
		},
		{
			name: 'forceVisible',
			type: 'Writable<boolean>',
			description:
				'Whether or not to force the combobox menu to be visible. This is useful for custom transitions and animations.',
		},
		{
			name: 'itemToString',
			type: 'Writable<(item: T) => string>',
			description: 'A function that returns a string representation of the item.',
		},
		{
			name: 'closeOnEscape',
			type: 'Writable<boolean>',
			description: 'Whether or not the combobox should close when pressing the escape key.',
		},
		{
			name: 'preventScroll',
			type: 'Writable<boolean>',
			description: 'Whether or not to prevent scrolling the body when the combobox menu is open.',
		},
		{
			name: 'filterFunction',
			type: 'Writable<(item: T, inputValue: string)>',
			description:
				'A function that returns `true` if the item should be included in the filtered list.',
		},
		{
			name: 'scrollAlignment',
			type: 'Writable<"nearest" | "center">',
			description: 'The alignment of the highlighted item when scrolling.',
		},
		{
			name: 'closeOnOutsideClick',
			type: 'Writable<boolean>',
			description:
				'Whether or not the combobox should close when clicking outside of the combobox.',
		},
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
