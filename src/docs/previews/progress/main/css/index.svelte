<script lang="ts">
	import { createProgress, melt } from '$lib/index.js';
	import { writable } from 'svelte/store';

	const value = writable(30);

	const {
		elements: { root },
		options: { max },
	} = createProgress({
		value,
		max: 100,
	});

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	sleep(1000).then(() => {
		value.set(75);
	});
</script>

<div use:melt={$root} class="track">
	<div
		class="progress-bar"
		style={`transform: translateX(-${
			100 - (100 * ($value ?? 0)) / ($max ?? 1)
		}%)`}
	/>
</div>

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	.track {
		display: block;
		position: relative;
		height: 1.5rem;
		width: 300px;
		overflow: hidden;
		border-radius: 99999px;
		background-color: rgb(0 0 0 / 0.4);
	}

	.progress-bar {
		display: block;
		width: 100%;
		height: 100%;
		background-color: white;
		transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);
	}
</style>
