<script lang="ts">
	import { createCombobox, melt } from '$lib';
	import { initLevel } from './level';

	let items = Array(10)
		.fill(null)
		.map(() => '');

	const {
		elements: { menu, input, item, label },
		states: { filteredItems },
	} = createCombobox({
		items,
		filterFunction: (item, value) => item.includes(value),
	});

	const level = initLevel();
</script>

<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
<label use:melt={$label}> Label </label>

<input use:melt={$input} data-testid="combobox-trigger-{level}" />

<ul use:melt={$menu} data-testid="combobox-content-{level}">
	<slot />
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div tabindex="0">
		{#if $filteredItems.length !== 0}
			{#each $filteredItems as it, index (index)}
				<li
					use:melt={$item({
						index,
						item: it,
					})}
				>
					{it}
				</li>
			{/each}
		{:else}
			<li>No results found</li>
		{/if}
	</div>
</ul>

<div data-testid="combobox-outside-{level}" />
