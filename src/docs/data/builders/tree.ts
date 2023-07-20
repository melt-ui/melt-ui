import { ATTRS, DESCRIPTIONS, KBD, LONG_TYPES } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createTooltip',
	description: DESCRIPTIONS.BUILDER('tooltip'),
	props: [
		{
			name: 'positioning',
			type: 'FloatingConfig',
			default: "position: 'top'",
			description: DESCRIPTIONS.FLOATING_CONFIG,
			longType: LONG_TYPES.FLOATING_CONFIG,
		},
		{
			name: 'arrowSize',
			type: 'number',
			default: '8',
			description: DESCRIPTIONS.ARROW_SIZE,
		},
		{
			name: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Whether the tooltip is open or not.',
		},
		{
			name: 'closeOnPointerDown',
			type: 'boolean',
			default: 'true',
			description: 'Whether the tooltip closes when the pointer is down.',
		},
		{
			name: 'openDelay',
			type: 'number',
			default: '1000',
			description: 'The delay in milliseconds before the tooltip opens after a pointer over event.',
		},
		{
			name: 'closeDelay',
			type: 'number',
			default: '500',
			description:
				'The delay in milliseconds before the tooltip closes after a pointer leave event.',
		},
	],
	returnedProps: [
		{
			name: 'options',
			type: 'Writable<CreateTooltipProps>',
			description: 'A writable store that controls the options of the tooltip.',
		},
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that controls the open state of the tooltip.',
		},
		{
			name: 'trigger',
			description: 'The builder store used to create the tooltip trigger.',
			link: '#trigger',
		},
		{
			name: 'content',
			description: 'The builder store used to create the tooltip content.',
			link: '#content',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the tooltip arrow.',
			link: '#arrow',
		},
	],
};

const schemas = [builder];

const features: BuilderData['features'] = [
	'',
];

export const treeData: BuilderData = {
	schemas,
	features,
};
