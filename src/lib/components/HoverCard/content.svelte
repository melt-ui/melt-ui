<script lang="ts" context="module">
	export type HoverCardContentProps = PopperContentProps;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';
	import type { PopperContentProps } from '$lib/internal/components/Popper';

	import { getRootContext } from './root.svelte';

	type $$Props = HoverCardContentProps;

	const ctx = getRootContext();

	export let side: $$Props['side'] = 'bottom';
	export let sideOffset: $$Props['sideOffset'] = 0;
	export let align: $$Props['align'] = 'center';
	export let alignOffset: $$Props['alignOffset'] = 0;
	export let arrowPadding: $$Props['arrowPadding'] = 0;
	export let collisionBoundary: $$Props['collisionBoundary'] = [];
	export let collisionPadding: $$Props['collisionPadding'] = 0;
	export let sticky: $$Props['sticky'] = 'partial';
	export let hideWhenDetached: $$Props['hideWhenDetached'] = false;
	export let avoidCollisions: $$Props['avoidCollisions'] = true;

	function active() {
		clearTimeout($ctx.closeTimer);
		$ctx.closeTimer = undefined;
	}

	function inactive() {
		$ctx.closeTimer = setTimeout(() => ($ctx.open = false), $ctx.closeDelay);
	}
</script>

<Popper.Content
	on:pointerenter={active}
	on:pointerleave={inactive}
	on:focus={active}
	on:blur={inactive}
	{side}
	{sideOffset}
	{align}
	{alignOffset}
	{arrowPadding}
	{collisionBoundary}
	{collisionPadding}
	{sticky}
	{hideWhenDetached}
	{avoidCollisions}
	data-state={$ctx.open ? 'open' : 'closed'}
	{...$$restProps}
>
	<slot />
</Popper.Content>
