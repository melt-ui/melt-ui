<script lang="ts" context="module">
	export type HoverCardRootProps = BaseProps & {
		/** The controlled open state of the hover card.*/
		open?: boolean;
		/** The duration (in ms) from when the mouse enters the trigger until the hover card opens. */
		openDelay?: number;
		/** The duration (in ms) from when the mouse leaves the trigger or content until the hover card closes. */
		closeDelay?: number;
	};

	type RootContext = {
		open: boolean;
		openTimer: NodeJS.Timeout | undefined;
		closeTimer: NodeJS.Timeout | undefined;
		readonly openDelay: number;
		readonly closeDelay: number;
	};

	const defaults = {
		open: false,
		openDelay: 750,
		closeDelay: 300,
	} satisfies Defaults<RootContext>;

	const { getContext, setContext } = newReactiveContext<RootContext>(defaults);
	export const getRootContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps, Defaults } from '$lib/internal/types';

	import { Popper } from '$lib/internal/components';
	import { newReactiveContext } from '$lib/internal/helpers/newReactiveContext';

	type $$Props = HoverCardRootProps;

	export let open: $$Props['open'] = defaults.open;
	export let openDelay: $$Props['openDelay'] = defaults.openDelay;
	export let closeDelay: $$Props['closeDelay'] = defaults.closeDelay;
	export let use: $$Props['use'] = [];

	const ctx = setContext({
		open: (v) => (open = v),
	});

	$: ctx.update((prev) => ({
		...prev,
		open,
		openDelay,
		closeDelay,
	}));
</script>

<Popper.Root {use} {...$$restProps}>
	<slot />
</Popper.Root>
