<script lang="ts">
	import { createChart, h_band, h_linear, v_linear } from '$lib/index.js';

	type R = { year: string, apples: number, bananas: number, cherries: number, dates: number }
	const rdata: R[] = [
		{year: '2019', apples: 3840, bananas: 1920, cherries: 960, dates: 400},
		{year: '2018', apples: 1600, bananas: 1440, cherries: 960, dates: 400},
		{year: '2017', apples: 820, bananas: 1000, cherries: 640, dates: 400},
		{year: '2016', apples: 820, bananas: 560, cherries: 720, dates: 400}
	];

	const meta = {
		myMeta: 'hello world'
	}

	export const chart = createChart({
		data: rdata,
		meta: meta,
		width: 0,
		height: 0,
		padding: 10,
		margin: 20,
		dimensions: {
			x: {
				get: 'year',
				...h_band
			},
			y: {
				get: row => [0, row.apples],
				domain: [0, null],
				...v_linear
			}
		}
	});

	const {
		data,
		width,
		height,
		area,
		dimensions: {
			x: {
				get_scaled: x_get_scaled,
				scale: x_scale
			},
			y: {
				get_scaled: y_get_scaled,
			}
		}
	} = chart;

</script>
<div class="w-[600px] h-[400px]">
	<div bind:clientWidth={$width} bind:clientHeight={$height} class="w-full h-full">
			{#if typeof window !== 'undefined' && $width && $height}
				<svg class="w-full h-full">
					<rect x={0} y={0} width={$area.width} height={$area.height} stroke="red" fill="none" stroke-width="3" stroke-dasharray="16 16" />
					<rect x={$area.margin.outer.left} y={$area.margin.outer.top} width={$area.margin.outer.width} height={$area.margin.outer.height} stroke="green" fill="none" stroke-width="3" stroke-dasharray="0 16 0" />

					<rect x={$area.margin.inner.left} y={$area.margin.inner.top} width={$area.margin.inner.width} height={$area.margin.inner.height} stroke="green" fill="none" stroke-width="3" stroke-dasharray="0 16 0" />
					<rect x={$area.padding.outer.left} y={$area.padding.outer.top} width={$area.padding.outer.width} height={$area.padding.outer.height} stroke="blue" fill="none" stroke-width="3" stroke-dasharray="16 16"  />

					<rect x={$area.padding.inner.left} y={$area.padding.inner.top} width={$area.padding.inner.width} height={$area.padding.inner.height} stroke="blue" fill="none" stroke-width="3" stroke-dasharray="16 16"  />

					<g transform="translate({$area.padding.inner.left}, {$area.padding.inner.top})">
						{#each $data as row, i}
							{@const x = $x_get_scaled(row)}
							{@const y = $y_get_scaled(row)}
							{@const w = $x_scale.bandwidth() }

							<rect x={x} y={y[1]} width={w} height={y[0] - y[1]} stroke="green" class="fill-white stroke-magnum-800 stroke-[2px]"/>
						{/each}
					</g>
				</svg>
			{/if}
		</div>
</div>