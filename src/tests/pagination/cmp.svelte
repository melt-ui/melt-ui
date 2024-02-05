<script lang="ts">
	import { createPagination, melt } from '$lib/index.js';
	import { ChevronLeft, ChevronRight } from '$icons/index.js';

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

<nav aria-label="pagination" use:melt={$root} data-testid="root">
	<p>
		Showing items {$range.start} - {$range.end}
	</p>
	<div>
		<button use:melt={$prevButton} data-testid="prev"><ChevronLeft class="square-4" /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button use:melt={$pageTrigger(page)}>{page.value}</button>
			{/if}
		{/each}
		<button use:melt={$nextButton} data-testid="next"><ChevronRight class="square-4" /></button>
	</div>
</nav>
