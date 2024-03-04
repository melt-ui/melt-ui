import { PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { contextMenuEvents } from '$lib/builders/context-menu/events.js';
import type { BuilderData } from './index.js';
import {
	getMenuBuilderReturns,
	getMenuKeyboardSchema,
	getMenuSchemas,
	getMenuTriggerDataAttrs,
	menuBuilderProps,
} from './menu.js';

const BUILDER_NAME = 'context menu';
const { elements, builders, states, options } = getMenuBuilderReturns(BUILDER_NAME);

const builder = builderSchema(BUILDER_NAME, {
	title: 'createContextMenu',
	props: [...menuBuilderProps, PROPS.POSITIONING({ default: "placement: 'right'" })],
	elements,
	builders,
	states,
	options,
});

const {
	menu,
	arrow,
	item,
	checkboxItem,
	radioGroupBuilder,
	checkboxItemBuilder,
	radioGroup,
	radioItem,
	separator,
	submenuBuilder,
	submenu,
	subTrigger,
	group,
	groupLabel,
	overlay,
} = getMenuSchemas(BUILDER_NAME);

const TRIGGER_NAME = 'trigger' as const;
const trigger = elementSchema(TRIGGER_NAME, {
	description: 'The element which when right clicked inside, opens the context menu.',
	dataAttributes: getMenuTriggerDataAttrs(BUILDER_NAME),
	events: contextMenuEvents[TRIGGER_NAME],
});

const keyboard: KeyboardSchema = getMenuKeyboardSchema();

const schemas = [
	builder,
	trigger,
	menu,
	item,
	overlay,
	separator,
	arrow,
	checkboxItemBuilder,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	group,
	groupLabel,
	submenuBuilder,
	subTrigger,
	submenu,
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
