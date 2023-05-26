<script lang="ts" context="module">
	import { reactiveContext, type Defaults, isBrowser } from '$lib/internal/helpers';
	import type { Writable } from 'svelte/store';

	export type TooltipProviderProps = {
		delayDuration?: number;
		skipDelayDuration?: number;
		disableHoverableContent?: boolean;
	};

	type TooltipProviderContext = {
		readonly isOpenDelayed: boolean;
		readonly delayDuration: number;
		readonly onOpen: () => void;
		readonly onClose: () => void;
		readonly disableHoverableContent: boolean;
		isPointerInTransit: boolean;
	};

	const defaults = {
		isOpenDelayed: true,
		isPointerInTransit: false,
		disableHoverableContent: false,
	} satisfies Defaults<TooltipProviderContext>;

	const { getContext, setContext } = reactiveContext<TooltipProviderContext>(defaults);
	export const getTooltipProviderContext = getContext as () =>
		| Writable<TooltipProviderContext>
		| undefined;
</script>

<script lang="ts">
	type $$Props = TooltipProviderProps;
	export let delayDuration: $$Props['delayDuration'] = 300;
	export let skipDelayDuration: $$Props['skipDelayDuration'] = 300;
	export let disableHoverableContent: $$Props['disableHoverableContent'] =
		defaults.disableHoverableContent;

	let skipDelayTimer = 0;
	let isOpenDelayed: boolean = defaults.isOpenDelayed;

	const handleOpen = () => {
		if (!isBrowser) return;
		window.clearTimeout(skipDelayTimer);
		isOpenDelayed = false;
	};

	const handleClose = () => {
		if (!isBrowser) return;

		window.clearTimeout(skipDelayTimer);
		skipDelayTimer = window.setTimeout(() => {
			isOpenDelayed = true;
		}, skipDelayDuration);
	};

	const ctx = setContext();
	$: ctx.update((prev) => ({
		...prev,
		delayDuration,
		isOpenDelayed,
		onOpen: handleOpen,
		onClose: handleClose,
		disableHoverableContent,
	}));
</script>

<slot />
