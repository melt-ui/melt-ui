<script lang="ts">
	import { createPopover, melt, createTooltip } from '$lib/index.js';
	import { fade } from 'svelte/transition';

	const {
		elements: { trigger: popoverTrigger, content: popoverContent },
	} = createPopover({ positioning: { placement: 'bottom-start' } });

	const {
		elements: { trigger: tooltipTrigger, content: tooltipContent },
	} = createTooltip({
		openDelay: 0,
		closeDelay: 0,
	});
</script>

<div class="p-20">
	<button type="button" class="trigger" use:melt={$popoverTrigger} aria-label="Update dimensions">
		Open Popover
	</button>

	<div use:melt={$popoverContent} transition:fade={{ duration: 100 }} class=" content">
		<div class="flex flex-col gap-2.5">
			<button class="w-fit" use:melt={$tooltipTrigger}>Open Tooltip</button>
			<div class="z-50 rounded-xl bg-gray-950 px-3 py-1 text-gray-100" use:melt={$tooltipContent}>
				Tooltip content
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	button {
		@apply inline-flex items-center justify-center rounded-full bg-gray-300 px-3 py-1;
		@apply font-medium text-blue-900 transition-colors hover:bg-gray-300/90;
		@apply focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2;
	}

	.content {
		@apply z-10 w-60 rounded-xl bg-gray-200 p-5 shadow-sm;
	}
</style>
