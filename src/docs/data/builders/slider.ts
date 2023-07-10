import { ATTRS, DESCRIPTIONS, KBD, TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSlider',
	description: DESCRIPTIONS.BUILDER('slider'),
	props: [
		{
			name: 'value',
			type: 'number[]',
			default: '[]',
			description: 'The value of the slider.',
		},
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
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether or not the slider is disabled.',
		},
	],
};

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

const schemas = {
	builder,
	keyboard,
	root,
	thumb,
	range,
};

const features = [
	'Supports multiple thumbs',
	'Can be controlled or uncontrolled',
	'Supports a minimum value between thumbs',
	'Supports both touch and click',
	'Supports a custom step size',
	'Can be vertical or horizontal',
];

export const sliderData = {
	schemas,
	features,
};
