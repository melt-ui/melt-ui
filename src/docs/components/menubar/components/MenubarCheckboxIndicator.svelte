<script lang="ts">
	import type { CheckboxItemIndicatorProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = CheckboxItemIndicatorProps;
	const checked = ctx.getCheckboxIndicator();
</script>

<div {...$$restProps}>
	{#if $checked}
		<slot checked={$checked} />
	{/if}
</div>
