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
} satisfies Defaults<CreateToastProps>;

export function createToast(props: CreateToastProps = {}) {
	const propsWithDefaults = { ...defaults, ...props } satisfies CreateToastProps;
	const options = writable(propsWithDefaults);
	const open = writable(propsWithDefaults.defaultOpen);

	const ids = {
		trigger: generateId(),
		content: generateId(),
		title: generateId(),
		description: generateId(),
	};

	let timeout: number | null = null;

	const handleOpen = derived(options, () => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}

			open.set(true);
		};
	}) as Readable<() => void>;

	const handleClose = derived(options, ($options) => {
		return () => {
			if (timeout) {
				window.clearTimeout(timeout);
				timeout = null;
			}
			timeout = window.setTimeout(() => {
				open.set(false);
			}, $options.closeDelay);
		};
	}) as Readable<() => void>;

	const trigger = builder(name('trigger'), {
		stores: open,
		returned: ($open) => {
			return {
				role: 'button' as const,
				'aria-haspopup': 'alert' as const,
				'aria-expanded': $open,
				'data-state': $open ? 'open' : 'closed',
				'aria-controls': ids.content,
				id: ids.trigger,
			};
		},
		action: (node: HTMLElement) => {
			const unsub = executeCallbacks(
				addEventListener(node, 'click', () => {
					open.set(true);
					get(handleClose)();
				})
			);

			return {
				destroy: unsub,
			};
		},
	});

	const content = builder(name('content'), {
		stores: open,
		returned: ($open) => {
			return {
				id: ids.content,
				role: 'alert',
				'aria-describedby': ids.description,
				'aria-labelledby': ids.title,
				'data-state': $open ? 'open' : 'closed',
				style: styleToString({
					display: $open ? undefined : 'none',
					'user-select': 'none',
					'-webkit-user-select': 'none',
				}),
				tabindex: -1,
				hidden: $open ? undefined : true,
			};
		},
		action: (node: HTMLElement) => {
			let unsub = noop;

			const unsubTimers = () => {
				if (timeout) {
					window.clearTimeout(timeout);
				}
			};

			unsub = executeCallbacks(
				addEventListener(node, 'pointerenter', (e) => {
					if (isTouch(e)) return;
					get(handleOpen)();
				}),
				addEventListener(node, 'pointerleave', (e) => {
					if (isTouch(e)) return;
					get(handleClose)();
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
		returned: () =>
			({
				type: 'button',
			} as const),
		action: (node: HTMLElement) => {
			const unsub = addEventListener(node, 'click', () => {
				open.set(false);
			});

			return {
				destroy: unsub,
			};
		},
	});

	return {
		trigger,
		open,
		content,
		title,
		description,
		close,
		options,
	};
}
