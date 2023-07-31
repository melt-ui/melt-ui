import { derived, get, writable, type Readable } from 'svelte/store';
import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	isTouch,
	noop,
} from '../../internal/helpers';
import type { AddToastProps, Toast } from './types';
import { usePortal } from '$lib/internal/actions';

type ToastParts = 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<ToastParts>('toast');

export function createToaster<T = object>(defaults?: Omit<AddToastProps<T>, 'data'>) {
	const toastsMap = writable(new Map<string, Toast<T>>());
	const timeouts = new Map<string, number>();

	const closeToast = (id: string) => {
		toastsMap.update((currentMap) => {
			currentMap.delete(id);
			return new Map(currentMap);
		});
	};

	const handleOpen = (id: string): void => {
		if (timeouts.has(id)) {
			window.clearTimeout(timeouts.get(id));
			timeouts.delete(id);
		}
	};

	const handleClose = derived(toastsMap, ($toasts) => {
		return (id: string): void => {
			if (timeouts.has(id)) {
				window.clearTimeout(timeouts.get(id));
				timeouts.delete(id);
			}

			const toast = $toasts.get(id);
			if (!toast) return;
			timeouts.set(
				id,
				window.setTimeout(() => {
					closeToast(id);
				}, toast.closeDelay)
			);
		};
	}) as Readable<(id: string) => void>;

	const addToast = (props: AddToastProps<T>) => {
		const propsWithDefaults = {
			closeDelay: 5000,
			type: 'foreground',
			...defaults,
			...props,
		} satisfies AddToastProps<T>;

		const ids = {
			content: generateId(),
			title: generateId(),
			description: generateId(),
		};

		const toast = { id: ids.content, ids, ...propsWithDefaults };

		toastsMap.update((currentMap) => {
			currentMap.set(ids.content, toast);
			return new Map(currentMap);
		});

		get(handleClose)(ids.content);
		return toast;
	};

	const content = builder(name('content'), {
		stores: toastsMap,
		returned: ($toasts) => {
			return (id: string) => {
				const t = $toasts.get(id);
				if (!t) return null;
				const { ...toast } = t;

				return {
					id,
					role: 'alert',
					'aria-describedby': toast.ids.description,
					'aria-labelledby': toast.ids.title,
					'aria-live': toast.type === 'foreground' ? 'assertive' : 'polite',
					tabindex: -1,
				};
			};
		},
		action: (node: HTMLElement) => {
			let unsub = noop;

			const unsubTimers = () => {
				if (timeouts.has(node.id)) {
					window.clearTimeout(timeouts.get(node.id));
					timeouts.delete(node.id);
				}
			};

			unsub = executeCallbacks(
				addEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					handleOpen(node.id);
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)(node.id);
				}),
				addEventListener(node, 'focusout', (e) => {
					e.preventDefault();
				})
			);

			return {
				destroy() {
					unsub();
					unsubTimers();
				},
			};
		},
	});

	const title = builder(name('title'), {
		stores: toastsMap,
		returned: ($toasts) => {
			return (id: string) => {
				const toast = $toasts.get(id);
				if (!toast) return null;
				return {
					id: toast.ids.title,
				};
			};
		},
	});

	const description = builder(name('description'), {
		stores: toastsMap,
		returned: ($toasts) => {
			return (id: string) => {
				const toast = $toasts.get(id);
				if (!toast) return null;

				return {
					id: toast.ids.description,
				};
			};
		},
	});

	const close = builder(name('close'), {
		returned: () => {
			return (id: string) => ({
				type: 'button',
				'data-id': id,
			});
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				if (!node.dataset.id) return;
				closeToast(node.dataset.id);
			});

			return {
				destroy: unsub,
			};
		},
	});

	const toasts = derived(toastsMap, ($toastsMap) => {
		return Array.from($toastsMap.values());
	});

	return {
		toasts,
		addToast,
		content,
		title,
		description,
		close,
		portal: usePortal,
	};
}
