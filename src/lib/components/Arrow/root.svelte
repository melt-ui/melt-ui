<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';

	export type ArrowRootProps = BaseProps<'svg'> & {
		width?: number;
		height?: number;
	};
</script>

<script lang="ts">
	type $$Props = ArrowRootProps;

	export let width = 10;
	export let height = 5;
</script>

<svg {...$$restProps} {width} {height} viewBox="0 0 30 10" preserveAspectRatio="none">
	{#if $$slots.default}
		<slot />
	{:else}
		<polygon points="0,0 30,0 15,10" />
	{/if}
	<slot />
</svg>
