<script lang="ts">
	import { createPopover, melt, type CreatePopoverProps } from '$lib/index.js';
	import { Settings2 } from '$icons/index.js';
	import { initLevel } from './level.js';

	export let portal: CreatePopoverProps['portal'] = undefined;

	const {
		elements: { trigger, content, arrow, close },
	} = createPopover({ portal });

	const level = initLevel();
</script>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
	data-testid="popover-trigger-{level}"
>
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

<div use:melt={$content} data-testid="popover-content-{level}">
	<div use:melt={$arrow} data-testid="popover-arrow-{level}" />
	<slot />
	<button use:melt={$close} data-testid="popover-close-{level}"> Close </button>
</div>
<div data-testid="popover-outside-{level}" />
