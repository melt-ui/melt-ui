import { ATTRS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { comboboxEvents } from '$lib/builders/combobox/events.js';
import { listboxIdParts } from '$lib/builders/listbox/create.js';
import type { BuilderData } from './index.js';
import { getMenuArrowSchema } from './menu.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
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
	{
		name: 'highlightOnHover',
		type: 'boolean',
		default: 'true',
		description:
			'When true, hovering an option will update the `highlightedItem` store, and when the cursor leaves an option the store will be set to `null`',
	},
];

const BUILDER_NAME = 'combobox';

const builder = builderSchema(BUILDER_NAME, {
	ids: listboxIdParts,
	title: 'createCombobox',
	props: [
		{
			name: 'defaultSelected',
			type: 'ComboboxOption<T>',
			description: 'The initial selected item.',
		},
		{
			name: 'selected',
			type: 'Writable<ComboboxOption<T>>',
			description: 'A writable store that can be used to get or update the selected item.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onSelectedChange',
			type: 'ChangeFn<ComboboxOption<T>>',
			description: 'A callback that is called when the selected item changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
		{
			name: 'multiple',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the combobox is a multiple combobox.',
		},
		PROPS.DEFAULT_OPEN,
		PROPS.OPEN,
		PROPS.ON_OPEN_CHANGE,
		...OPTION_PROPS,
		{
			name: 'ids',
			type: 'Record<"trigger" | "content", string>',
			description: 'Override the internally generated ids for the elements.',
		},
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
			type: 'Writable<string>',
			description: 'A readable store with the value of the input.',
		},
		{
			name: 'touchedInput',
			type: 'Writable<boolean>',
			description: `A writable store with the touched state of the input. When the menu closes, the state is reset to \`false\`.
			Whenever a key is pressed into the input, the state is set to \`true\`.`,
		},
		{
			name: 'selected',
			type: 'Writable<T>',
			description: 'A writable store whose value is the selected item.',
		},
		{
			name: 'highlighted',
			type: 'Writable<T>',
			description: 'A writable store whose value is the highlighted item.',
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
			name: 'isHighlighted',
			type: 'Readable<(item: T) => boolean>',
			description:
				'A derived store that returns a function that returns whether or not the item is highlighted.',
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
			name: 'value',
			type: 'T',
			description: 'The value of the item.',
			required: true,
		},
		{
			name: 'label',
			type: 'string',
			description: 'The label of the item. When not present, the text content will be used.',
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
			name: 'data-disabled',
			value: ATTRS.DISABLED('`item`'),
		},
		{
			name: 'data-selected',
			value: ATTRS.SELECTED('`item`'),
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

const hiddenInput = elementSchema('hidden-input', {
	description: 'The hidden input element. Used for form submission.',
	dataAttributes: [
		{
			name: 'data-melt-combobox-hidden-input',
			value: ATTRS.MELT('hidden-input'),
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

const schemas = [builder, menu, input, item, label, arrow, hiddenInput];

const features = [
	'Full keyboard navigation',
	'Declarative API',
	'Can be controlled or uncontrolled',
	'Custom positioning',
];

export const comboboxData: BuilderData = {
	schemas,
	features,
	keyboard,
};
