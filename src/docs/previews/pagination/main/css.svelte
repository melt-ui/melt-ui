<script lang="ts">
	import { createPagination, melt } from '$lib';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const {
		elements: { root, pageTrigger, prevButton, nextButton },
		states: { pages, range },
	} = createPagination({
		count: 100,
		perPage: 10,
		defaultPage: 1,
		siblingCount: 1,
	});
</script>

<nav aria-label="pagination" use:melt={$root}>
	<p class="text-center">
		Showing items {$range.start} - {$range.end}
	</p>
	<div class="buttons">
		<button use:melt={$prevButton}><ChevronLeft /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button use:melt={$pageTrigger(page)}>{page.value}</button>
			{/if}
		{/each}
		<button use:melt={$nextButton}><ChevronRight /></button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.text-center {
		text-align: center;
	}

	button {
		display: grid;
		place-items: center;
		border-radius: 2px;
		background-color: #fff;
		color: rgb(189, 87, 17);
		box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
			rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

		font-size: 14px;

		padding-inline: 0.75rem;
		height: 2rem;
	}

	button:hover {
		opacity: 0.75;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	nav :global(button[data-selected]) {
		background-color: rgb(121, 58, 21);
		color: #fff;
	}

	.buttons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
