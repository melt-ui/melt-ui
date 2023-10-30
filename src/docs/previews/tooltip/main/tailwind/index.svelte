<script lang="ts">
	import { createTooltip, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { Plus } from 'lucide-svelte';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true,
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
	<Plus class="square-4" aria-label="plus" />
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-lg bg-white shadow"
	>
		<div use:melt={$arrow} />
		<p class="px-4 py-1 text-magnum-700">Add item to library</p>
	</div>
{/if}

<style lang="postcss">
	.trigger {
		--_apply:  inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		--_apply:  text-magnum-900 transition-colors hover:bg-white/90;
		--_apply:  focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		--_apply:  p-0 text-sm font-medium;
	}
</style>
