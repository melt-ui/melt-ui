<script lang="ts">
	import { melt } from '$lib';
	import { ctx } from '../ctx.js';
	import type { DescriptionProps } from '../types.js';

	type $$Props = DescriptionProps;
	export let asChild = false;
	const description = ctx.get().elements.description;
</script>

{#if asChild}
	<slot builder={$description} />
{:else}
	{@const builder = $description}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
