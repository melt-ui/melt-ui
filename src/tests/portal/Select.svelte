<script lang="ts">
	import { createSelect, melt } from '$lib/index.js';
	import { initLevel } from './level.js';

	const {
		elements: { trigger, menu, option, group, groupLabel, label },
		states: { valueLabel },
	} = createSelect();

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};

	const level = initLevel();
</script>

<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
<label use:melt={$label}>Favorite Flavor</label>
<button use:melt={$trigger} aria-label="Food" data-testid="select-trigger-{level}">
	{$valueLabel || 'Select a flavor'}
</button>

<div use:melt={$menu} data-testid="select-content-{level}">
	<slot />
	{#each Object.entries(options) as [key, arr]}
		<div use:melt={$group(key)}>
			<div use:melt={$groupLabel(key)}>
				{key}
			</div>
			{#each arr as item}
				<div use:melt={$option({ value: item, label: item })}>
					{item}
				</div>
			{/each}
		</div>
	{/each}
</div>

<div data-testid="select-outside-{level}" />
