import type { ClickOutsideConfig, FloatingConfig, FocusTrapConfig } from '$lib/internal/actions';
import type { Writable } from 'svelte/store';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig | null;
	clickOutside?: ClickOutsideConfig | null;
};

export type PopperArgs = {
	anchorElement: HTMLElement;
	open: Writable<boolean>;
	options?: PopperConfig;
};
