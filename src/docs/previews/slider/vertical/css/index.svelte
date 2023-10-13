<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';

	const {
		elements: { root, range, thumb },
	} = createSlider({
		defaultValue: [30],
		max: 100,
		orientation: 'vertical',
	});
</script>

<span use:melt={$root} class="root">
	<span class="slide-bar">
		<span use:melt={$range} class="range" />
	</span>
	<span use:melt={$thumb()} class="thumb" />
</span>

<style>
	:root {
		--black-50: #0006;
	}

	* {
		all: unset;
	}

	.root {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 12.5rem;
		width: 3px;
	}

	.slide-bar {
		display: block;
		height: 12.5rem;
		width: 100%;
		background-color: var(--black-50);
	}

	.range {
		width: 100%;
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
		box-shadow: 0 0 0 4px var(--black-50);
	}
</style>
