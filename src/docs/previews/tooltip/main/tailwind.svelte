<script lang="ts">
	import { createTooltip } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Plus from '~icons/lucide/plus';

	const { trigger, content, open, arrow } = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 500,
	});
</script>

<button type="button" class="trigger" melt={$trigger} aria-label="Add">
	<Plus class="h-4 w-4" aria-label="plus" />
</button>

{#if $open}
	<div
		melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-md bg-white shadow-sm"
	>
		<div melt={$arrow} />
		<p class="px-4 py-1 text-magnum-700">Add item to library</p>
	</div>
{/if}

<style lang="postcss">
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply p-0 text-sm font-medium;
	}
</style>
