import { createFocusTrap, usePortal } from '$lib/internal/actions';
import {
	addEventListener,
	effect,
	elementDerived,
	elementMulti,
	elementMultiDerived,
	isBrowser,
	noop,
	sleep,
	styleToString,
	uuid,
} from '$lib/internal/helpers';
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
	const activeTrigger = writable<HTMLElement | null>(null);

	const ids = {
		content: uuid(),
		title: uuid(),
		description: uuid(),
	};

	const open = writable(false);

	const trigger = elementMultiDerived(open, ($open, { attach }) => {
		return () => {
			attach('click', (e) => {
				const el = e.currentTarget as HTMLElement;
				open.set(true);
				activeTrigger.set(el);
			});

			return {
				'aria-haspopup': 'dialog',
				'aria-expanded': $open,
				'aria-controls': ids.content,
			} as const;
		};
	});

	const overlay = elementDerived([open, options], ([$open, $options], { attach }) => {
		if ($options.closeOnOutsideClick) {
			attach('click', () => {
				open.set(false);
			});
		}

		if ($options.closeOnEscape) {
			attach('keydown', (e) => {
				if (e.key === 'Escape') {
					open.set(false);
				}
			});
		}

		return {
			hidden: $open ? undefined : true,
			tabindex: -1,
			style: styleToString({
				display: $open ? undefined : 'none',
			}),
		} as const;
	});

	const content = elementDerived(open, ($open, { addAction }) => {
		if ($open) {
			const { useFocusTrap } = createFocusTrap({
				immediate: true,
				escapeDeactivates: false,
				allowOutsideClick: true,
				returnFocusOnDeactivate: false,
			});
			addAction(useFocusTrap);
		}

		return {
			id: ids.content,
			role: 'dialog',
			'aria-describedby': ids.description,
			'aria-labelledby': ids.title,
			'data-state': $open ? 'open' : 'closed',
			tabindex: -1,
			hidden: $open ? undefined : true,
		};
	});

	const title = {
		id: ids.title,
	};

	const description = {
		id: ids.description,
	};

	const close = elementMulti(({ attach }) => {
		return () => {
			attach('click', () => {
				open.set(false);
			});

			return {};
		};
	});

	effect([open, options], ([$open, $options]) => {
		let unsub = noop;
		if ($options.closeOnEscape && $open) {
			unsub = addEventListener(document, 'keydown', (e) => {
				if (e.key === 'Escape') {
					open.set(false);
				}
			});
		}

		return () => {
			unsub();
		};
	});

	effect([open, activeTrigger], ([$open, $activeTrigger]) => {
		if (!isBrowser) return;

		if (!$open && $activeTrigger && isBrowser) {
			// Prevent the keydown event from triggering on the trigger
			sleep(1).then(() => $activeTrigger.focus());
		}
	});

	return {
		options,
		open,
		trigger,
		overlay,
		portal: usePortal,
		content,
		title,
		description,
		close,
	};
}
