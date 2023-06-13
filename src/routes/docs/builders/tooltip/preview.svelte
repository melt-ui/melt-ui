<script lang="ts">
	import { createTooltip } from '$lib';
	import { Docs } from '$routes/(components)';
	import { fade } from 'svelte/transition';
	import Plus from '~icons/lucide/plus';
	import X from '~icons/lucide/x';

	const { trigger, content, open, arrow } = createTooltip({
		positioning: {
			placement: 'top',
		},
	});
</script>

<Docs.PreviewWrapper>
	<button type="button" class="trigger" {...$trigger} aria-label="Update dimensions">
		<Plus class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	{#if $open}
		<div
			{...$content}
			transition:fade|local={{ duration: 100 }}
			class="z-10 rounded-md bg-white shadow-sm"
		>
			<div {...$arrow} />
			<p class="px-4 py-1 text-magnum-700">Add to library</p>
		</div>
	{/if}
</Docs.PreviewWrapper>

<style lang="postcss">
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90 focus-visible:outline-none;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
