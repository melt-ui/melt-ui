import type {
	ClickOutsideConfig,
	FloatingConfig,
	FocusTrapConfig,
	PortalConfig,
} from '$lib/internal/actions';
import type { VirtualElement } from '@floating-ui/core';
import type { Writable } from 'svelte/store';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig | null;
	clickOutside?: ClickOutsideConfig | null;
	portal?: PortalConfig | null;
};

export type PopperArgs = {
	anchorElement: Element | VirtualElement;
	open: Writable<boolean>;
	options?: PopperConfig;
};
