<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { TriggerEvents, TriggerProps } from '../types.js';

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	const {
		elements: { trigger },
	} = ctx.getMenu();
</script>

<button use:melt={$trigger} {...$$restProps} on:m-click on:m-keydown on:m-pointerenter>
	<slot builder={$trigger} />
</button>
