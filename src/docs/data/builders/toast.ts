import { ATTRS, KBD } from '$docs/constants';
import type { KeyboardSchema } from '$docs/types';
import { builderSchema, elementSchema, genProps } from '$docs/utils';
import { toastEvents } from '@melt-ui/svelte/builders/toast/events';
import type { BuilderData } from '.';

/**
 * Props that are also returned in the form of stores via the `options` property.
 */
const OPTION_PROPS = [
	{
		name: 'closeDelay',
		type: 'number',
		default: '5000',
		description: 'The delay in milliseconds before the toast closes.',
	},
	{
		name: 'type',
		type: ["'foreground'", "'background'"],
		default: "'foreground'",
		description: 'The sensitivity of the toast for accessibility purposes.',
	},
];

const BUILDER_NAME = 'toast';

const builder = builderSchema(BUILDER_NAME, {
	title: 'createToaster',
	props: genProps('toaster', OPTION_PROPS),
	elements: [
		{
			name: 'content',
			description: 'The builder store used to create the toast description.',
		},
		{
			name: 'title',
			description: 'The builder store used to create the toast title.',
		},
		{
			name: 'description',
			description: 'The builder store used to create the toast description.',
		},
		{
			name: 'close',
			description: 'The builder store used to create the toast close button.',
		},
	],
	states: [
		{
			name: 'toasts',
			type: 'Readable<Toast<T>[]>',
			description: 'A readable store that contains the open toasts.',
		},
	],
	helpers: [
		{
			name: 'addToast',
			type: '(props: AddToastProps<T>) => void',
			description: 'A helper function to add a toast to the toasts store.',
		},
	],
	actions: [
		{
			name: 'portal',
			type: 'Action',
			description: 'A portal action that renders the toasts into the body.',
		},
	],
	options: OPTION_PROPS,
});

const content = elementSchema('content', {
	description: 'The description of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-content',
			value: ATTRS.MELT('content'),
		},
	],
	events: toastEvents['content'],
});

const title = elementSchema('title', {
	description: 'The title of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-title',
			value: ATTRS.MELT('title'),
		},
	],
});

const description = elementSchema('description', {
	description: 'The description of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-description',
			value: ATTRS.MELT('description'),
		},
	],
});

const close = elementSchema('close', {
	description: 'The element which closes the toast when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-toast-close',
			value: ATTRS.MELT('close'),
		},
	],
	events: toastEvents['close'],
});

const keyboard: KeyboardSchema = [
	{
		key: KBD.TAB,
		behavior: 'Moves focus to the next focusable element within the toast.',
	},
];

const schemas = [builder, content, title, description, close];
const features = ['Automatically closes', 'Resets closing on hover'];

export const toastData: BuilderData = {
	schemas,
	features,
	keyboard,
};
