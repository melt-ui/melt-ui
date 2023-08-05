import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants.js';
import type { APISchema, KeyboardSchema } from '$docs/types.js';
import {
	toKebabCase,
	builderSchema,
	elementSchema,
	genElements,
	genProps,
	propsToOptions,
} from '$docs/utils/index.js';

import { menuEvents } from '$lib/builders/menu/events.js';

export const menuBuilderProps = [
	PROPS.ARROW_SIZE,
	PROPS.DIR,
	PROPS.PREVENT_SCROLL,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.PORTAL,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.LOOP,
	PROPS.FORCE_VISIBLE,
	PROPS.DEFAULT_OPEN,
	PROPS.OPEN,
	PROPS.ON_OPEN_CHANGE,
];

export const menuBuilderOptions = [
	PROPS.POSITIONING(),
	PROPS.ARROW_SIZE,
	PROPS.DIR,
	PROPS.PREVENT_SCROLL,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.PORTAL,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.LOOP(),
	PROPS.FORCE_VISIBLE,
];

export function getMenuSchemas(name: string) {
	return {
		menu: getMenuMenuSchema(name),
		arrow: getMenuArrowSchema(name),
		submenuBuilder: getMenuSubmenuBuilderSchema(),
		submenu: getMenuSubmenuSchema(name),
		subTrigger: getMenuSubTriggerSchema(name),
		radioGroupBuilder: getMenuRadioGroupBuilderSchema(),
		radioGroup: getMenuRadioGroupSchema(name),
		radioItem: getMenuRadioItemSchema(name),
		separator: getMenuSeparatorSchema(name),
		item: getMenuItemSchema(name),
		checkboxItemBuilder: getMenuCreateCheckboxItemSchema(),
		checkboxItem: getMenuCheckboxItemSchema(name),
	};
}

export function getMenuBuilderReturns(name: string) {
	return {
		elements: getMenuBuilderEls(name),
		builders: getMenuBuilderBuilders(name),
		states: getMenuBuilderStates(name),
		options: menuBuilderOptions,
	};
}

function getMenuBuilderEls(name = 'menu') {
	return [
		{
			name: 'menu',
			description: `The builder store used to create the ${name}.`,
		},
		{
			name: 'trigger',
			description: `The builder store used to create the ${name} trigger.`,
		},
		{
			name: 'separator',
			description: 'The builder store used to create a separator menu item.',
		},
		{
			name: 'arrow',
			description: `The builder store used to create the ${name} arrow.`,
		},
	];
}

const CHECKBOX_ITEM_OPTION_PROPS = [PROPS.DISABLED];

function getMenuCreateCheckboxItemSchema(): APISchema {
	return {
		title: 'createCheckboxItem',
		isBuilder: true,
		description: 'The builder function used to create checkbox items for menu elements',
		props: genProps('menu checkbox item', [
			...CHECKBOX_ITEM_OPTION_PROPS,
			{
				name: 'defaultChecked',
				type: 'boolean',
				description: 'Whether the checkbox is checked by default.',
			},
			{
				name: 'checked',
				type: 'Writable<boolean>',
				description: 'A writable store that controls the checked state of the checkbox.',
				see: SEE.BRING_YOUR_OWN_STORE,
			},
			{
				name: 'onCheckedChange',
				type: 'ChangeFn<boolean>',
				description: 'A function that is called when the checked state of the checkbox changes.',
				see: SEE.BRING_YOUR_OWN_STORE,
			},
		]),
		elements: genElements('submenu', [
			{
				name: 'checkboxItem',
				description: 'The builder store used to create a menu checkbox item.',
			},
		]),
		states: [
			{
				name: 'checked',
				type: 'Writable<boolean>',
				description: 'A writable store with the checked state of the checkbox item.',
			},
		],
		options: propsToOptions('submenu', CHECKBOX_ITEM_OPTION_PROPS),
	};
}

function getMenuBuilderBuilders(name = 'menu') {
	return [
		{
			name: 'createSubmenu',
			description: `A builder function used to create a submenu for the ${name}.`,
		},
		{
			name: 'createRadioGroup',
			description: `A builder function used to create a radio group for the ${name}.`,
		},
		{
			name: 'createCheckboxItem',
			description: `A builder function used to create a checkbox menu item for the ${name}.`,
		},
	];
}
function getMenuBuilderStates(name = 'menu') {
	return [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: `A writable store that indicates whether the ${name} is open.`,
		},
	];
}

export function getMenuTriggerDataAttrs(name: string) {
	return [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: `data-melt-context-menu-${name}`,
			value: ATTRS.MELT(name),
		},
	];
}

function getMenuMenuSchema(name: string) {
	return elementSchema('menu', {
		description: `The element which wraps the entire ${name}.`,
		dataAttributes: [
			{
				name: 'data-state',
				value: ATTRS.OPEN_CLOSED,
			},
			{
				name: `data-melt-${name.split(' ').join('-').toLowerCase()}`,
				value: ATTRS.MELT(name),
			},
		],
		events: menuEvents['menu'],
	});
}

export function getMenuArrowSchema(name: string) {
	return elementSchema('arrow', {
		description: `An optional arrow element which points to the ${name} trigger.`,
		dataAttributes: [
			{
				name: 'data-arrow',
				value: ATTRS.TRUE,
			},
			{
				name: `data-melt-${toKebabCase(name)}-arrow`,
				value: ATTRS.MELT('arrow'),
			},
		],
	});
}
function getMenuItemSchema(name: string) {
	return elementSchema('item', {
		description: 'A basic menu item.',
		props: [PROPS.DISABLED],
		dataAttributes: [
			{
				name: 'data-orientation',
				value: ATTRS.ORIENTATION,
			},
			{
				name: `data-${toKebabCase(name)}-item`,
				value: ATTRS.MELT('item'),
			},
			{
				name: 'data-highlighted',
				value: ATTRS.HIGHLIGHTED('item'),
			},
		],
		events: menuEvents['item'],
	});
}

function getMenuRadioGroupBuilderSchema(): APISchema {
	return builderSchema('radio group', {
		title: 'createRadioGroup',
		props: [
			{
				name: 'defaultValue',
				type: 'string',
				description: 'The value of the radio item to be selected by default.',
			},
			{
				name: 'value',
				type: 'Writable<string | null>',
				description:
					'A writable store which controls the value of the selected radio item. This will override the `defaultValue` prop if both are provided, so ensure to set your preferred default value as the default value of the store.',
				see: SEE.BRING_YOUR_OWN_STORE,
			},
			{
				name: 'onValueChange',
				type: 'ChangeFn<string | null>',
				description: DESCRIPTIONS.ON_CHANGE('value'),
				see: SEE.CHANGE_FUNCTIONS,
			},
		],
		elements: [
			{
				name: 'radioGroup',
				description: 'The builder store used to create the radio group.',
			},
			{
				name: 'radioItem',
				description: 'The builder store used to create a radio menu item.',
			},
		],
		helpers: [
			{
				name: 'isChecked',
				type: 'Readable<(itemValue: string) => boolean>',
				description:
					'A derived store which returns a function that checks if a radio item is selected.',
			},
		],
		states: [
			{
				name: 'value',
				type: 'Writable<string | null>',
				description: 'A writable store containing the current value of the radio group.',
			},
		],
	});
}

export function getMenuSeparatorSchema(name: string) {
	return elementSchema('separator', {
		description: 'A horizontal line which separates menu items.',
		dataAttributes: [
			{
				name: `data-melt-${toKebabCase(name)}-separator`,
				value: ATTRS.MELT('separator'),
			},
		],
	});
}

function getMenuSubmenuBuilderSchema() {
	return builderSchema('submenu', {
		title: 'createSubMenu',
		description: 'The builder function used to create submenus for context & dropdown menus.',
		props: [
			PROPS.POSITIONING({ default: 'placement: "right-start"' }),
			PROPS.ARROW_SIZE,
			PROPS.DISABLED({ name: 'submenu' }),
		],
		elements: [
			{
				name: 'subMenu',
				description: 'The builder store used to create the submenu.',
			},
			{
				name: 'subTrigger',
				description: 'The builder store used to create the submenu trigger.',
			},
			{
				name: 'arrow',
				description: 'The builder store used to create the submenu arrow.',
			},
		],
		states: [
			{
				name: 'subOpen',
				type: 'Writable<boolean>',
				description: 'A writable store with the open state of the submenu.',
			},
		],
		options: [PROPS.POSITIONING(), PROPS.ARROW_SIZE, PROPS.DISABLED],
	});
}

function getMenuSubmenuSchema(name: string) {
	return elementSchema('submenu', {
		description: 'A submenu element displayed when its trigger is selected.',
		dataAttributes: [
			{
				name: 'data-state',
				value: ATTRS.OPEN_CLOSED,
			},
			{
				name: `data-melt-${toKebabCase(name)}-submenu`,
				value: ATTRS.MELT('submenu'),
			},
		],
		events: menuEvents['submenu'],
	});
}

function getMenuCheckboxItemSchema(name: string) {
	return elementSchema('checkboxItem', {
		description: 'A checkbox menu item.',
		props: [PROPS.DISABLED],
		dataAttributes: [
			{
				name: 'data-orientation',
				value: ATTRS.ORIENTATION,
			},
			{
				name: `data-melt-${toKebabCase(name)}-checkbox-item`,
				value: ATTRS.MELT('checkbox item'),
			},
			{
				name: 'data-highlighted',
				value: ATTRS.HIGHLIGHTED('checkbox item'),
			},
		],
		events: menuEvents['checkboxItem'],
	});
}

function getMenuRadioItemSchema(name: string) {
	return elementSchema('radioItem', {
		description: 'A radiogroup menu item.',
		props: [
			{
				name: 'value',
				type: 'string',
				description: 'The value of the radio item.',
				required: true,
			},
			PROPS.DISABLED,
		],
		dataAttributes: [
			{
				name: 'data-checked',
				value: ATTRS.CHECKED_UNCHECKED,
			},
			{
				name: 'data-disabled',
				value: ATTRS.DISABLED('radio item'),
			},
			{
				name: 'data-value',
				value: 'The value of the radio item.',
			},
			{
				name: 'data-orientation',
				value: ATTRS.ORIENTATION,
			},
			{
				name: `data-melt-${toKebabCase(name)}-radio-item`,
				value: ATTRS.MELT('radio item'),
			},
			{
				name: 'data-highlighted',
				value: ATTRS.HIGHLIGHTED('radio item'),
			},
		],
		events: menuEvents['radioItem'],
	});
}

function getMenuRadioGroupSchema(name: string): APISchema {
	return elementSchema('radioGroup', {
		description: 'A group of radio menu items.',
		dataAttributes: [
			{
				name: `data-melt-${toKebabCase(name)}-radio-group`,
				value: ATTRS.MELT('radio group'),
			},
		],
	});
}

function getMenuSubTriggerSchema(name: string) {
	return elementSchema('subTrigger', {
		description: 'A button which opens its associated submenu.',
		props: [PROPS.DISABLED],
		dataAttributes: [
			{
				name: 'data-state',
				value: ATTRS.OPEN_CLOSED,
			},
			{
				name: 'data-disabled',
				value: ATTRS.DISABLED('subtrigger'),
			},
			{
				name: `data-melt-${toKebabCase(name)}-subtrigger`,
				value: ATTRS.MELT('subtrigger'),
			},
			{
				name: 'data-highlighted',
				value: ATTRS.HIGHLIGHTED('subtrigger'),
			},
		],
		events: menuEvents['subTrigger'],
	});
}

export function getMenuKeyboardSchema(): KeyboardSchema {
	return [
		{
			key: KBD.SPACE,
			behavior:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
		},
		{
			key: KBD.ENTER,
			behavior:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item.',
		},
		{
			key: KBD.ARROW_DOWN,
			behavior:
				'When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item.',
		},
		{
			key: KBD.ARROW_UP,
			behavior: 'When focused on an `item`, shifts focus to the next item..',
		},
		{
			key: KBD.ARROW_RIGHT,
			behavior: 'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item.',
		},
		{
			key: KBD.ARROW_LEFT,
			behavior:
				"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`.",
		},
		{
			key: KBD.ESCAPE,
			behavior: 'Closes the dropdown menu and focuses the `trigger`.',
		},
	];
}
