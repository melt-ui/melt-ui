<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';
	import { getRootContext } from './root.svelte';

	export type PopperAnchorProps = BaseProps;
</script>

<script lang="ts">
	type $$Props = PopperAnchorProps;

	let element: HTMLDivElement;

	const rootContext = getRootContext();
	$: $rootContext.anchor = element;
</script>

<div {...$$restProps} bind:this={element} on:click on:pointerenter on:pointerleave on:focus on:blur on:touchstart>
	<slot />
</div>
