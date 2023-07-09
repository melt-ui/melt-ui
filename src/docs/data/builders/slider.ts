import type { APISchema, KeyboardSchema } from '$docs/types';

const builder: APISchema = {
	title: 'createSlider',
	description: 'The configuration object passed to the `createSlider` builder function.',
	props: [
		{
			label: 'value',
			type: 'number[]',
			default: '[]',
		},
		{
			label: 'min',
			type: 'number',
			default: '0',
		},
		{
			label: 'max',
			type: 'number',
			default: '100',
		},
		{
			label: 'step',
			type: 'number',
			default: '1',
		},
		{
			label: 'orientation',
			type: "'horizontal' | 'vertical'",
			default: "'horizontal'",
		},
		{
			label: 'disabled',
			type: 'boolean',
			default: 'false',
		},
	],
};

const keyboard: KeyboardSchema = [
	{
		key: 'ArrowRight',
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: 'ArrowLeft',
		behavior: 'Increments/decrements by the `step` value depending on `orientation`.',
	},
	{
		key: 'ArrowUp',
		behavior: 'Increases the value by the `step` amount.',
	},
	{
		key: 'ArrowDown',
		behavior: 'Decreases the value by the `step` amount.',
	},
	{
		key: 'Home',
		behavior: 'Sets the value to its minimum',
	},
	{
		key: 'End',
		behavior: 'Sets the value to its maximum',
	},
];

const slider: APISchema = {
	title: 'slider',
	description: 'The slider component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: "`'horizontal' | 'vertical'`",
		},
		{
			label: 'data-melt-slider',
			value: 'Present on the slider element.',
		},
	],
};

const thumb: APISchema = {
	title: 'thumb',
	description: 'The slider thumb component.',
	dataAttributes: [
		{
			label: 'data-melt-slider-thumb',
			value: 'Present on the thumb element.',
		},
	],
};

const schemas = {
	builder,
	keyboard,
	slider,
	thumb,
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
