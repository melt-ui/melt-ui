<script lang="ts">
	import { createSeparator, melt, type CreateSeparatorProps } from '$lib';

	export let orientation: CreateSeparatorProps['orientation'] = 'vertical';

	const {
		elements: { root: vertical },
	} = createSeparator({
		orientation,
	});

	const {
		elements: { root: horizontal },
	} = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
</script>

<div>
	<h2 class="font-bold">Melt UI</h2>
	<p>Flavors for everyone</p>
	<div use:melt={$horizontal} class="my-3.5 h-[1px] w-full bg-white" />
	<div class="flex items-center space-x-3.5">
		{#each icecreams as icecream, i}
			<p>{icecream}</p>
			{#if i !== icecreams.length - 1}
				<div use:melt={$vertical} class="h-4 w-[1px] bg-white" />
			{/if}
		{/each}
	</div>
</div>
