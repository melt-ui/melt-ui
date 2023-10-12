<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb, tick },
		states: { ticks },
	} = createSlider({
		defaultValue: [5],
		min: 0,
		step: 1,
		max: 10,
	});
</script>

<span use:melt={$root} class="root">
	<span class="slide-bar">
		<span use:melt={$range} class="range" />
	</span>

	<span
		use:melt={$thumb()}
		class="thumb"
	/>

	{#each { length: $ticks } as _}
		<span
			use:melt={$tick()}
			class="thick"
		/>
	{/each}
</span>
<style >
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
		height: 5px;
		width: 5px;
		border-radius: 100%;
		background-color: white;

		z-index: 10;
	}

	.thumb:focus{
		box-shadow: 0 0 0 4px #0006;		
	}

	.thick{
		height: 3px;
		width: 3px;
		border-radius: 100%;
		background-color: #ffffff80;
	}

	.thick[data-bounded]{
		background-color: #964516bf;
	}


</style>