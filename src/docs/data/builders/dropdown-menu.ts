import { PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { dropdownMenuEvents } from '$lib/builders/dropdown-menu/events.js';
import type { BuilderData } from './index.js';
import {
	getMenuBuilderReturns,
	getMenuKeyboardSchema,
	getMenuSchemas,
	getMenuTriggerDataAttrs,
	menuBuilderProps,
} from './menu.js';

const BUILDER_NAME = 'dropdown menu';

const {
	menu,
	arrow,
	item,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	separator,
	submenuBuilder,
	submenu,
	subTrigger,
	checkboxItemBuilder,
	group,
	groupLabel,
	overlay,
} = getMenuSchemas(BUILDER_NAME);

const { elements, builders, states, options } = getMenuBuilderReturns(BUILDER_NAME);

export const builder = builderSchema(BUILDER_NAME, {
	title: 'createDropdownMenu',
	props: [...menuBuilderProps, PROPS.POSITIONING({ default: "placement: 'bottom'" })],
	elements,
	states,
	builders,
	options,
});

const TRIGGER_NAME = 'trigger' as const;

const trigger = elementSchema(TRIGGER_NAME, {
	description: `The button which toggles the ${BUILDER_NAME}.`,
	dataAttributes: getMenuTriggerDataAttrs(BUILDER_NAME),
	events: dropdownMenuEvents[TRIGGER_NAME],
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

export const dropdownMenuData: BuilderData = {
	schemas,
	features,
	keyboard,
};
