<script lang="ts" context="module">
	export type TooltipRootProps = BaseProps & {
		/** The controlled open state of the tooltip. */
		open?: boolean;
		/** Override the duration given to the `Provider` to customise the open delay for a specific tooltip. */
		delayDuration?: number;
		/** Prevents Tooltip.Content from remaining open when hovering. Disabling this has accessibility consequences. Inherits from Tooltip.Provider. */
		disableHoverableContent?: boolean;
	};

	type TooltipRootContext = {
		contentId: string;
		open: boolean;
		readonly stateAttribute: 'closed' | 'instant-open' | 'delayed-open';
		trigger: HTMLButtonElement | null;
		readonly onTriggerEnter: () => void;
		readonly onTriggerLeave: () => void;
		readonly onOpen: () => void;
		readonly onClose: () => void;
		readonly disableHoverableContent: boolean;
	};

	const defaults = {
		open: false,
		contentId: generateId(),
		trigger: null,
	} satisfies Defaults<TooltipRootContext>;

	const { getContext, setContext } = reactiveContext<TooltipRootContext>(defaults);
	export const getTooltipRootContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/internal/types';

	import { Popper } from '$lib/internal/components';
	import { generateId, reactiveContext, type Defaults } from '$lib/internal/helpers';
	import { onDestroy } from 'svelte';
	import { getTooltipProviderContext } from './provider.svelte';
	import { browser } from '$app/environment';
	import { TOOLTIP_OPEN } from './constants';

	type $$Props = TooltipRootProps;

	export let open: $$Props['open'] = defaults.open;
	export let delayDuration: $$Props['delayDuration'] = undefined;
	export let disableHoverableContent: $$Props['disableHoverableContent'] = undefined;
	export let use: $$Props['use'] = [];

	const providerCtx = getTooltipProviderContext();
	const ctx = setContext({
		open: (v) => {
			if (v) {
				$providerCtx?.onOpen();
				document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
			} else {
				$providerCtx?.onClose();
			}
			open = v;
		},
	});

	let openTimer = 0;
	$: disableHoverableContent = disableHoverableContent ?? $providerCtx?.disableHoverableContent;
	$: delayDuration = delayDuration ?? $providerCtx?.delayDuration;
	let wasOpenDelayed = false;
	$: stateAttribute = (function (): TooltipRootContext['stateAttribute'] {
		if (!$ctx.open) return 'closed';
		if (wasOpenDelayed) return 'delayed-open';
		return 'instant-open';
	})();
	const handleOpen = () => {
		window.clearTimeout(openTimer);
		wasOpenDelayed = false;
		ctx.update((p) => ({ ...p, open: true }));
	};
	const handleClose = () => {
		if (!browser) return;
		window.clearTimeout(openTimer);
		ctx.update((p) => ({ ...p, open: false }));
	};
	const handleDelayedOpen = () => {
		if (!browser) return;

		window.clearTimeout(openTimer);
		openTimer = window.setTimeout(() => {
			wasOpenDelayed = true;
			ctx.update((p) => ({ ...p, open: true }));
		}, delayDuration);
	};

	const onTriggerEnter = () => {
		if ($providerCtx?.isOpenDelayed) {
			handleDelayedOpen();
		} else {
			handleOpen();
		}
	};

	const onTriggerLeave = () => {
		if (disableHoverableContent) {
			handleClose();
		} else {
			window.clearTimeout(openTimer);
		}
	};

	onDestroy(() => {
		if (!browser) return;
		window.clearTimeout(openTimer);
	});

	$: ctx.update((prev) => {
		return {
			...prev,
			open,
			stateAttribute,
			onTriggerEnter,
			onTriggerLeave,
			onOpen: handleOpen,
			onClose: handleClose,
			disableHoverableContent,
		};
	});
</script>

<Popper.Root {use} {...$$restProps}>
	<slot />
</Popper.Root>
