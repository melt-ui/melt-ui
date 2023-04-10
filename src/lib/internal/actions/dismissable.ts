import type { Action } from 'svelte/action';
import { handleAndDispatchCustomEvent } from '../helpers/event';

type Params = {
	disable?: boolean;
	onPointerDownDismiss?: (e: CustomEvent<{ originalEvent: MouseEvent }>) => void;
	onEscDismiss?: (e: CustomEvent<{ originalEvent: KeyboardEvent }>) => void;
};

export const dismissable = ((node, params?: Params) => {
	let onPointerDownDismiss: Params['onPointerDownDismiss'];
	let onEscDismiss: Params['onEscDismiss'];

	const handleDismiss = (event: KeyboardEvent | MouseEvent) => {
		if (event instanceof KeyboardEvent && event.key === 'Escape') {
			handleAndDispatchCustomEvent('escDismiss', onEscDismiss, { originalEvent: event });
		}

		if (event instanceof MouseEvent && !node.contains(event.target as Node)) {
			handleAndDispatchCustomEvent('pointerDownDismiss', onPointerDownDismiss, {
				originalEvent: event,
			});
		}
	};

	const update = (params?: Params) => {
		document.removeEventListener('keydown', handleDismiss);
		document.removeEventListener('click', handleDismiss);
		if (params?.disable) return;

		onPointerDownDismiss = params?.onPointerDownDismiss;
		onEscDismiss = params?.onEscDismiss;
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
