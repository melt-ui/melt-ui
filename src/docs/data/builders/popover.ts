import { ATTRS, KBD, PROPS } from '$docs/constants.js';
import type { KeyboardSchema } from '$docs/types.js';
import {
	builderSchema,
	elementSchema,
	floatingSideAndAlignDataAttrs,
	floatingSideDataAttr,
} from '$docs/utils/index.js';
import { popoverIdParts } from '$lib/index.js';
import { popoverEvents } from '$lib/builders/popover/events.js';
import type { BuilderData } from './index.js';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	PROPS.POSITIONING({ default: 'placement: "bottom"' }),
	{
		name: 'disableFocusTrap',
		type: 'boolean',
		default: 'false',
		description: 'Whether to disable the focus trap.',
	},
	PROPS.ARROW_SIZE,
	PROPS.CLOSE_ON_ESCAPE,
	PROPS.CLOSE_ON_OUTSIDE_CLICK,
	PROPS.PREVENT_SCROLL,
	PROPS.PORTAL,
	PROPS.FORCE_VISIBLE,
	PROPS.OPEN_FOCUS,
	PROPS.CLOSE_FOCUS,
];

const BUILDER_NAME = 'popover';

const builder = builderSchema(BUILDER_NAME, {
	ids: popoverIdParts,
	title: 'createPopover',
	props: [...OPTION_PROPS, PROPS.DEFAULT_OPEN, PROPS.OPEN, PROPS.ON_OPEN_CHANGE],
	elements: [
		{
			name: 'trigger',
			description: 'The builder store used to create the popover trigger.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the popover content.',
		},
		{
			name: 'overlay',
			description: 'The builder store used to create the popover overlay.',
		},
		{
			name: 'close',
			description: 'The builder store used to create the popover close button.',
		},
		{
			name: 'arrow',
			description: 'The builder store used to create the popover arrow.',
		},
	],
	states: [
		{
			name: 'open',
			type: 'Writable<boolean>',
			description: 'A writable store which represents the open state of the popover.',
		},
	],
	options: OPTION_PROPS,
});

const trigger = elementSchema('trigger', {
	description: 'The button(s) which open/close the popover.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-popover-trigger',
			value: ATTRS.MELT('trigger'),
		},
	],
	events: popoverEvents['trigger'],
});

const content = elementSchema('content', {
	description: 'The popover content.',
	dataAttributes: [
		...floatingSideAndAlignDataAttrs,
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-popover-content',
			value: ATTRS.MELT('content'),
		},
	],
});

const overlay = elementSchema('overlay', {
	description:
		'The optional popover overlay element, which can be used to give the popover modal-like behavior where the user cannot interact with the rest of the page while the popover is open.',
	dataAttributes: [
		{
			name: 'data-state',
			value: ATTRS.OPEN_CLOSED,
		},
		{
			name: 'data-melt-popover-overlay',
			value: ATTRS.MELT('overlay'),
		},
	],
});

const arrow = elementSchema('arrow', {
	title: 'arrow',
	description: 'The optional arrow element.',
	dataAttributes: [
		floatingSideDataAttr,
		{
			name: 'data-arrow',
			value: ATTRS.TRUE,
		},
		{
			name: 'data-melt-popover-arrow',
			value: ATTRS.MELT('arrow'),
		},
	],
});

const close = elementSchema('close', {
	title: 'close',
	description: 'The button(s) which close the popover.',
	dataAttributes: [
		{
			name: 'data-melt-popover-close',
			value: ATTRS.MELT('close'),
		},
	],
	events: popoverEvents['close'],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.SPACE,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.ENTER,
		behavior: 'Toggles the popover.',
	},
	{
		key: KBD.TAB,
		behavior:
			'Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.SHIFT_TAB,
		behavior:
			'Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence.',
	},
	{
		key: KBD.ESCAPE,
		behavior: 'Closes the popover and moves focus to the trigger element.',
	},
];

const schemas = [builder, trigger, content, overlay, close, arrow];

const features = [
	'Full keyboard navigation',
	'Customize positioning of popover',
	'Can be controlled or uncontrolled',
	'Focus is fully managed',
	'Supports an optional arrow component',
];

export const popoverData: BuilderData = {
	schemas,
	features,
	keyboard,
};
