import { DESCRIPTIONS, PROPS } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genProps } from '$docs/utils/content';
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

export const builder: APISchema = {
	title: 'createDropdownMenu',
	description: DESCRIPTIONS.BUILDER(BUILDER_NAME),
	props: genProps(BUILDER_NAME, [
		...menuBuilderProps,
		PROPS.POSITIONING({ default: "placement: 'bottom'" }),
	]),
	elements,
	states,
	builders,
	options,
};

const trigger: APISchema = {
	title: 'trigger',
	description: 'The button which toggles the dropdown menu.',
	dataAttributes: getMenuTriggerDataAttrs(BUILDER_NAME),
};

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
