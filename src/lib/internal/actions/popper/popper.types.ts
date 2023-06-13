import type { FocusTrapConfig, FloatingConfig, ClickOutsideConfig } from '$lib/internal/actions';
import type { Attach } from '$lib/internal/helpers';
import type { Writable } from 'svelte/store';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig;
	clickOutside?: ClickOutsideConfig;
};

export type PopperArgs = {
	anchorElement: HTMLElement;
	popperElement: HTMLElement;
	open: Writable<boolean>;
	options?: PopperConfig;
};
