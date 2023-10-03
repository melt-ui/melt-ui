<script lang="ts">
	import { createTooltip, melt, type CreateTooltipProps } from '$lib';
	import type { Writable } from 'svelte/store';

	export let open: Writable<boolean> | undefined = undefined;
	export let group: CreateTooltipProps['group'] = undefined;
	export let closeOnPointerDown: CreateTooltipProps['closeOnPointerDown'] = undefined;

	const {
		elements: { content, trigger },
		options,
	} = createTooltip({
		open,
		group,
		closeOnPointerDown,
	});

	$: options.group.set(group);
</script>

<button use:melt={$trigger} data-testid="trigger">Trigger</button>
<div use:melt={$content} data-testid="content">Content</div>
