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

<h2>Melt UI</h2>
<p>Flavors for everyone</p>
<div use:melt={$horizontal} class="separator separator--horizontal" />
<div class="ice-creams">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div use:melt={$vertical} class="separator separator--vertical" />
		{/if}
	{/each}
</div>

<style>
	h2 {
		font-weight: 700;
	}

	.ice-creams {
		display: flex;
		align-items: center;
		column-gap: 0.875rem;
	}

	.separator {
		background-color: rgb(var(--color-white) / 1);
	}

	.separator--horizontal {
		margin-top: 0.875rem;
		margin-bottom: 0.875rem;
		height: 1px;
		width: 100%;
	}

	.separator--vertical {
		height: 1rem;
		width: 1px;
	}
</style>
