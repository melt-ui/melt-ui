<script lang="ts" context="module">
	export type HoverCardRootProps = BaseProps & {
		/** The controlled open state of the hover card.*/
		open?: boolean;
		/** The duration (in ms) from when the mouse enters the trigger until the hover card opens. */
		openDelay?: number;
		/** The duration (in ms) from when the mouse leaves the trigger or content until the hover card closes. */
		closeDelay?: number;
	};

	export type Context = {
		open: boolean;

		readonly openDelay: number;
		readonly closeDelay: number;

		openTimer: NodeJS.Timeout | undefined;
		closeTimer: NodeJS.Timeout | undefined;
	};

	const { getContext, setContext } = reactiveContext<Context>();
	export const getRootContext = getContext;
</script>

<script lang="ts">
	import type { BaseProps } from '$lib/internal/types';

	import { reactiveContext } from '$lib/internal/helpers/reactiveContext';

	import { Popper } from '$lib/internal/components';

	type $$Props = HoverCardRootProps;

	export let open = false;
	export let openDelay = 750;
	export let closeDelay = 300;
	export let use: $$Props['use'] = [];

	const ctx = setContext({
		open: [open, (v) => (open = v)],
		openDelay: [openDelay],
		closeDelay: [closeDelay],
		openTimer: [undefined],
		closeTimer: [undefined],
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
