import { isBrowser, noop } from '$lib/internal/helpers';
import type { Defaults } from '$lib/internal/types';
import { get, writable } from 'svelte/store';

export type CreateHoverCardArgs = {
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	openDelay?: number;
	closeDelay?: number;
};

const defaults = {
	defaultOpen: false,
	onOpenChange: noop,
	openDelay: 700,
	closeDelay: 300,
} satisfies Defaults<CreateHoverCardArgs>;

export function createSwitch(args: CreateHoverCardArgs = {}) {
	const argsWithDefaults = { ...defaults, ...args } satisfies CreateHoverCardArgs;
	const options = writable(argsWithDefaults);
	const open = writable(argsWithDefaults.defaultOpen);
	const openTimer = writable(0);
	const closeTimer = writable(0);
	const hasSelection = writable(false);
	const isPointerDownOnContent = writable(false);

	function handleOpen() {
		if (!isBrowser) return;
		const $options = get(options);
		clearTimeout(get(closeTimer));
		openTimer.set(window.setTimeout(() => open.set(true), $options.openDelay));
	}

	function handleClose() {
		if (!isBrowser) return;
		clearTimeout(get(openTimer));
		if (!get(hasSelection) && !get(isPointerDownOnContent)) {
			const $options = get(options);
			closeTimer.set(window.setTimeout(() => open.set(false), $options.closeDelay));
		}
	}

	function handleDismiss() {
		open.set(false);
	}

	return {};
}
