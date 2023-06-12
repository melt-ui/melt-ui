import type { FocusTrapConfig, FloatingConfig, ClickOutsideConfig } from '$lib/internal/actions';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig;
	clickOutside?: ClickOutsideConfig;
};
