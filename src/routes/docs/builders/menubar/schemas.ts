import type { APISchema } from '$routes/(components)/api.svelte';
import { schemas as menuSchemas } from '$routes/docs/builders/dropdown-menu/schemas';

const builder: APISchema = {
	title: 'CreateMenubarArgs',
	description: 'The configuration object passed to the `createMenubar` builder function.',
	args: [
		{
			label: 'loop',
			type: 'boolean',
			default: 'true',
		},
	],
};

const menuBuilder: APISchema = {
	title: 'CreateMenuArgs',
	description:
		'The configuration object passed to the `createMenu` builder function returned from the `createMenubar` builder function.',
	args: [
		{
			label: 'positioning',
			type: 'FloatingConfig',
			default: "placement: 'bottom'",
		},
		{
			label: 'arrowSize',
			type: 'number',
			default: 8,
		},
		{
			label: 'preventScroll',
			type: 'boolean',
			default: true,
		},
		{
			label: 'loop',
			type: 'boolean',
			default: false,
		},
	],
};

const keyboard: APISchema = {
	title: 'Keyboard Interactions',
	description: '',
	keyboardInteractions: [
		{
			key: 'Space',
			description:
				'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
		},
		{
			key: 'Enter',
			description:
				'When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item.',
		},
		{
			key: 'ArrowDown',
			description:
				'When focused on a `trigger`, opens the associated menu. When focused on an `item`, shifts focus to the next item.',
		},
		{
			key: 'ArrowUp',
			description: 'When focused on an `item`, shifts focus to the next item..',
		},
		{
			key: 'ArrowRight',
			description:
				'When focused on a `subTrigger`, opens the `subMenu` and focuses the first item. When focus is within the menu, opens the next menu in the menubar',
		},
		{
			key: 'ArrowLeft',
			description:
				"When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`. When focus is within the menu, opens the previous menu in the menubar",
		},
		{
			key: 'Esc',
			description: "Closes the open menu and focuses that menu's `trigger`.",
		},
	],
};

export const schemas = {
	builder,
	menuBuilder,
	radioGroup: menuSchemas.radioGroup,
	radioItem: menuSchemas.radioItem,
	radioGroupBuilder: menuSchemas.radioGroupBuilder,
	checkboxItem: menuSchemas.checkboxItem,
	menu: menuSchemas.menu,
	arrow: menuSchemas.arrow,
	item: menuSchemas.item,
	trigger: menuSchemas.trigger,
	keyboard,
	subTrigger: menuSchemas.subTrigger,
	submenu: menuSchemas.submenu,
	submenuBuilder: menuSchemas.submenuBuilder,
	separator: menuSchemas.separator,
};
