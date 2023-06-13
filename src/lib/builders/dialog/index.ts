import { usePortal } from '$lib/internal/actions';
import { elementDerived } from '$lib/internal/helpers';
import { writable } from 'svelte/store';

type CreateDialogArgs = {
	preventScroll?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	role?: 'dialog' | 'alertdialog';
};

const defaults = {
	preventScroll: true,
	closeOnEscape: true,
	closeOnOutsideClick: true,
	role: 'dialog',
} satisfies CreateDialogArgs;

export function createDialog(args: CreateDialogArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });

	const open = writable(false);

	const trigger = elementDerived(open, ($open, { attach }) => {
		attach('click', () => {
			open.set(true);
		});

		return {
			'aria-haspopup': 'dialog',
			'aria-expanded': $open,
			// TODO: aria-controls should be the id of the dialog
			'aria-controls': 'dialog',
		} as const;
	});

	const overlay = elementDerived(open, ($open, { attach, addUnsubscriber }) => {
		return {
			hidden: $open ? undefined : true,
			tabindex: -1,
			style: {
				display: $open ? undefined : 'none',
			},
		};
	});

	return {
		options,
		open,
		trigger,
		overlay,
	};
}
