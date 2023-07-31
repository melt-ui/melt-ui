import { PROPS } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema } from '$docs/utils/content';
import type { BuilderData } from '.';
import {
	getMenuBuilderReturns,
	getMenuKeyboardSchema,
	getMenuSchemas,
	getMenuTriggerDataAttrs,
	menuBuilderProps,
} from './menu';

const BUILDER_NAME = 'dropdown menu';

const {
	menu,
	arrow,
	item,
	checkboxItem,
	checkboxItemBuilder,
	radioGroupBuilder,
	radioGroup,
	radioItem,
	separator,
	submenuBuilder,
	submenu,
	subTrigger,
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

const trigger = elementSchema(BUILDER_NAME, {
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: getMenuTriggerDataAttrs(BUILDER_NAME),
});

const keyboard: KeyboardSchema = getMenuKeyboardSchema();

const schemas = [
	builder,
	trigger,
	menu,
	item,
	separator,
	arrow,
	checkboxItemBuilder,
	checkboxItem,
	radioGroupBuilder,
	radioGroup,
	radioItem,
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
