import type { ClickOutsideConfig, FloatingConfig, FocusTrapConfig } from '$lib/internal/actions';
import type { Writable } from 'svelte/store';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig;
	clickOutside?: ClickOutsideConfig;
};

export type PopperArgs = {
	anchorElement: HTMLElement;
	open: Writable<boolean>;
	options?: PopperConfig;
};
