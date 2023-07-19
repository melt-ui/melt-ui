import type { Defaults } from '$lib/internal/types';
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
import type { CreateToastProps } from './types';

type ToastParts = 'trigger' | 'content' | 'title' | 'description' | 'close';
const { name } = createElHelpers<ToastParts>('toast');

const defaults = {
	defaultOpen: false,
	closeDelay: 5000,
	type: 'foreground',
} satisfies Defaults<CreateToastProps>;

export function createToast(props: CreateToastProps = {}) {
	const propsWithDefaults = { ...defaults, ...props } satisfies CreateToastProps;
	const options = writable(propsWithDefaults);
	const open = writable<string[]>([]);
	const toasts = writable<any>([]);

	const ids = {
		trigger: generateId(),
		content: generateId(),
		title: generateId(),
		description: generateId(),
	};

	let timeouts = new Map<string, number>();

	const isOpen = (id: string, open: string[]) => {
		if (open === undefined) return false;
		return open.includes(id);
	};

	const isOpenStore = derived(open, ($open) => {
		return (id: string) => isOpen(id, $open);
	});

	const handleOpen = derived(options, () => {
		return (id: string): void => {
			if (timeouts.has(id)) {
				window.clearTimeout(timeouts.get(id));
				timeouts.delete(id);
			}
			open.update((current) => [...current, id]);
		};
	}) as Readable<(id: string) => void>;

	const handleClose = derived(options, ($options) => {
		return (id: string): void => {
			if (timeouts.has(id)) {
				window.clearTimeout(timeouts.get(id));
				timeouts.delete(id);
			}
			timeouts.set(id, window.setTimeout(() => {
				open.update((current) => current.filter((x) => x !== id));
			}, $options.closeDelay));
		};
	}) as Readable<(id: string) => void>;

	const addToast = (toast: any) => {
		const id = generateId();
		toasts.update((currentToasts) => [...currentToasts, { id, ...toast }]);
		open.update((currentOpen) => [...currentOpen, id]);
		get(handleClose)(id);
	};

	const content = builder(name('content'), {
		stores: [open, options],
		returned: ([$open, $options]) => {
			return (id) => {
				const open = isOpen(id, $open);
				return {
					id,
					role: 'alert',
					'aria-describedby': ids.description,
					'aria-labelledby': ids.title,
					'aria-live': $options.type === 'foreground' ? 'assertive' : 'polite',
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
					get(handleOpen)(node.id as string);
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)(node.id as string);
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
		returned: () => ({
			id: ids.title,
		}),
	});

	const description = builder(name('description'), {
		returned: () => ({
			id: ids.description,
		}),
	});

	const close = builder(name('close'), {
		returned: () => {
			return (id: string) => ({
				id,
				type: 'button',
			});
		},
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.update((current) => current.filter((x) => x !== (node.id as string)));
			});

			return {
				destroy: unsub,
			};
		},
	});

	return {
		toasts,
		addToast,
		isOpen: isOpenStore,
		content,
		title,
		description,
		close,
		options,
	};
}
