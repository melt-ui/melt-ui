<script lang="ts" context="module">
	import type { BaseProps, UnwrapCustomEvents, WrapWithCustomEvent } from '$lib/internal/types';
	export type HoverCardTriggerProps = BaseProps<'div'>;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';

	import { getRootContext } from './root.svelte';
	import { createEventDispatcher } from 'svelte';

	type $$Props = HoverCardTriggerProps;
	type $$Events = WrapWithCustomEvent<{
		change: boolean;
	}>;

	export let use: $$Props['use'] = [];

	const ctx = getRootContext();
	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	const change = (open: boolean) => {
		$ctx.open = open;
	};

	const open = () => {
		clearTimeout($ctx.closeTimer);
		$ctx.openTimer = setTimeout(() => change(true), $ctx.openDelay);
	};

	const close = () => {
		clearTimeout($ctx.openTimer);
		$ctx.closeTimer = setTimeout(() => change(false), $ctx.closeDelay);
	};

	$: dispatch('change', $ctx.open);
</script>

<Popper.Anchor
	on:pointerenter={open}
	on:pointerleave={close}
	on:focus={open}
	on:blur={close}
	on:touchstart={(e) => e.preventDefault()}
	use={[...(use ?? [])]}
>
	<slot data-state={$ctx.open ? 'open' : 'close'} />
</Popper.Anchor>
