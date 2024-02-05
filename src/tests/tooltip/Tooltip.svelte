<script lang="ts">
	import { createTooltip, melt, type CreateTooltipProps } from '$lib/index.js';
	import type { Writable } from 'svelte/store';
	import { removeUndefined } from '../utils.js';

	export let open: Writable<boolean> | undefined = undefined;
	export let group: CreateTooltipProps['group'] = undefined;
	export let closeOnPointerDown: CreateTooltipProps['closeOnPointerDown'] = false;
	export let ids: CreateTooltipProps['ids'] = undefined;

	const {
		elements: { content, trigger },
		options,
	} = createTooltip(
		removeUndefined({
			open,
			group,
			closeOnPointerDown,
			openDelay: 0,
			closeDelay: 0,
			ids,
		})
	);

	$: options.group.set(group);
</script>

<button use:melt={$trigger} data-testid="trigger">Trigger</button>
<div use:melt={$content} data-testid="content">Content</div>
