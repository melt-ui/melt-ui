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

	<span use:melt={$thumb()} class="thumb" />

	{#each { length: $ticks } as _}
		<span use:melt={$tick()} class="thick" />
	{/each}
</span>

<style>
	* {
		all: unset;
	}

	:root {
		--black-40: #0006;
		--white-50: #ffffff80;
		--magnum-800-75: #964516bf;
	}

	.root {
		position: relative;
		display: flex;
		align-items: center;
		height: 1.25rem;
		width: 12.5rem;
	}

	.slide-bar {
		display: block;
		height: 3px;
		width: 100%;
		background-color: var(--black-40);
	}

	.range {
		height: 3px;
		background-color: white;
	}

	.thumb {
		display: block;
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 100%;
		background-color: white;

		z-index: 10;
	}

	.thumb:focus {
		box-shadow: 0 0 0 4px var(--black-40);
	}

	.thick {
		height: 3px;
		width: 3px;
		border-radius: 100%;
		background-color: var(--white-50);
	}

	:global([data-bounded]).thick {
		background-color: var(--magnum-800-75);
	}
</style>
