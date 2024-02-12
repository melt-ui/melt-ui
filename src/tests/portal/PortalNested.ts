import Dialog from './Dialog.svelte';
import Popover from './Popover.svelte';
import Select from './Select.svelte';

export const components = {
	dialog: Dialog,
	popover: Popover,
	select: Select,
} as const;

export type Structure = {
	name: keyof typeof components;
	children?: Structure[];
};
export const structure: Structure = {
	name: 'dialog',
	children: [
		{
			name: 'dialog',
			children: [
				{
					name: 'select',
				},
			],
		},
		{
			name: 'popover',
			children: [{ name: 'dialog' }, { name: 'popover' }],
		},
		{ name: 'select' },
	],
};
