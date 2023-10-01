<script lang="ts">
	import { createAccordion, melt } from '$lib/index.js';
	import { slide } from 'svelte/transition';

	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion({
		defaultValue: 'item-1',
	});

	const items = [
		{
			id: 'item-1',
			title: 'What is it?',
			description:
				'A collection of accessible & unstyled component builders for Svelte applications.',
		},
		{
			id: 'item-2',
			title: 'Can I customize it?',
			description: 'Totally, it is 100% stylable and overridable.',
		},
		{
			id: 'item-3',
			title: 'Svelte is awesome, huh?',
			description: 'Yes, and so are you!',
		},
	];
</script>

<div class="root" {...$root}>
	{#each items as { id, title, description }}
		<div use:melt={$item(id)} class="item">
			<h2 class="flex">
				<button use:melt={$trigger(id)} class="trigger">
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div class="content" use:melt={$content(id)} transition:slide>
					<div>
						{description}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	* {
		all: unset;
	}

	:root {
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

		--neutral-50: #fafafa;
		--neutral-100: #f5f5f5;
		--neutral-200: #e5e5e5;
		--neutral-300: #d4d4d4;
		--neutral-400: #a3a3a3;
		--neutral-500: #737373;
		--neutral-600: #525252;
		--neutral-700: #404040;
		--neutral-800: #262626;
		--neutral-900: #171717;
		--neutral-950: #0a0a0a;

		--shadow-xl: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
	}

	.root {
		/* mx-auto w-[18rem] max-w-full rounded-xl bg-white shadow-lg sm:w-[25rem]; */
		display: block;
		margin-inline: auto;
		width: 18rem;
		max-width: 100%;
		border-radius: 0.75rem;
		overflow: hidden;

		background-color: white;
		box-shadow: var(--shadow-xl);
	}

	@media (min-width: 640px) {
		.root {
			width: 25rem;
		}
	}

	.item {
		overflow: hidden;
	}

	.trigger {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: space-between;

		cursor: pointer;
		background-color: white;
		color: black;

		font-size: 1rem;
		font-weight: 500;
		line-height: 1rem;

		padding: 1.25rem;
		width: 100%;

		transition: 250ms ease;
	}

	.trigger:hover {
		background-color: var(--neutral-100);
	}

	.trigger:focus-visible {
		color: var(--magnum-800);
		box-shadow: none !important;
	}

	.item:nth-child(n + 1) .trigger {
		border-top: 1px solid var(--neutral-300);
	}

	.content {
		display: block;

		box-shadow: inset 0px 1px 0px var(--neutral-300);
		overflow: hidden;
		background-color: var(--neutral-100);
		color: var(--neutral-600);
		font-size: 0.875rem;
	}

	.content > div {
		display: block;
		padding: 1rem 1.25rem;
	}
</style>
