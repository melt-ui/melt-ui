<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		defaultValue: [30],
		max: 100,
		step: 1,
	});
</script>

<span use:melt={$root} class="root">
	<span class="slide-bar">
		<span use:melt={$range} class="range" />
	</span>
	<span use:melt={$thumb()} class="thumb" />
</span>

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	:root {
		--black-40: #0006;
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
	}

	.thumb:focus {
		box-shadow: 0 0 0 4px var(--black-40);
	}
</style>
