<script lang="ts">
	import { createPopover, createTooltip, melt, type CreateTooltipProps } from '$lib/index.js';
	import { Settings2 } from '$icons/index.js';

	export let portal: CreateTooltipProps['portal'] = undefined;
	export let tooltipCloseOnEscape: CreateTooltipProps['closeOnEscape'] = true;

	const {
		elements: { trigger, content, arrow, close },
	} = createPopover({ portal });

	const {
		elements: { trigger: ttTrigger, content: ttContent },
	} = createTooltip({
		openDelay: 0,
		closeDelay: 0,
		portal,
		closeOnEscape: tooltipCloseOnEscape,
	});
</script>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
	data-testid="popover-trigger"
>
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

<div use:melt={$content} data-testid="popover-content">
	<div use:melt={$arrow} data-testid="popover-arrow" />
	<button use:melt={$ttTrigger} data-testid="tooltip-trigger"> Open tooltip </button>
	<div use:melt={$ttContent} data-testid="tooltip-content">Tooltip content</div>
	<button use:melt={$close} data-testid="popover-close"> Close </button>
</div>
<div class="mt-48 h-[500px] w-[500px] bg-black" />
<div data-testid="outside" class="h-5 w-5" />
