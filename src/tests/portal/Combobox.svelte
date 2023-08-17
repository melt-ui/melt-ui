<script lang="ts">
	import { createCombobox, melt } from '$lib/index.js';
	import { initLevel } from './level.js';

	let items = Array(10)
		.fill(null)
		.map(() => '');

	const {
		elements: { menu, input, item, label },
	} = createCombobox();

	const level = initLevel();
</script>

<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
<label use:melt={$label}> Label </label>

<input use:melt={$input} data-testid="combobox-trigger-{level}" />

<ul use:melt={$menu} data-testid="combobox-content-{level}">
	<slot />
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div tabindex="0">
		{#each items as it, index (index)}
			<li
				use:melt={$item({
					value: it,
				})}
			>
				{it}
			</li>
		{/each}
	</div>
</ul>

<div data-testid="combobox-outside-{level}" />
