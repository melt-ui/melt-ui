import { ATTRS, DESCRIPTIONS, KBD } from '$docs/constants';
import type { APISchema, KeyboardSchema } from '$docs/types';
import type { BuilderData } from '.';

const builder: APISchema = {
	title: 'createToast',
	description: DESCRIPTIONS.BUILDER('toast'),
	props: [
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
	],
	returnedProps: [
		{
			name: 'toasts',
			type: 'Writable<Toast<ToastData<T>[]>',
			description: 'A writable store that contains the open toasts.',
		},
		{
			name: 'addToast',
			type: '(props: AddToastProps<T>) => void',
			description: 'A helper function to add a toast to the toasts store.',
		},
		{
			name: 'content',
			description: 'The builder store used to create the toast description.',
			link: '#content',
		},
		{
			name: 'title',
			description: 'The builder store used to create the toast title.',
			link: '#title',
		},
		{
			name: 'description',
			description: 'The builder store used to create the toast description.',
			link: '#description',
		},
		{
			name: 'close',
			description: 'The builder store used to create the toast close button.',
			link: '#close',
		},
	],
};

const content: APISchema = {
	title: 'content',
	description: 'The description of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-content',
			value: ATTRS.MELT('content'),
		},
	],
};

const title: APISchema = {
	title: 'title',
	description: 'The title of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-title',
			value: ATTRS.MELT('title'),
		},
	],
};

const description: APISchema = {
	title: 'description',
	description: 'The description of the toast. Used for accessibility purposes.',
	dataAttributes: [
		{
			name: 'data-melt-toast-description',
			value: ATTRS.MELT('description'),
		},
	],
};

const close: APISchema = {
	title: 'close',
	description: 'The element which closes the toast when clicked or pressed.',
	dataAttributes: [
		{
			name: 'data-melt-toast-close',
			value: ATTRS.MELT('close'),
		},
	],
};

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
