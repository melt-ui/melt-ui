<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { GroupProps } from '../types.js';
	type $$Props = GroupProps;

	export let asChild = false;
	const { group, id } = ctx.setGroup();
</script>

<div use:melt={$group(id)} {...$$restProps}>
	<slot builder={$group(id)} />
</div>
