<script lang="ts">
	import { createPagination } from '$lib';
	import ChevronLeft from '~icons/lucide/chevron-left';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
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
