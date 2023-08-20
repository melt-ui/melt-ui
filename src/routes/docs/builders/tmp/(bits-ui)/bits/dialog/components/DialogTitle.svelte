<script lang="ts">
	import { melt } from '$lib';
	import { ctx } from '../ctx.js';
	import type { TitleProps } from '../types.js';

	type $$Props = TitleProps;
	export let level: TitleProps['level'] = 'h2';
	export let asChild = false;
	const title = ctx.get().elements.title;
</script>

{#if asChild}
	<slot builder={$title} />
{:else}
	{@const builder = $title}
	<svelte:element this={level} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</svelte:element>
{/if}
