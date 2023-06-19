import { createFocusTrap, usePortal } from '$lib/internal/actions';
import {
	addEventListener,
	effect,
	elementDerived,
	elementMulti,
	elementMultiDerived,
	isBrowser,
	sleep,
	styleToString,
	uuid,
} from '$lib/internal/helpers';
import { removeScroll } from '$lib/internal/helpers/scroll';
import type { Defaults } from '$lib/internal/types';
import { writable } from 'svelte/store';

export type CreateDialogArgs = {
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
} satisfies Defaults<CreateDialogArgs>;

export function createDialog(args: CreateDialogArgs = {}) {
	const withDefaults = { ...defaults, ...args };
	const options = writable({ ...withDefaults });
	const activeTrigger = writable<HTMLElement | null>(null);

	const isAlertDialog = args.role === 'alertdialog';

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
		if ($options.closeOnEscape && !isAlertDialog) {
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
			'aria-hidden': true,
			'data-state': $open ? 'open' : 'closed',
		} as const;
	});

	const content = elementDerived([open, options], ([$open, $options], { addAction }) => {
		if ($open) {
			const { useFocusTrap } = createFocusTrap({
				immediate: true,
				escapeDeactivates: false,
				allowOutsideClick: (e) => {
					e.preventDefault();
					if ($options.closeOnOutsideClick) {
						open.set(false);
					}

					return false;
				},
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
		const unsubs: Array<() => void> = [];
		if ($options.closeOnEscape && !isAlertDialog && $open) {
			unsubs.push(
				addEventListener(document, 'keydown', (e) => {
					if (e.key === 'Escape') {
						open.set(false);
					}
				})
			);
		}

		if ($options.preventScroll && $open) unsubs.push(removeScroll());

		return () => {
			unsubs.forEach((unsub) => unsub());
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
