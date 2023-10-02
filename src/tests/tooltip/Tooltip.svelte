<script lang="ts">
	import { createTooltip, melt, type CreateTooltipProps } from '$lib';
	import type { Writable } from 'svelte/store';

	export let open: Writable<boolean>;
	export let group: CreateTooltipProps['group'] = undefined;

	const {
		elements: { content, trigger },
		options,
	} = createTooltip({
		open,
		group,
		// Make sure tests pass even if the default
		// value changes some day in the future
		openDelay: 1000,
	});

	$: options.group.set(group);
</script>

<button use:melt={$trigger}>Trigger</button>
<div use:melt={$content}>Content</div>
