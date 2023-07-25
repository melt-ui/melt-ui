<script lang="ts">
	import { createPagination } from '@melt-ui/svelte';
	import ChevronLeft from '~icons/lucide/chevron-left';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { prevButton, nextButton, pages, pageTrigger, range, root } =
		createPagination({
			count: 100,
			perPage: 10,
			page: 1,
			siblingCount: 1,
		});
</script>

<nav
	class="flex flex-col items-center gap-4"
	aria-label="pagination"
	melt={$root}
>
	<p class="text-center">
		Showing items {$range.start} - {$range.end}
	</p>
	<div class="flex items-center gap-2">
		<button
			class="grid h-8 items-center rounded-sm bg-white px-3 text-sm text-magnum-700 shadow-sm
			hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
			data-[selected]:text-white"
			melt={$prevButton}><ChevronLeft /></button
		>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button
					class="grid h-8 items-center rounded-sm bg-white px-3 text-sm text-magnum-700 shadow-sm
					hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
				data-[selected]:text-white"
					melt={$pageTrigger(page)}>{page.value}</button
				>
			{/if}
		{/each}
		<button
			class="grid h-8 items-center rounded-sm bg-white px-3 text-sm text-magnum-700 shadow-sm
			hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:bg-magnum-900
		data-[selected]:text-white"
			melt={$nextButton}><ChevronRight /></button
		>
	</div>
</nav>
