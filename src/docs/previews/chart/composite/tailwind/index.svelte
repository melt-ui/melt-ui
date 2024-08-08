<script lang="ts">
	import { createChart, h_band, v_linear, melt, h_linear } from '$lib/index.js';
	import { writable } from 'svelte/store';
	import { scaleFactoryTime } from '$lib/builders/chart/scale.js';

	type Fruit = 'apples' | 'bananas' | 'cherries' | 'dates';

	const fruits: Fruit[] = ['apples', 'bananas', 'cherries', 'dates'];

	const rdata: Array<{ year: string } & { [fruit in Fruit]?: number}> = [
		{year: '2019', apples: 3840, bananas: 1920, cherries: 960, dates: 400},
		{year: '2018', apples: 1600, bananas: 4000, cherries: 960, dates: 400},
		{year: '2017', apples: 820, bananas: 200, cherries: 640, dates: 400},
		{year: '2016', apples: 1200, bananas: 560, cherries: 720, dates: 400}
	];

	const tdata = rdata.reduce(
		(acc, cur) => {
			return Object.fromEntries(Object.entries(acc).map(([fruit, acc]) => [fruit, acc + cur[fruit] ?? 0]))
		},
		Object.fromEntries(fruits.map(fruit => [fruit, 0] as [string, number]))
	);

	const domain = writable(undefined);

	const chart_total = createChart({
		data: [tdata],
		padding: 10,
		margin: 10,
		dimensions: {
			time: {
				discrete: true,
				get: () => 'total',
				...h_band
			},
			total: {
				get_sub: {
					apples: 'apples',
					bananas: 'bananas',
					cherries: 'cherries',
					dates: 'dates',
					stack: (row) => fruits.reduce((acc, cur) => [...acc, acc[acc.length - 1] + (row[cur] ?? 0)], [0])
				},
				domain,
				...v_linear
			}
		}
	});

	const chart_series = createChart({
		data: rdata,
		padding: 10,
		margin: 10,
		dimensions: {
			time: {
				get: 'year',
				...h_linear,
				scaleFactoryTime
			},
			total: {
				get_sub: {
					apples: 'apples',
					bananas: 'bananas',
					cherries: 'cherries',
					dates: 'dates',
					stack: (row) => fruits.reduce((acc, cur) => [...acc, acc[acc.length - 1] + (row[cur] ?? 0)], [0])
				},
				domain,
				...v_linear
			}
		}
	});

	const {
		data: ct_data,
		area: ct_area,
		elements: {
			root: ct_root
		},
		dimensions: {
			time: {
				get_scaled: ct_x,
				scale: ct_scale
			},
			total: {
				get_sub_scaled: {
					stack: ct_y_stack
				},
				extents: ct_extents
			}
		}
	} = chart_total;

	const {
		data: cs_data,
		area: cs_area,
		elements: {
			root: cs_root
		},
		dimensions: {
			time: {
				get_scaled: cs_x,
			},
			total: {
				get_sub_scaled: {
					stack: cs_y_stack
				},
				extents: cs_extents
			}
		}
	} = chart_series;

	$: if ($cs_extents && $ct_extents) $domain = [Math.min($cs_extents[0], $ct_extents[0]), Math.max($cs_extents[1], $ct_extents[1])];

	$: console.log($ct_extents, $cs_extents, $domain);

</script>
<style lang="postcss">
	div {
			border: 2px solid red;
	}

	rect[data-series='apples'],
	path[data-series='apples'] {
			@apply stroke-green-700;
			@apply fill-green-300;
	}

  rect[data-series='bananas'],
  path[data-series='bananas'] {
      @apply stroke-yellow-500;
      @apply fill-yellow-200;
  }

  rect[data-series='cherries'],
  path[data-series='cherries'] {
      @apply stroke-red-700;
      @apply fill-red-300;
  }

  rect[data-series='dates'],
  path[data-series='dates'] {
      @apply stroke-amber-950;
      @apply fill-amber-800;
  }
</style>

<div class="w-[700px] h-[400px] grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr]">
	<div class="min-w-[100px]">
		Total
	</div>
	<div>
		Series
	</div>
	<div use:melt={$ct_root}>
		{#if typeof window !== 'undefined' && $ct_area.width && $ct_area.height}
			<svg class="w-full h-full">
				<g transform="translate({$ct_area.padding.inner.left}, {$ct_area.padding.inner.top})">
					{#each $ct_data as row}
						{#each fruits as fruit, index}
							<rect
								x={$ct_x(row)}
								y={$ct_y_stack(row)[index + 1]}
								width={$ct_scale.bandwidth()}
								height={$ct_y_stack(row)[index] - $ct_y_stack(row)[index + 1]}
								data-series={fruit}
								/>
						{/each}
					{/each}
				</g>
			</svg>
		{/if}
	</div>
	<div use:melt={$cs_root}>
		{#if typeof window !== 'undefined' && $cs_area.width && $cs_area.height}
			<svg class="w-full h-full">
				<g transform="translate({$cs_area.padding.inner.left}, {$cs_area.padding.inner.top})">
					{#each fruits as fruit, index}
						<path
							d={'M' + $cs_data.map(row => `${$cs_x(row)},${$cs_y_stack(row)[index + 1]}`).join('L') + 'L' + $cs_data.slice().reverse().map(row => `${$cs_x(row)},${$cs_y_stack(row)[index]}`).join('L') + 'Z'}
							class="stroke-green-600"
							data-series={fruit}
						/>
					{/each}
				</g>
			</svg>
		{/if}
	</div>
</div>
