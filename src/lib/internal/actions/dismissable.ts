import type { Action } from 'svelte/action';
import { handleAndDispatchCustomEvent } from '../helpers/event';

export type ForwardedEvent<T extends Event> = CustomEvent<{
	originalEvent: T;
	preventDefault: () => void;
}>;

type Params = {
	disable?: boolean;
	onPointerDownOutside?: (e: ForwardedEvent<MouseEvent>) => void;
	onEscapeKeyDown?: (e: ForwardedEvent<KeyboardEvent>) => void;
	onDismiss?: () => void;
};

export const dismissable = ((node, params?: Params) => {
	let onPointerDownDismiss: Params['onPointerDownOutside'];
	let onEscapeKeyDown: Params['onEscapeKeyDown'];
	let onDismiss: Params['onDismiss'];

	const handleDismiss = (event: KeyboardEvent | MouseEvent) => {
		if (event instanceof KeyboardEvent && event.key === 'Escape') {
			handleAndDispatchCustomEvent('escDismiss', onEscapeKeyDown, {
				originalEvent: event,
				preventDefault: () => event.preventDefault(),
			});
			if (!event.defaultPrevented) {
				onDismiss?.();
			}
		}

		if (event instanceof MouseEvent && !node.contains(event.target as Node)) {
			handleAndDispatchCustomEvent('pointerDownDismiss', onPointerDownDismiss, {
				originalEvent: event,
				preventDefault: () => event.preventDefault(),
			});
			if (!event.defaultPrevented) {
				onDismiss?.();
			}
		}
	};

	const update = (params?: Params) => {
		document.removeEventListener('keydown', handleDismiss);
		document.removeEventListener('click', handleDismiss);
		if (params?.disable) return;

		onPointerDownDismiss = params?.onPointerDownOutside;
		onEscapeKeyDown = params?.onEscapeKeyDown;
		onDismiss = params?.onDismiss;
		document.addEventListener('keydown', handleDismiss);
		document.addEventListener('click', handleDismiss);
	};

	// TODO: This is a hack to avoid the dialog trigger being registered
	// as a click. We should find a better way to do this.
	sleep(1).then(() => {
		update(params);
	});

	return {
		update,
		destroy() {
			document.removeEventListener('keydown', handleDismiss);
			document.removeEventListener('click', handleDismiss);
		},
	};
}) satisfies Action;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
