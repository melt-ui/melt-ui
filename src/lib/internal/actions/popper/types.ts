import type {
	FloatingConfig,
	FocusTrapConfig,
	PortalConfig,
	EscapeKeydownConfig,
} from '$lib/internal/actions/index.js';
import type { VirtualElement } from '@floating-ui/core';
import type { Writable } from 'svelte/store';
import type { ModalConfig } from '../modal/types.js';
import type { PreventTextSelectionOverflowConfig } from '../prevent-text-selection-overflow/types.js';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig | null;
	modal?: ModalConfig | null;
	portal?: PortalConfig | null;
	escapeKeydown?: EscapeKeydownConfig | null;
	preventTextSelectionOverflow?: PreventTextSelectionOverflowConfig | null;
};

export type PopperArgs = {
	anchorElement: Element | VirtualElement;
	open: Writable<boolean>;
	options?: PopperConfig;
};
