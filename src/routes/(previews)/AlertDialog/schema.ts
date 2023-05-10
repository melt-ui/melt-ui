import example from './example.svelte';
import type { PreviewSchema } from '$lib/internal/helpers';

import type { AlertDialog } from '$lib';
import code from './example.svelte?raw';

export const schema = {
	title: 'Alert Dialog',
	description:
		'A modal dialog that interrupts the user with important content and expects a response.',
	example,
	code,
	meta: {
		Root: {
			description: 'Contains all the parts of an alert dialog.',
			props: {
				open: {
					type: 'boolean',
					default: false,
				},
			},
		},
		Trigger: {
			description: 'A button that opens the dialog.',
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Portal: {
			description: 'When used, portals your overlay and content parts into the body.',
			props: {
				container: {
					type: 'HTMLElement | string',
					show: null,
				},
			},
		},
		Overlay: {
			description: 'A layer that covers the inert portion of the view when the dialog is open.',
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Content: {
			description: 'Contains content to be rendered when the dialog is open.',
			props: {
				onPointerDownOutside: {
					type: 'function',
					show: null,
				},
				onEscapeKeyDown: {
					type: 'function',
					show: null,
				},
				openAutoFocus: {
					type: 'boolean',
					typeLabel: 'boolean | HTMLElement',
					default: undefined,
					show: null,
				},
				closeAutoFocus: {
					type: 'boolean',
					default: true,
				},
			},
			dataAttributes: {
				'data-state': {
					values: ['open', 'closed'],
				},
			},
		},
		Cancel: {
			description:
				'A button that closes the dialog. This button should be distinguished visually from *AlertDialog.Action* buttons.',
		},
		Action: {
			description:
				'A button that closes the dialog. These buttons should be distinguished visually from the *AlertDialog.Cancel* button.',
		},
		Title: {
			description:
				'An accessible name to be announced when the dialog is opened. Alternatively, you can provide *aria-label* or *aria-labelledby* to *AlertDialog.Content* and exclude this component.',
		},
		Description: {
			description:
				'An accessible description to be announced when the dialog is opened. Alternatively, you can provide *aria-describedby* to *AlertDialog.Content* and exclude this component.',
		},
	},
} satisfies PreviewSchema<typeof AlertDialog>;
