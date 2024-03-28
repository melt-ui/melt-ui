import type {
	FloatingConfig,
	FocusTrapConfig,
	PortalConfig,
	EscapeKeydownConfig,
} from '$lib/internal/actions/index.js';
import type { VirtualElement } from '@floating-ui/core';
import type { Writable } from 'svelte/store';
import type { ModalConfig } from '../modal/types.js';
import type { WithGet } from '$lib/internal/helpers/withGet.js';

export type PopperConfig = {
	floating?: FloatingConfig;
	focusTrap?: FocusTrapConfig | null;
	modal?: ModalConfig | null;
	portal?: PortalConfig | null;
	escapeKeydown?: EscapeKeydownConfig | null;
};

export type PopperArgs = {
	anchorElement: Element | VirtualElement;
	open: WithGet<Writable<boolean>>;
	options?: PopperConfig;
};
