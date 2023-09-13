<script lang="ts">
	import { createSelect, melt } from '$lib/index.js';
	import { Check, ChevronDown } from 'lucide-svelte';
	import { tick } from 'svelte';

	export let multiple = false;
	export let defaultValue: string | undefined = undefined;

	const {
		elements: { trigger, menu, option, group, groupLabel },
		states: { selected, selectedLabel },
		helpers: { isSelected },
	} = createSelect({
		multiple,
		defaultSelected: defaultValue
			? {
					value: defaultValue,
					label: defaultValue,
			  }
			: undefined,
	});

	let options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<main>
	<button
		on:click={() => {
			selected.set({ value: 'Chocolate', label: 'Chocolate' });
		}}
		data-testid="manual-btn"
	>
		Manual set
	</button>

	<button
		on:click={async () => {
			options.sweet.push('Vanilla');
			// trigger the update
			options = options;
			// Let the DOM update
			await tick();
			selected.set({
				value: 'Vanilla',
				label: 'Vanilla',
			});
		}}
		data-testid="update-btn"
	>
		Update options and set
	</button>

	<button use:melt={$trigger} aria-label="Food" data-testid="trigger">
		{$selectedLabel || 'Select an option'}
		<ChevronDown />
	</button>

	<div use:melt={$menu} data-testid="menu">
		{#each Object.entries(options) as [key, arr]}
			<div use:melt={$group(key)} data-testid="group-{key}">
				<div use:melt={$groupLabel(key)} data-testid="label-{key}">{key}</div>
				{#each arr as item, i}
					<div
						use:melt={$option({ value: item, label: item, disabled: i === 2 })}
						data-testid="{key}-option-{i}"
					>
						{#if $isSelected(item)}
							<div data-testid="check-{i}">
								<Check />
							</div>
						{/if}
						{item}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</main>
