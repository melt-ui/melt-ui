import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE, TYPES, propToOption } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createContextMenu',
	description: DESCRIPTIONS.BUILDER('context menu'),
	props: [
		PROPS.POSITIONING({ default: "placement: 'right'" }),
		PROPS.ARROW_SIZE,
		PROPS.DIR({ name: 'context menu' }),
		PROPS.PREVENT_SCROLL({ name: 'context menu' }),
		PROPS.CLOSE_ON_ESCAPE({ name: 'context menu' }),
		PROPS.PORTAL({ name: 'context menu' }),
		PROPS.CLOSE_ON_OUTSIDE_CLICK({ name: 'context menu' }),
		PROPS.LOOP(),
		PROPS.FORCE_VISIBLE({ name: 'context menu' }),
		PROPS.DEFAULT_OPEN({ name: 'context menu' }),
		PROPS.OPEN({ name: 'context menu' }),
		PROPS.ON_OPEN_CHANGE,
	],
	elements: [
		{
			name: 'menu',
			description: 'The builder store used to create the context menu.',
			link: '#menu',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the context menu trigger.',
			link: '#trigger',
		},
		{
			name: 'checkboxItem',
			description: 'The builder store used to create a checkbox menu item.',
			link: '#checkboxitem',
		},
		{
			name: 'separator',
			description: 'The builder store used to create a separator menu item.',
			link: '#separator',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the context menu arrow.',
			link: '#arrow',
		},
	],
	builders: [
		{
			name: 'createSubmenu',
			description: 'A builder function used to create a submenu.',
			link: '#createsubmenu',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Readable<boolean>',
			description: 'A readable store that indicates whether the context menu is open.',
		},
	],
	options: [
		propToOption(PROPS.POSITIONING()),
		propToOption(PROPS.ARROW_SIZE),
		propToOption(PROPS.DIR({ name: 'context menu' })),
		propToOption(PROPS.PREVENT_SCROLL({ name: 'context menu' })),
		propToOption(PROPS.CLOSE_ON_ESCAPE({ name: 'context menu' })),
		propToOption(PROPS.PORTAL({ name: 'context menu' })),
		propToOption(PROPS.CLOSE_ON_OUTSIDE_CLICK({ name: 'context menu' })),
		propToOption(PROPS.LOOP()),
		propToOption(PROPS.FORCE_VISIBLE({ name: 'context menu' })),
	],
};

const menu: APISchema = {
	title: 'menu',
	description: 'The element which wraps the entire dropdown menu.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-context-menu',
			value: ATTRS.MELT('context-menu'),
		},
	],
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which when right clicked inside, opens the context menu.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-context-menu-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
};

const arrow: APISchema = {
	title: 'arrow',
	description: 'An optional arrow element which points to the trigger.',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-context-menu-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
};

const item: APISchema = {
	title: 'item',
	description: 'A basic menu item.',
	props: [
		{
			name: 'onSelect',
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-context-menu-item',
			value: ATTRS.MELT('item'),
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('item'),
		},
	],
};

const checkboxItem: APISchema = {
	title: 'checkboxItem',
	description: 'A checkbox menu item.',
	props: [
		{
			name: 'checked',
			type: 'Writable<boolean>',
			description: 'A writable store which controls the checked state of the checkbox item.',
		},
		{
			name: 'onSelect',
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
	],
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-context-menu-checkbox-item',
			value: ATTRS.MELT('checkbox item'),
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('checkbox item'),
		},
	],
};

const radioGroupBuilder: APISchema = {
	title: 'createMenuRadioGroup',
	description: 'The configuration object passed to the `createMenuRadioGroup` builder function.',
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
	elements: [],
	helpers: [],
	states: [],
	returnedProps: [
		{
			name: 'value',
			type: 'Writable<string | null>',
			description: 'A writable store which controls the value of the selected radio item.',
		},
		{
			name: 'isChecked',
			type: 'Readable<(itemValue: string) => boolean>',
			description:
				'A derived store which returns a function that checks if a radio item is selected.',
		},
		{
			name: 'radioGroup',
			description: 'The builder store used to create the radio group.',
			link: '#radiogroup',
		},
		{
			name: 'radioItem',
			description: 'The builder store used to create a radio menu item.',
			link: '#radioitem',
		},
	],
};

const radioGroup: APISchema = {
	title: 'radioGroup',
	description: 'A group of radio menu items.',
	dataAttributes: [
		{
			name: 'data-melt-context-menu-radio-group',
			value: ATTRS.MELT('radio group'),
		},
	],
};

const radioItem: APISchema = {
	title: 'radioItem',
	description: 'A radiogroup menu item.',
	props: [
		{
			name: 'value',
			type: 'string',
			description: 'The value of the radio item.',
			required: true,
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the radio item is disabled.',
		},
		{
			name: 'onSelect',
			type: TYPES.EVENT_HANDLER,
			description: DESCRIPTIONS.ON_SELECT,
		},
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
			name: 'data-melt-context-menu-radio-item',
			value: ATTRS.MELT('radio item'),
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('radio item'),
		},
	],
};

const separator: APISchema = {
	title: 'separator',
	description: 'A horizontal line which separates menu items.',
	dataAttributes: [
		{
			name: 'data-melt-context-menu-separator',
			value: ATTRS.MELT('separator'),
		},
	],
};

const submenuBuilder: APISchema = {
	title: 'createSubMenu',
	description: 'The configuration object passed to the `createDropdownSubMenu` builder function.',
	props: [
		PROPS.POSITIONING({ default: 'placement: "right-start"' }),
		PROPS.ARROW_SIZE,
		PROPS.DISABLED({ name: 'submenu' }),
	],
	elements: [
		{
			name: 'subMenu',
			description: 'The builder store used to create the submenu.',
			link: '#menu',
		},
		{
			name: 'subTrigger',
			description: 'The builder store used to create the submenu trigger.',
			link: '#trigger',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the submenumenu arrow.',
			link: '#arrow',
		},
	],
	states: [
		{
			name: 'subOpen',
			type: 'Readable<boolean>',
			description: 'A readable store with the open state of the submenu.',
		},
	],
	options: [
		propToOption(PROPS.POSITIONING({ default: 'placement: "right-start"' })),
		propToOption(PROPS.ARROW_SIZE),
		propToOption(PROPS.DISABLED({ name: 'submenu' })),
	],
};

const submenu: APISchema = {
	title: 'submenu',
	description: 'A submenu element displayed when its trigger is selected.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-context-menu-submenu',
			value: ATTRS.MELT('submenu'),
		},
	],
};

const subTrigger: APISchema = {
	title: 'subTrigger',
	description: 'A button which opens its associated submenu.',
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
			name: 'data-melt-context-menu-subtrigger',
			value: ATTRS.MELT('subtrigger'),
		},
		{
			name: 'data-highlighted',
			value: ATTRS.HIGHLIGHTED('subtrigger'),
		},
	],
};

const keyboard: KeyboardSchema = [
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

const schemas = [
	builder,
	trigger,
	menu,
	item,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	submenuBuilder,
	subTrigger,
	submenu,
	separator,
	arrow,
];

const features = [
	'Can be controlled or uncontrolled.',
	'Supports submenus with configurable reading direction.',
	'Customize menu positioning.',
	'Optionally render a pointing arrow.',
	'Fully managed focus.',
	'Full keyboard navigation.',
	'Typeahead support',
];

export const contextMenuData: BuilderData = {
	schemas,
	features,
	keyboard,
};
