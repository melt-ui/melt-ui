<script lang="ts">
	import { createPopover, createTagsInput, melt, type CreatePopoverProps } from '$lib/index.js';
	import { Settings2 } from '$icons/index.js';

	export let portal: CreatePopoverProps['portal'];

	const {
		elements: { trigger, content, arrow, close },
	} = createPopover({ portal });

	export let defaultTags = ['Svelte', 'Typescript'];
	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags },
	} = createTagsInput({ defaultTags });
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
	<div use:melt={$root}>
		{#each $tags as t, i}
			<div data-testid="tag-{i}" use:melt={$tag(t)}>
				<span>{t.value}</span>
				<button data-testid="delete-tag-{i}" use:melt={$deleteTrigger(t)}> Delete </button>
			</div>
			<div data-testid="edit-tag-{i}" use:melt={$edit(t)} />
		{/each}

		<input use:melt={$input} type="text" placeholder="Enter tags..." />
	</div>

	<button use:melt={$close} data-testid="popover-close"> Close </button>
</div>
<div class="mt-48 h-[500px] w-[500px] bg-black" />
<div data-testid="outside" class="h-5 w-5" />
