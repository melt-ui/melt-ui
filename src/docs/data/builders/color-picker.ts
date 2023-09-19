import { DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

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
	]
};

const schemas = [builder];

const features = [
	'Full keyboard navigation',
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
