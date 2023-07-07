<script lang="ts">
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';

	const { root: vertical } = createSeparator({
		orientation,
	});

	const { root: horizontalSeparator } = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
</script>

<h2 class="font-bold">Melt UI</h2>
<p>Flavors for everyone</p>
<div melt={$horizontalSeparator} class="my-3.5 h-[1px] w-full bg-white" />
<div class="flex items-center space-x-3.5">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div melt={$vertical} class="h-4 w-[1px] bg-white" />
		{/if}
	{/each}
</div>
