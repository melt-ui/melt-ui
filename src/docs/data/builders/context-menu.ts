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

const BUILDER_NAME = 'context menu';
const { elements, builders, states, options } = getMenuBuilderReturns(BUILDER_NAME);

const builder: APISchema = {
	title: 'createContextMenu',
	description: DESCRIPTIONS.BUILDER(BUILDER_NAME),
	props: genProps(BUILDER_NAME, [
		...menuBuilderProps,
		PROPS.POSITIONING({ default: "placement: 'right'" }),
	]),
	elements,
	builders,
	states,
	options,
};

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
} = getMenuSchemas(BUILDER_NAME);

const trigger: APISchema = {
	title: 'trigger',
	description: 'The element which when right clicked inside, opens the context menu.',
	dataAttributes: getMenuTriggerDataAttrs('trigger'),
};

const keyboard: KeyboardSchema = getMenuKeyboardSchema();

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
