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
	floating?: FloatingConfig | undefined;
	focusTrap?: FocusTrapConfig | null | undefined;
	modal?: ModalConfig | null | undefined;
	portal?: PortalConfig | null | undefined;
	escapeKeydown?: EscapeKeydownConfig | null | undefined;
	preventTextSelectionOverflow?: PreventTextSelectionOverflowConfig | null | undefined;
};

export type PopperArgs = {
	anchorElement: Element | VirtualElement;
	open: Writable<boolean>;
	options?: PopperConfig | undefined;
};
