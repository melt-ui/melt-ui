import { derived, get, writable, type Readable } from 'svelte/store';
import {
	addEventListener,
	builder,
	createElHelpers,
	executeCallbacks,
	generateId,
	isTouch,
	noop,
	styleToString,
} from '../../internal/helpers';
import type { AddToastProps, Toast } from './types';

type ToastParts = 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<ToastParts>('toast');

export function createToast<T = {}>() {
	const toasts = writable(new Map<string, Toast<T>>());
	let timeouts = new Map<string, number>();

	const setOpen = (id: string, value: boolean) => {
		toasts.update((currentMap) => {
			currentMap.get(id)!.open = value;
			return new Map(currentMap);
		});
	};

	const handleOpen = (id: string): void => {
		if (timeouts.has(id)) {
			window.clearTimeout(timeouts.get(id));
			timeouts.delete(id);
		}
		setOpen(id, true);
	};

	const handleClose = derived(toasts, ($toasts) => {
		return (id: string): void => {
			if (timeouts.has(id)) {
				window.clearTimeout(timeouts.get(id));
				timeouts.delete(id);
			}
			timeouts.set(
				id,
				window.setTimeout(() => {
					setOpen(id, false);
				}, $toasts.get(id)!.closeDelay)
			);
		};
	}) as Readable<(id: string) => void>;

	const addToast = (props: AddToastProps<T>) => {
		const propsWithDefaults = {
			open: true,
			closeDelay: 5000,
			type: 'foreground',
			...props,
		} satisfies AddToastProps<T>;

		const ids = {
			content: generateId(),
			title: generateId(),
			description: generateId(),
		};

		const toast = { id: ids.content, ids, ...propsWithDefaults };

		toasts.update((currentMap) => {
			currentMap.set(ids.content, toast);
			return new Map(currentMap);
		});

		get(handleClose)(ids.content);
		return toast;
	};

	const content = builder(name('content'), {
		stores: toasts,
		returned: ($toasts) => {
			return (id: string) => {
				const { open, ...toast } = $toasts.get(id)!;
				return {
					id,
					role: 'alert',
					'aria-describedby': toast.ids.description,
					'aria-labelledby': toast.ids.title,
					'aria-live': toast.type === 'foreground' ? 'assertive' : 'polite',
					'data-state': open ? 'open' : 'closed',
					style: styleToString({
						display: open ? undefined : 'none',
						'user-select': 'none',
						'-webkit-user-select': 'none',
					}),
					tabindex: -1,
					hidden: open ? undefined : true,
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
		stores: toasts,
		returned: ($toasts) => {
			return (id: string) => {
				const toast = $toasts.get(id)!;
				return {
					id: toast.ids.title,
				};
			};
		},
	});

	const description = builder(name('description'), {
		stores: toasts,
		returned: ($toasts) => {
			return (id: string) => {
				const toast = $toasts.get(id)!;
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
				setOpen(node.dataset.id as string, false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	return {
		toasts,
		addToast,
		content,
		title,
		description,
		close,
	};
}
