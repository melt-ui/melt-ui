<script lang="ts">
	import { createChart, melt } from '$lib';
	import { writable } from 'svelte/store';

	const padding = writable(30);
	const margin = writable(30);

	const chart = createChart({
		data: [],
		margin,
		padding,
		dimensions: {
		}
	})

	const {
		area,
		elements: {
			root
		}
	} = chart;

	$: console.log($area);
</script>
<h1>Layout</h1>
<div class="w-[600px] h-[300px]">
	<div use:melt={$root} class="w-full h-full">
		{#if typeof window !== 'undefined' && $area.width && $area.height}
			<svg class="w-full h-full">
				<g>
					<!-- entire area -->
					<rect
						x={0}
						y={0}
						width={$area.width}
						height={$area.height}
						class="stroke-none fill-gray-200"
					/>

					<!-- margin outer -->
					<rect
						x={$area.margin.outer.left}
						y={$area.margin.outer.top}
						width={$area.margin.outer.width}
						height={$area.margin.outer.height}
						class="stroke-none fill-fuchsia-200"
					/>

					<!-- padding outer -->
					<rect
						x={$area.padding.outer.left}
						y={$area.padding.outer.top}
						width={$area.padding.outer.width}
						height={$area.padding.outer.height}
						class="stroke-none fill-indigo-200"
					/>

					<!-- padding inner -->
					<rect
						x={$area.padding.inner.left}
						y={$area.padding.inner.top}
						width={$area.padding.inner.width}
						height={$area.padding.inner.height}
						class="stroke-none fill-emerald-300"
					/>
				</g>

				<!-- entire area -->
				<rect
					x={0}
					y={0}
					width={$area.width}
					height={$area.height}
					class="stroke-gray-400 fill-none stroke-2 [stroke-dasharray:16_16]"
				/>


				<!-- margin outer -->
				<rect
					x={$area.margin.outer.left}
					y={$area.margin.outer.top}
					width={$area.margin.outer.width}
					height={$area.margin.outer.height}
					class="stroke-fuchsia-800 fill-none stroke-2 [stroke-dasharray:0_16_0]"
				/>

				<!-- margin inner -->
				<rect
					x={$area.margin.inner.left}
					y={$area.margin.inner.top}
					width={$area.margin.inner.width}
					height={$area.margin.inner.height}
					class="stroke-fuchsia-800 fill-none stroke-2 [stroke-dasharray:0_16_0]"
				/>

				<!-- padding outer -->
				<rect
					x={$area.padding.outer.left}
					y={$area.padding.outer.top}
					width={$area.padding.outer.width}
					height={$area.padding.outer.height}
					class="stroke-indigo-800 fill-none stroke-2 [stroke-dasharray:16_16]"
				/>

				<!-- padding inner -->
				<rect
					x={$area.padding.inner.left}
					y={$area.padding.inner.top}
					width={$area.padding.inner.width}
					height={$area.padding.inner.height}
					class="stroke-indigo-800 fill-none stroke-2 [stroke-dasharray:16_16]"
				/>
			</svg>
		{/if}
	</div>
</div>
