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
				accessor: 'year',
				...h_band
			},
			y: {
				accessor: 'apples',
				domain: [0, null],
				...v_linear
			}
		}
	});

	const {
		data,
		width,
		height,
		area_d,
		dimensions: {
			x: {
				accessor_d: xAccessorD,
				scaled_d: xGetScaled,
				scaler_d: xGetScaler
			},
			y: {
				scaled_d: yGetScaled,
				scaler_d: yGetScaler,
				range_d: xRange
			}
		}
	} = chart;

</script>
<div class="w-[600px] h-[400px]">
	<div bind:clientWidth={$width} bind:clientHeight={$height} class="w-full h-full">
			{#if typeof window !== 'undefined' && $width && $height}
				<svg class="w-full h-full">
					<rect x={0} y={0} width={$area_d.width} height={$area_d.height} stroke="red" fill="none" stroke-width="3" stroke-dasharray="16 16" />
					<rect x={$area_d.margin.outer.left} y={$area_d.margin.outer.top} width={$area_d.margin.outer.width} height={$area_d.margin.outer.height} stroke="green" fill="none" stroke-width="3" stroke-dasharray="0 16 0" />

					<rect x={$area_d.margin.inner.left} y={$area_d.margin.inner.top} width={$area_d.margin.inner.width} height={$area_d.margin.inner.height} stroke="green" fill="none" stroke-width="3" stroke-dasharray="0 16 0" />
					<rect x={$area_d.padding.outer.left} y={$area_d.padding.outer.top} width={$area_d.padding.outer.width} height={$area_d.padding.outer.height} stroke="blue" fill="none" stroke-width="3" stroke-dasharray="16 16"  />

					<rect x={$area_d.padding.inner.left} y={$area_d.padding.inner.top} width={$area_d.padding.inner.width} height={$area_d.padding.inner.height} stroke="blue" fill="none" stroke-width="3" stroke-dasharray="16 16"  />

					<g transform="translate({$area_d.padding.inner.left}, {$area_d.padding.inner.top})">
						{#each $data as row, i}
							{@const x = $xGetScaled(row)}
							{@const y0 = $yGetScaler(0)}
							{@const y = $yGetScaled(row)}
							{@const w = $xGetScaler.bandwidth() }

							<rect x={x} y={y} width={w} height={y0 - y} stroke="green" class="fill-white stroke-magnum-800 stroke-[2px]"/>
						{/each}
					</g>
				</svg>
			{/if}
		</div>
</div>