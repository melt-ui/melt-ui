<script lang="ts">
	import { createChart, h_band, h_linear, v_linear } from '$lib/index.js';

	type R = { year: string, apples: number, bananas: number, cherries: number, dates: number }
	const rdata: R[] = [
		{year: '2019', apples: 3840, bananas: 1920, cherries: 960, dates: 400},
		{year: '2018', apples: 1600, bananas: 4000, cherries: 960, dates: 400},
		{year: '2017', apples: 820, bananas: 200, cherries: 640, dates: 400},
		{year: '2016', apples: 1200, bananas: 560, cherries: 720, dates: 400}
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
				accessors: {
					apples: row => [0, row.apples],
					bananas: 'bananas'
				},
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
				scaled_d: x_scaled_d,
				scaler_d: x_scaler_d
			},
			y: {
				scaleds_d: {
					apples: y_scaled_d_apples,
					bananas: y_scaled_d_bananas
				},
			}
		}
	} = chart;

</script>
<h1>Multi</h1>
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
							{@const x = $x_scaled_d(row)}
							{@const y = $y_scaled_d_apples(row)}
							{@const w = $x_scaler_d.bandwidth() }

							<rect x={x} y={y[1]} width={w} height={y[0] - y[1]} stroke="green" class="fill-white stroke-magnum-800 stroke-[2px]"/>
						{/each}

						<g transform="translate({$x_scaler_d.bandwidth() / 2}, 0)">
							<path d="M{$data.map(row => `${$x_scaled_d(row)}, ${$y_scaled_d_bananas(row)}`).join(' L')}" class="fill-none stroke-magnum-800 stroke-[4px]"/>
							<path d="M{$data.map(row => `${$x_scaled_d(row)}, ${$y_scaled_d_bananas(row)}`).join(' L')}" class="fill-none stroke-magnum-300 [stroke-dasharray:4_4] stroke-[2px]"/>
						</g>
					</g>
				</svg>
			{/if}
		</div>
</div>