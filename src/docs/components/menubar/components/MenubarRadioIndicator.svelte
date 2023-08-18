<script lang="ts">
	import { ctx } from "../ctx.js";
	const { isChecked, value } = ctx.getRadioIndicator();
</script>

{#if $isChecked(value)}
	<slot />
{/if}
