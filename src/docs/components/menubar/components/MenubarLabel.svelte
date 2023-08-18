<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { LabelProps } from '../types.js';
	type $$Props = LabelProps;
	export let asChild = false;
	const { groupLabel, id } = ctx.getGroupLabel();
</script>

{#if asChild}
	<slot builder={$groupLabel(id)} />
{:else}
	<div use:melt={$groupLabel(id)} {...$$restProps}>
		<slot builder={$groupLabel(id)} />
	</div>
{/if}
