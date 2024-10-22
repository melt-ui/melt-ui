<script lang="ts">
	import { createSlider, melt } from '$lib/index.js';
	export let componentRoot;
	const {
		elements: { root, range, thumbs },
	} = createSlider({
		defaultValue: [30],
		min: 0,
		max: 100,
		step: 1,
		rootElement: componentRoot,
	});
</script>

<span use:melt={$root} class="root">
	<span class="range-wrapper">
		<span use:melt={$range} class="range" />
	</span>

	<span use:melt={$thumbs[0]} class="thumb" />
</span>
