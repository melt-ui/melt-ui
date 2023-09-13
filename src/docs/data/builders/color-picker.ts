import { DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createColorPicker',
	description: DESCRIPTIONS.BUILDER('color picker'),
	props: [
		{
			name: 'selector',
			type: 'string',
			required: true,
			description:
				'The selector of the container for which the table of contents (ToC) should be created.',
		},
	],
	returnedProps: [
		{
			name: 'activeHeadingIdxs',
			type: 'Writable<number[]>',
			description: 'A writable store that shows the list of active headers.',
		}
	],
};

const item: APISchema = {
	title: 'item',
	description: 'A table of contents item.',
	dataAttributes: [
		{
			name: 'data-id',
			value: 'The id of the heading element the item links to.',
		},
	],
};

const schemas = [builder, item];

const features = [
	'',
];

const keyboard: KeyboardSchema = [
	{
		key: KBD.ENTER,
		behavior: 'Scrolls to the focused heading.',
	},
];

export const colorPickerData: BuilderData = {
	schemas,
	features,
	keyboard,
};
