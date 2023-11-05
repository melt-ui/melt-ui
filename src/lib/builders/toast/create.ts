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
	isElement,
} from '$lib/internal/helpers/index.js';
import type { AddToastProps, CreateToasterProps, SwipeDirection, Toast } from './types.js';
import { usePortal } from '$lib/internal/actions/index.js';
import type { MeltActionReturn } from '$lib/internal/types.js';
import type { ToastEvents } from './events.js';

type ToastParts = 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<ToastParts>('toast');

const defaults = {
	closeDelay: 5000,
	type: 'foreground',
	swipeDirection: 'right',
	swipeThreshold: 50,
	closeOnSwipe: true,
} satisfies CreateToasterProps;

export function createToaster<T = object>(props?: CreateToasterProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateToasterProps;

	const options = toWritableStores(withDefaults);
	const { closeDelay, type, swipeDirection, swipeThreshold, closeOnSwipe } = options;

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

			const pointerStart = writable<{ x: number; y: number } | null>(null);
			const swipeDelta = writable<{ x: number; y: number } | null>(null);

			destroy = executeCallbacks(
				addMeltEventListener(node, 'pointerdown', (e) => {
					if (!get(closeOnSwipe) || e.button !== 0) return;
					pointerStart.set({ x: e.clientX, y: e.clientY });
				}),
				addMeltEventListener(node, 'pointermove', (e) => {
					if (!get(closeOnSwipe)) return;
					const $pointerStart = get(pointerStart);
					if (!$pointerStart) return;
					const x = e.clientX - $pointerStart.x;
					const y = e.clientY - $pointerStart.y;
					const $swipeDirection = get(swipeDirection);
					const hasSwipeMoveStarted = Boolean(get(swipeDelta));
					const isHorizontalSwipe = ['left', 'right'].includes($swipeDirection);
					const clamp = ['left', 'up'].includes($swipeDirection) ? Math.min : Math.max;

					const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
					const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;

					const moveStartBuffer = e.pointerType === 'touch' ? 10 : 2;
					const delta = {
						x: clampedX,
						y: clampedY,
					};
					if (hasSwipeMoveStarted) {
						swipeDelta.set(delta);
					} else if (isDeltaInDirection(delta, $swipeDirection, moveStartBuffer)) {
						// onSwipeStart
						swipeDelta.set(delta);
						const target = e.target;
						if (!isElement(target)) return;
						target.setPointerCapture(e.pointerId);
					} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
						// User is swiping in wrong direction so disable swipe gesture
						pointerStart.set(null);
					}
				}),
				addMeltEventListener(node, 'pointerup', (e) => {
					if (!get(closeOnSwipe)) return;
					const target = e.target;
					if (!isElement(target)) return;
					const $delta = get(swipeDelta);
					const $swipeDirection = get(swipeDirection);
					const $swipeThreshold = get(swipeThreshold);
					if (target.hasPointerCapture(e.pointerId)) {
						target.releasePointerCapture(e.pointerId);
					}
					if ($delta && isDeltaInDirection($delta, $swipeDirection, $swipeThreshold)) {
						removeToast(node.id);
					}
					swipeDelta.set(null);
					pointerStart.set(null);

					// prevent click from triggering on items within the toast when swiping
					node.addEventListener('click', (e) => e.preventDefault(), { once: true });
				}),
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

function isDeltaInDirection(
	delta: { x: number; y: number },
	direction: SwipeDirection,
	threshold = 0
) {
	const deltaX = Math.abs(delta.x);
	const deltaY = Math.abs(delta.y);
	const isDeltaX = deltaX > deltaY;
	if (direction === 'left' || direction === 'right') {
		return isDeltaX && deltaX > threshold;
	} else {
		return !isDeltaX && deltaY > threshold;
	}
}
