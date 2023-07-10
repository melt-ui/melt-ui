<script lang="ts">
	import { h4 as H4 } from '$docs/components/markdown';
	import { InfoPopover } from '$docs/components';
</script>

<div class="mt-2 flex items-center gap-1.5">
	<H4 class="mt-0">
		<slot />
	</H4>
	{#if $$slots.info}
		<InfoPopover>
			<slot name="info" />
		</InfoPopover>
	{/if}
</div>
