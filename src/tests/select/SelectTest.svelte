<script lang="ts">
	import { createSelect, melt, type CreateSelectProps } from '$lib/index.js';
	import { Check } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { removeUndefined } from '../utils';

	export let multiple = false;
	export let defaultValue: string | undefined = undefined;
	export let closeOnEscape = true;
	export let closeOnOutsideClick = true;
	export let ids: CreateSelectProps['ids'] = undefined;
	export let onOutsideClick: CreateSelectProps['onOutsideClick'] = undefined;
	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { selected, selectedLabel },
		helpers: { isSelected },
		ids: { trigger: triggerId },
	} = createSelect(
		removeUndefined({
			multiple,
			defaultSelected: defaultValue
				? {
						value: defaultValue,
						label: defaultValue,
				  }
				: undefined,
			closeOnEscape,
			closeOnOutsideClick,
			ids,
			onOutsideClick,
		})
	);

	let options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
</script>

<main>
	<label for={$triggerId} use:melt={$label} data-testid="label">Label</label>
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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			data-testid="icon"
			><path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="m6 9l6 6l6-6"
			/></svg
		>
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
	<div data-testid="outside" />
</main>
