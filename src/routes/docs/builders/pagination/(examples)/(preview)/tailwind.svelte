<script lang="ts">
	import { createPagination } from '@melt-ui/svelte';
	import ChevronLeft from '~icons/lucide/ChevronLeft';
	import ChevronRight from '~icons/lucide/ChevronRight';
	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
		siblingCount: 1,
	});
</script>

<nav class="flex flex-col items-center gap-4" aria-label="pagination" melt={$root}>
	<p class="text-center">Showing items {$range.start} - {$range.end}</p>
	<div class="flex items-center gap-2">
		<button melt={$prevButton}><ChevronLeft /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button melt={$pageTrigger(page)}>{page.value}</button>
			{/if}
		{/each}
		<button melt={$nextButton}><ChevronRight /></button>
	</div>
</nav>

<style lang="postcss">
	button {
		display: grid;
		place-items: center;
		border-radius: theme('borderRadius.sm');
		background-color: theme('colors.white');
		color: theme('colors.magnum.700');
		box-shadow: theme('boxShadow.sm');

		font-size: theme('fontSize.sm');

		padding-inline: theme('spacing.3');
		height: theme('spacing.8');

		&:hover {
			opacity: 0.75;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&[data-selected] {
			background-color: theme('colors.magnum.900');
			color: theme('colors.white');
		}
	}
</style>
