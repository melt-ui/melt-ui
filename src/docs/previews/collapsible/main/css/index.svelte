<script lang="ts">
	import { createCollapsible, melt } from '$lib/index.js';
	import { slide } from 'svelte/transition';
	import { ChevronsUpDown, X } from 'lucide-svelte';

	const {
		elements: { root, content, trigger },
		states: { open },
	} = createCollapsible();
</script>

<div use:melt={$root} class="root">
	<div class="header">
		<span class="title"> @thomasglopes starred 3 repositories </span>
		<button use:melt={$trigger} class="trigger" aria-label="Toggle">
			<div class="abs-center">
				{#if $open}
					<X class="square-4" />
				{:else}
					<ChevronsUpDown class="square-4" />
				{/if}
			</div>
		</button>
	</div>

	<div class="item my-2">melt-ui/melt-ui</div>

	{#if $open}
		<div class="content" use:melt={$content} transition:slide>
			<div class="item">sveltejs/svelte</div>
			<div class="item">sveltejs/kit</div>
		</div>
	{/if}
</div>

<style>
	* {
		all: unset;
		box-sizing: border-box;

		--magnum-50: #fff9ed;
		--magnum-100: #fef2d6;
		--magnum-200: #fce0ac;
		--magnum-300: #f9c978;
		--magnum-400: #f7b155;
		--magnum-500: #f38d1c;
		--magnum-600: #e47312;
		--magnum-700: #bd5711;
		--magnum-800: #964516;
		--magnum-900: #793a15;
		--magnum-950: #411c09;

		--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.root {
		display: block;

		position: relative;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 7rem;
		width: 18rem;
		max-width: 100%;
	}
	@media (min-width: 640px) {
		.root {
			width: 25rem;
		}
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 600;
		color: var(--magnum-900);
	}

	.trigger {
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: var(--magnum-800);
		box-shadow: var(--shadow);
		place-items: center;
		position: relative;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 0.375rem;
		--un-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--un-bg-opacity));
	}

	.trigger:hover {
		opacity: 0.75;
	}

	:global([data-disabled]).trigger {
		cursor: not-allowed;
		opacity: 0.75;
	}

	.item {
		display: block;

		border-radius: 0.5rem;
		background-color: white;
		padding: 0.75rem;

		box-shadow: var(--shadow);
		color: black;
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.content {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		left: 0;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Utilities */
	.abs-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.root :global(.square-4) {
		height: 1rem;
		width: 1rem;
	}

	.my-2 {
		margin-block: 0.5rem;
	}
</style>
