<script lang="ts">
	import { createPopover, createSelect, melt, type CreateSelectProps } from '$lib/index.js';
	import { Settings2 } from '$icons/index.js';

	export let portal: CreateSelectProps['portal'] = undefined;

	const {
		elements: { trigger, content, arrow, close },
	} = createPopover({ portal });

	const {
		elements: { trigger: selectTrigger, menu, option },
	} = createSelect({ portal });
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
	<button use:melt={$selectTrigger} data-testid="select-trigger"> Open Select </button>
	<div use:melt={$menu} data-testid="select-menu">
		<div use:melt={$option({ value: 'option 1', label: 'option 1' })}>option 1</div>
	</div>
	<button use:melt={$close} data-testid="popover-close">Close</button>
</div>
<div class="mt-48 h-[500px] w-[500px] bg-black" />
<div data-testid="outside" class="h-5 w-5" />
