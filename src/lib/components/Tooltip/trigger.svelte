<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';
	export type TooltipTriggerProps = BaseProps<'button'>;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';

	import { onDestroy } from 'svelte';
	import { getTooltipProviderContext } from './provider.svelte';
	import { getTooltipRootContext } from './root.svelte';
	import { browser } from '$app/environment';

	type $$Props = TooltipTriggerProps;

	export let use: $$Props['use'] = [];

	const ctx = getTooltipRootContext();
	const providerCtx = getTooltipProviderContext();

	let ref: HTMLButtonElement | null = null;
	let isPointerDown = false;
	let hasPointerMoveOpened = false;
	const handlePointerUp = () => {
		isPointerDown = false;
	};

	onDestroy(() => {
		if (!browser) return;
		document.removeEventListener('pointerup', handlePointerUp);
	});
</script>

<Popper.Anchor
	as="button"
	aria-describedby={$ctx.open ? $ctx.contentId : undefined}
	data-state={$ctx.stateAttribute}
	bind:ref
	on:pointermove
	on:pointermove={(event) => {
		if (event.pointerType === 'touch') return;
		if (!hasPointerMoveOpened && !$providerCtx?.isPointerInTransit) {
			$ctx.onTriggerEnter();
			hasPointerMoveOpened = true;
		}
	}}
	on:pointerleave
	on:pointerleave={() => {
		$ctx.onTriggerLeave();
		hasPointerMoveOpened = false;
	}}
	on:pointerdown
	on:pointerdown={() => {
		if (!browser) return;
		isPointerDown = true;
		document.addEventListener('pointerup', handlePointerUp, { once: true });
	}}
	on:focus
	on:focus={() => {
		if (isPointerDown) return;
		$ctx.onOpen();
	}}
	on:blur
	on:blur={() => {
		$ctx.onClose();
	}}
	on:click
	on:click={() => {
		$ctx.onClose();
	}}
	use={[...(use ?? [])]}
	{...$$restProps}
>
	<slot />
</Popper.Anchor>
