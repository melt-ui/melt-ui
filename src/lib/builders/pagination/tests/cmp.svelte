<script lang="ts">
	import { createPagination } from '@melt-ui/svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const {
		elements: { prevButton, nextButton, pageTrigger, root },
		states: { range, pages },
	} = createPagination({
		count: 100,
		perPage: 10,
		defaultPage: 1,
		siblingCount: 1,
	});
</script>

<nav aria-label="pagination" melt={$root} data-testid="root">
	<p>
		Showing items {$range.start} - {$range.end}
	</p>
	<div>
		<button melt={$prevButton} data-testid="prev"><ChevronLeft /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button melt={$pageTrigger(page)}>{page.value}</button>
			{/if}
		{/each}
		<button melt={$nextButton} data-testid="next"><ChevronRight /></button>
	</div>
</nav>
