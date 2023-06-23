<script lang="ts">
	import { createPagination } from '$lib/builders/pagination';
	import { Docs } from '$routes/(components)';
	import ChevronLeft from '~icons/lucide/chevron-left';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
		siblingCount: 1,
	});
</script>

<Docs.PreviewWrapper>
	<nav class="flex flex-col items-center gap-4" aria-label="pagination" {...root}>
		<p class="text-center">Showing items {$range.start} - {$range.end}</p>
		<div class="flex items-center gap-2">
			<button {...$prevButton} use:prevButton.action><ChevronLeft /></button>
			{#each $pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<span>...</span>
				{:else}
					<button {...$pageTrigger(page)} use:pageTrigger.action>{page.value}</button>
				{/if}
			{/each}
			<button {...$nextButton} use:nextButton.action><ChevronRight /></button>
		</div>
	</nav>
</Docs.PreviewWrapper>

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

		&:first-child,
		&:last-child {
			padding-inline: theme('spacing.2');
		}
	}
</style>
