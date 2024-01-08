import { ATTRS, DESCRIPTIONS, KBD, SEE } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';
import { colorPickerEvents } from '$lib/builders/color-picker/events';
import { elementSchema } from '$docs/utils';

const builder: APISchema = {
	title: 'createColorPicker',
	description: DESCRIPTIONS.BUILDER('color picker'),
	props: [
		{
			name: 'defaultColor',
			type: 'string',
			description: 'The default selected color. Should be a hex value, eg: #424242.',
		},
		{
			name: 'hueSliderOrientation',
			type: 'Orientation',
			description: 'The orientation of the hue slider.'
		},
		{
			name: 'alphaSliderOrientation',
			type: 'Orientation',
			description: 'The orientation of the alpha slider.'
		},
		{
			name: 'value',
			type: 'Writable<string>',
			description: 'The controlled value store for the hex color value.',
			see: SEE.BRING_YOUR_OWN_STORE
		},
		{
			name: 'onValueChange',
			type: 'ChangeFn<string>',
			description: 'The callback invoked when the value store of the color picker changes.',
			see: SEE.CHANGE_FUNCTIONS
		},
		{
			name: 'hueAngle',
			type: 'Writable<number>',
			description: 'The controlled value store for the hue angle. Should be a value between 0 and 360.',
			see: SEE.BRING_YOUR_OWN_STORE
		},
		{
			name: 'alphaValue',
			type: 'Writable<number>',
			description: 'The controlled value store for the alpha value. Should be a value between 0 and 100.',
			see: SEE.BRING_YOUR_OWN_STORE
		}
	],
	elements: [
		{
			name: 'colorCanvas',
			description: 'The builder store used to create the color canvas.'
		},
		{
			name: 'colorPicker',
			description: 'The builder store used to create the color picker button.'
		},
		{
			name: 'hueSlider',
			description: 'The builder store used to create the hue canvas.'
		},
		{
			name: 'huePicker',
			description: 'The builder store used to create the hue picker button.'
		},
		{
			name: 'alphaSlider',
			description: 'The builder store used to create the alpha canvas.'
		},
		{
			name: 'alphaPicker',
			description: 'The builder store used to create the alpha picker button.'
		},
		{
			name: 'eyeDropper',
			description: 'The builder store used to create the eye dropper button.'
		},
		{
			name: 'hexInput',
			description: 'The builder store used to create the hex color input element.'
		}
	],
	states: [
		{
			name: 'value',
			type: 'Writable<string>',
			description: 'The store for the hex color value.'
		}
	],
	helpers: [
		{
			name: 'derivedColors',
			type: 'Readable<ReturnedColor>',
			description: 'Returns the colors in different formats: RGB, HSV, HSL.'
		}
	]
};

const colorCanvas = elementSchema('colorCanvas', {
	description: 'The main color canvas element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-color-canvas',
			value: ATTRS.MELT('color-canvas')
		}
	],
	events: colorPickerEvents['colorCanvas']
});

const colorPicker = elementSchema('colorPicker', {
	description: 'The color picker element for the color canvas.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-color-picker',
			value: ATTRS.MELT('color-picker')
		}
	],
	events: colorPickerEvents['colorPicker']
});

const hueSlider = elementSchema('hueSlider', {
	description: 'The hue slider element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-hue-slider',
			value: ATTRS.MELT('hue-slider')
		}
	],
	events: colorPickerEvents['hueSlider']
});

const huePicker = elementSchema('huePicker', {
	description: 'The hue picker element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-hue-picker',
			value: ATTRS.MELT('hue-picker')
		}
	],
	events: colorPickerEvents['huePicker']
});

const alphaSlider = elementSchema('alphaSlider', {
	description: 'The alpha slider element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-alpha-slider',
			value: ATTRS.MELT('alpha-slider')
		}
	],
	events: colorPickerEvents['alphaSlider']
});

const alphaPicker = elementSchema('alphaPicker', {
	description: 'The alpha picker element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-alpha-picker',
			value: ATTRS.MELT('alpha-picker')
		}
	],
	events: colorPickerEvents['alphaPicker']
});

const eyeDropper = elementSchema('eyeDropper', {
	description: 'The eye dropper element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-eye-dropper',
			value: ATTRS.MELT('eye-dropper')
		}
	],
	events: colorPickerEvents['eyeDropper']
});

const hexInput = elementSchema('hexInput', {
	description: 'The hex input element.',
	dataAttributes: [
		{
			name: 'data-melt-color-picker-hex-input',
			value: ATTRS.MELT('hex-input')
		}
	],
	events: colorPickerEvents['hexInput']
});

const schemas = [builder, colorCanvas, colorPicker, hueSlider, huePicker, alphaSlider, alphaPicker, eyeDropper, hexInput];

const features = [
	'Full keyboard navigation',
	'Horizontal or vertical slider orientation',
	'Different color representations'
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ARROW_UP,
		behavior: 'Moves the focused button up.',
	},
	{
		key: KBD.ARROW_DOWN,
		behavior: 'Moves the focused button down.'
	},
	{
		key: KBD.ARROW_LEFT,
		behavior: 'Moves the focused button left.'
	},
	{
		key: KBD.ARROW_RIGHT,
		behavior: 'Moves the focused button right.'
	}
];

export const colorPickerData: BuilderData = {
	schemas,
	features,
	keyboard,
};
