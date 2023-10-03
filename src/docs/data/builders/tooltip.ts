import { ATTRS, KBD, PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import { builderSchema, elementSchema } from '$docs/utils/index.js';
import { tooltipEvents } from '$lib/builders/tooltip/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.POSITIONING({ default: "position: 'top'" }),
	PROPS.ARROW_SIZE,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.FORCE_VISIBLE,
	PROPS.PORTAL,
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
		description: 'The delay in milliseconds before the tooltip closes after a pointer leave event.',
	},
	{
		name: 'disableHoverableContent',
		type: 'boolean',
		default: 'false',
		description:
			'Prevents the tooltip content element from remaining open when hovered. If `true`, the tooltip will only be open when hovering the trigger element.',
	},
    {
        name: 'group',
        type: 'string | boolean',
        description: 'If set to `true`, whenever you open this tooltip, all other tooltips with `group` also set to `true` will close. If you pass in a string instead, only tooltips with the same `group` value will be closed.'
   }
];

const BUILDER_NAME = 'tooltip';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createTooltip',
	props: [...OPTION_PROPS, PROPS.DEFAULT_OPEN, PROPS.OPEN, PROPS.ON_OPEN_CHANGE],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the tooltip trigger.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the tooltip content.',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the tooltip arrow.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store that indicates whether the tooltip is open or not',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
	description: 'The tooltip trigger element.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-tooltip-trigger',
			value: ATTRS.MELT('tooltip trigger'),
		},
	],
	events: tooltipEvents['trigger'],
});

const content = elementSchema('content', {
	description: 'The tooltip content element.',
	dataAttributes: [
		{
			name: 'data-melt-tooltip-content',
			value: ATTRS.MELT('tooltip content'),
		},
	],
	events: tooltipEvents['content'],
});

const arrow = elementSchema('arrow', {
	description: 'The tooltip arrow element.',
	dataAttributes: [
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-tooltip-arrow',
			value: ATTRS.MELT('tooltip arrow'),
		},
	],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Opens/closes the tooltip without delay.',
	},
	{
		key: KBD.SPACE,
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: KBD.ENTER,
		behavior: 'If open, closes the tooltip without delay.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'If open, closes the tooltip without delay.',
	},
];

const schemas = [builder, trigger, content, arrow];

const features: BuilderData['features'] = [
	'Opens when the trigger is focused or hovered',
	'Closes when the trigger is activated or with escape',
	'Custom delay for opening and closing',
	'Supports custom positioning',
];

export const tooltipData: BuilderData = {
	schemas,
	features,
	keyboard,
};
