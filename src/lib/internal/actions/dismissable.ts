import type { Action } from 'svelte/action';

type Params = {
	onDismiss?: () => void;
	disable?: boolean;
};

export const dismissable = ((node, params: Params) => {
	let onDismiss: Params['onDismiss'] | null = null;

	// Dismiss when clicking outside or pressing escape
	const handleDismiss = (event: KeyboardEvent | MouseEvent) => {
		console.log('handleDismiss', event);
		if (event instanceof KeyboardEvent && event.key !== 'Escape') {
			return;
		}

		if (event instanceof MouseEvent && node.contains(event.target as Node)) {
			return;
		}

		onDismiss?.();
	};

	const update = (params: Params) => {
		document.removeEventListener('keydown', handleDismiss);
		document.removeEventListener('click', handleDismiss);
		if (params.disable) return;
		onDismiss = params.onDismiss;
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
