import { derived, get, writable, readonly } from 'svelte/store';
import {
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	isTouch,
	noop,
	toWritableStores,
	addMeltEventListener,
	kbd,
} from '$lib/internal/helpers/index.js';
import type { AddToastProps, CreateToasterProps, Toast } from './types.js';
import { usePortal } from '$lib/internal/actions/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { ToastEvents } from './events.js';

type ToastParts = 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<ToastParts>('toast');

const defaults = {
	closeDelay: 5000,
	type: 'foreground',
} satisfies CreateToasterProps;

export function createToaster<T = object>(props?: CreateToasterProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToasterProps;

	const options = toWritableStores(withDefaults);
	const { closeDelay, type } = options;

	const toastsMap = writable(new Map<string, Toast<T>>());

	const addToast = (props: AddToastProps<T>) => {
		const propsWithDefaults = {
			closeDelay: get(closeDelay),
			type: get(type),
			...props,
		} satisfies AddToastProps<T>;

		const ids = {
			content: generateId(),
			title: generateId(),
			description: generateId(),
		};

		const timeout =
			propsWithDefaults.closeDelay === 0
				? null
				: window.setTimeout(() => {
						removeToast(ids.content);
				  }, propsWithDefaults.closeDelay);

		const getPercentage = () => {
			const { createdAt, pauseDuration, closeDelay, pausedAt } = toast;
			if (closeDelay === 0) return 0;

			if (pausedAt) {
				return (100 * (pausedAt - createdAt - pauseDuration)) / closeDelay;
			} else {
				const now = performance.now();
				return (100 * (now - createdAt - pauseDuration)) / closeDelay;
			}
		};

		const toast = {
			id: ids.content,
			ids,
			...propsWithDefaults,
			timeout,
			createdAt: performance.now(),
			pauseDuration: 0,
			getPercentage,
		} as Toast<T>;

		toastsMap.update((currentMap) => {
			currentMap.set(ids.content, toast);
			return new Map(currentMap);
		});

		return toast;
	};

	const removeToast = (id: string) => {
		toastsMap.update((currentMap) => {
			currentMap.delete(id);
			return new Map(currentMap);
		});
	};

	const updateToast = (id: string, data: T) => {
		toastsMap.update((currentMap) => {
			const toast = currentMap.get(id);
			if (!toast) return currentMap;

			currentMap.set(id, { ...toast, data });
			return new Map(currentMap);
		});
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
		action: (node: HTMLElement): MeltActionReturn<ToastEvents['content']> => {
			let destroy = noop;

			destroy = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					toastsMap.update((currentMap) => {
						const currentToast = currentMap.get(node.id);
						if (!currentToast || currentToast.closeDelay === 0) return currentMap;

						if (currentToast.timeout !== null) {
							window.clearTimeout(currentToast.timeout);
						}
						currentToast.pausedAt = performance.now();
						return new Map(currentMap);
					});
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					toastsMap.update((currentMap) => {
						const currentToast = currentMap.get(node.id);
						if (!currentToast || currentToast.closeDelay === 0) return currentMap;

						const pausedAt = currentToast.pausedAt ?? currentToast.createdAt;
						const elapsed = pausedAt - currentToast.createdAt - currentToast.pauseDuration;
						const remaining = currentToast.closeDelay - elapsed;
						currentToast.timeout = window.setTimeout(() => {
							removeToast(node.id);
						}, remaining);

						currentToast.pauseDuration += performance.now() - pausedAt;
						currentToast.pausedAt = undefined;
						return new Map(currentMap);
					});
				}),
				() => {
					removeToast(node.id);
				}
			);

			return {
				destroy,
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
		action: (node: HTMLElement): MeltActionReturn<ToastEvents['close']> => {
			function handleClose() {
				if (!node.dataset.id) return;
				removeToast(node.dataset.id);
			}

			const unsub = executeCallbacks(
				addMeltEventListener(node, 'click', () => {
					handleClose();
				}),
				addMeltEventListener(node, 'keydown', (e) => {
					if (e.key !== kbd.ENTER && e.key !== kbd.SPACE) return;
					e.preventDefault();
					handleClose();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const toasts = derived(toastsMap, ($toastsMap) => {
		return Array.from($toastsMap.values());
	});

	return {
		elements: {
			content,
			title,
			description,
			close,
		},
		states: {
			toasts: readonly(toasts),
		},
		helpers: {
			addToast,
			removeToast,
			updateToast,
		},
		actions: {
			portal: usePortal,
		},
		options,
	};
}
