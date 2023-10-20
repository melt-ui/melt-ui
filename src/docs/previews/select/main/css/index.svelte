<script lang="ts">
	import { createSelect, melt } from '$lib/index.js';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary'],
	};

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selectedLabel, open },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true,
		},
	});
</script>

<div class="container">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="label" use:melt={$label}>Favorite Flavor</label>
	<button class="trigger" use:melt={$trigger} aria-label="Food">
		{$selectedLabel || 'Select a flavor'}
		<ChevronDown class="square-5" />
	</button>
	{#if $open}
		<div class="menu" use:melt={$menu} transition:fade={{ duration: 150 }}>
			{#each Object.entries(options) as [key, arr]}
				<div use:melt={$group(key)}>
					<div class="grouplabel" use:melt={$groupLabel(key)}>
						{key}
					</div>
					{#each arr as item}
						<div class="item" use:melt={$option({ value: item, label: item })}>
							<div class="check {$isSelected(item) ? 'block' : 'hidden'}">
								<Check class="square-4" />
							</div>

							{item}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	:root {
		--magnum-900: #793a15;
		--magnum-700: #bd5711;
		--magnum-500: #f38d1c;
		--magnum-200: #fce0ac;
		--magnum-100: #fef2d6;
		--neutral-800: rgb(38, 38, 38, 1);
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		display: block;
		color: var(--magnum-900);
	}

	.trigger {
		display: flex;
		height: 2.5rem;
		min-width: 220px;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.5rem;
		background-color: white;
		padding: 0.5rem 0.75rem;
		color: var(--magnum-700);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

		transition-property: opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
	}

	.trigger:hover {
		opacity: 0.9;
	}

	.square-5 {
		width: 1.25rem;
		height: 1.25rem;
	}

	.square-4 {
		width: 1rem;
		height: 1rem;
	}
	.menu {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		border-radius: 0.5rem;
		background-color: white;
		padding: 0.25rem;
		z-index: 10;
		max-height: 300px;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.menu:focus {
		box-shadow: none;
	}

	.grouplabel {
		padding: 0.25rem 1rem;
		text-transform: capitalize;
		color: var(--neutral-800);
		font-weight: 600;
	}

	.item {
		display: block;
		position: relative;
		cursor: pointer;
		border-radius: 0.5rem;
		padding: 0.25rem 1rem 0.25rem 2rem;
		color: var(--neutral-800);
	}

	.item:hover {
		background-color: var(--magnum-100);
	}

	.item:focus {
		z-index: 10;
		color: var(--magnum-700);
	}
	.item[data-highlighted] {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.check {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		z-index: 20;
		translate: 0 calc(-50% + 1px);
		color: var(--magnum-500);
	}

	.block {
		display: block;
	}

	.hidden {
		display: none;
	}
</style>
