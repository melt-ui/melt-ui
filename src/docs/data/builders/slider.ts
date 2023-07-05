import type { APISchema } from '$routes/(components)';

const builder: APISchema = {
	title: 'CreateSliderArgs',
	description: 'The configuration object passed to the `createSlider` builder function.',
	args: [
		{
			label: 'value',
			type: 'number[]',
			default: '[]',
		},
		{
			label: 'min',
			type: 'number',
			default: 0,
		},
		{
			label: 'max',
			type: 'number',
			default: 100,
		},
		{
			label: 'step',
			type: 'number',
			default: 1,
		},
		{
			label: 'orientation',
			type: "'horizontal' | 'vertical'",
			default: "'horizontal'",
		},
		{
			label: 'disabled',
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
			key: 'ArrowRight',
			description: 'Increments/decrements by the `step` value depending on `orientation`.',
		},
		{
			key: 'ArrowLeft',
			description: 'Increments/decrements by the `step` value depending on `orientation`.',
		},
		{
			key: 'ArrowUp',
			description: 'Increases the value by the `step` amount.',
		},
		{
			key: 'ArrowDown',
			description: 'Decreases the value by the `step` amount.',
		},
		{
			key: 'Home',
			description: 'Sets the value to its minimum',
		},
		{
			key: 'End',
			description: 'Sets the value to its maximum',
		},
	],
};

const slider: APISchema = {
	title: 'Slider',
	description: 'The slider component.',
	dataAttributes: [
		{
			label: 'data-orientation',
			value: ['"horizontal"', '"vertical"'],
		},
	],
};

const thumb: APISchema = {
	title: 'Thumb',
	description: 'The slider thumb component.',
	dataAttributes: [
		{
			label: 'data-melt-part',
			value: '`thumb`',
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
