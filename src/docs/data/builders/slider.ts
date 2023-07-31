import { ATTRS, DESCRIPTIONS, KBD, PROPS, SEE, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import { genElements, genProps, propsToOptions } from '$docs/utils/content';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'min',
		type: 'number',
		default: '0',
		description: 'The minimum value of the slider.',
	},
	{
		name: 'max',
		type: 'number',
		default: '100',
		description: 'The maximum value of the slider.',
	},
	{
		name: 'step',
		type: 'number',
		default: '1',
		description: 'The amount to increment/decrement the value by when using the keyboard.',
	},
	{
		name: 'orientation',
		type: TYPES.ORIENTATION,
		default: "'horizontal'",
		description: 'The orientation of the slider.',
	},
	PROPS.DISABLED,
];

const builder: APISchema = {
	title: 'createSlider',
	description: DESCRIPTIONS.BUILDER('slider'),
	isBuilder: true,
	props: genProps('slider', [
		...OPTION_PROPS,
		{
			name: 'defaultValue',
			type: 'number[]',
			default: '[]',
			description:
				'The default value of the slider. Pass in multiple values for multiple thumbs, creating a range slider.',
		},
		{
			name: 'value',
			type: 'Writable<number>',
			description: 'A writable store that can be used to update the slider value.',
			see: SEE.BRING_YOUR_OWN_STORE,
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<number>',
			description: 'A callback that is called when the value of the slider changes.',
			see: SEE.CHANGE_FUNCTIONS,
		},
	]),
	elements: genElements('slider', [
		{
			name: 'root',
			description: 'The builder store used to create the root slider element.',
		},
		{
			name: 'range',
			description: 'The builder store used to create the slider range element.',
		},
		{
			name: 'thumb',
			description: 'The builder store used to create the slider thumb element.',
		},
	]),
	states: [
		{
			name: 'value',
			type: 'Readable<number[]>',
			description: 'A readable store that can be used to get the current value of the slider.',
		},
	],
	options: propsToOptions('slider', OPTION_PROPS),
};

const root: APISchema = {
	title: 'root',
	description: 'The slider component.',
	dataAttributes: [
		{
			name: 'data-orientation',
			value: ATTRS.ORIENTATION,
		},
		{
			name: 'data-melt-slider',
			value: ATTRS.MELT('slider'),
		},
	],
};

const range: APISchema = {
	title: 'range',
	description: 'The slider range component.',
	dataAttributes: [
		{
			name: 'data-melt-slider-range',
			value: ATTRS.MELT('slider range'),
		},
	],
};

const thumb: APISchema = {
	title: 'thumb',
	description: 'The slider thumb component.',
	dataAttributes: [
		{
			name: 'data-melt-slider-thumb',
			value: ATTRS.MELT('slider thumb'),
		},
	],
};

const schemas = [builder, root, thumb, range];

const features = [
	'Supports multiple thumbs',
	'Can be controlled or uncontrolled',
	'Supports a minimum value between thumbs',
	'Supports both touch and click',
	'Supports a custom step size',
	'Can be vertical or horizontal',
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: KBD.ARROW_UP,
		behavior: 'Increases the value by the `step` amount.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Decreases the value by the `step` amount.',
	},
	{
		key: KBD.HOME,
		behavior: 'Sets the value to its minimum',
	},
	{
		key: KBD.END,
		behavior: 'Sets the value to its maximum',
	},
];

export const sliderData: BuilderData = {
	schemas,
	features,
	keyboard,
};
