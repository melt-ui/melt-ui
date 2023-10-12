<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
		states: { value },
	} = createSlider({
		defaultValue: [20, 80],
		max: 100,
	});
</script>

<span use:melt={$root} class="root">
	<span class="slide-bar">
		<span use:melt={$range} class="range" />
	</span>

	{#each $value as _}
		<span
			use:melt={$thumb()}
			class="thumb"
		/>
	{/each}
</span>

<style>
	.root{
		position: relative;
		display: flex;
		align-items: center;
		height: 20px;
		width: 200px;
	}

	.slide-bar{
		display: block;
		height: 3px;
		width: 100%;
		background-color: #0006;
	}

	.range{
		height: 3px;
		background-color: white;
	}

	.thumb{
		display: block;
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 100%;
		background-color: white;
	}

	.thumb:focus{
		box-shadow: 0 0 0 4px #0006;		
	}


</style>