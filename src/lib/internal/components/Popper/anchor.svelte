<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import { getRootContext } from './root.svelte';

	export type PopperAnchorProps = BaseProps;
</script>

<script lang="ts">
	type $$Props = PopperAnchorProps;
	export let use: $$Props['use'] = [];

	let element: HTMLDivElement;

	const rootContext = getRootContext();
	$: $rootContext.anchor = element;
</script>

<div
	{...$$restProps}
	use:useActions={use ?? []}
	bind:this={element}
	on:click
	on:pointerenter
	on:pointerleave
	on:focus
	on:blur
	on:touchstart
>
	<slot />
</div>
