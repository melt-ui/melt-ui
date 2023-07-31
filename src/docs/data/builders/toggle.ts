import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [PROPS.DISABLED];

const builder: APISchema = {
	title: 'createToggle',
	description: DESCRIPTIONS.BUILDER('toggle'),
	isBuilder: true,
	props: genProps('toggle', [
		...OPTION_PROPS,
		{
			name: 'defaultPressed',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the toggle is pressed.',
		},
		{
			name: 'pressed',
			type: 'Writable<boolean>',
			description: 'A writable store that controls the pressed state of the toggle.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onPressedChange',
			type: 'ChangeFn<boolean>',
			description:
				'A callback called when the value of the `pressed` store should be changed. This is useful for controlling the value of the toggle from outside the toggle.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	]),
	elements: genElements('toggle', [
		{
			name: 'root',
			description: 'The builder store used to create the toggle root.',
		},
	]),
	states: [
		{
			name: 'pressed',
			type: 'Readable<boolean>',
			description: 'A readable store that represents the pressed state of the toggle.',
		},
	],
	options: propsToOptions('toggle', OPTION_PROPS),
};

const root: APISchema = {
	title: 'root',
	description: 'The root toggle component.',
	dataAttributes: [
		{
			name: 'data-disabled',
			value: ATTRS.DISABLED('toggle'),
		},
		{
			name: 'data-state',
			value: ATTRS.ON_OFF,
		},
		{
			name: 'data-melt-toggle',
			value: ATTRS.MELT('toggle'),
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Activates/deactivates the `toggle`.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Activates/deactivates the `toggle`.',
	},
];

const schemas = [builder, root];

const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];

export const toggleData: BuilderData = {
	schemas,
	features,
	keyboard,
};
