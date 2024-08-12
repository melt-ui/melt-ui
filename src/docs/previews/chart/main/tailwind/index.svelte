<script lang="ts">
	import { createChart, h_band, h_linear, v_linear, melt } from '$lib/index.js';
	import { utcFormat, utcParse } from 'd3-time-format';
	import { timeDay, timeMonth, utcYear } from 'd3-time';
	import { scaleFactoryTime, scaleFactoryUtc } from '$lib/builders/chart/scale.js';

	const parse_date = utcParse("%Y-%m-%d")
	const format_date = utcFormat("%Y-%m-%d");
	const format_month = utcFormat("%b");
	const format_year = utcFormat("%Y");

	const rdata = timeDay
		.every(1)!
		.range(
			timeMonth.floor(timeDay.offset(new Date(), -365/2)),
			timeMonth.ceil(new Date())
		)
		.map(
			(date, i) =>
				({ date: format_date(date), value: i*i })
		);

	export const chart = createChart({
		data: rdata,
		padding: 10,
		margin: {
			top: 0,
			left: 60,
			bottom: 40,
			right: 0
		},
		dimensions: {
			x: {
				get: row => parse_date(row.date),
				...h_linear,
				scaleFactory: scaleFactoryTime
			},
			y: {
				get: 'value',
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
		elements: {
			root
		},
		dimensions: {
			x: {
				get_scaled: x_get_scaled,
				scale: x_scale
			},
			y: {
				get_scaled: y_get_scaled,
				scale: y_scale
			}
		}
	} = chart;

	$: x_ticks = $x_scale.ticks(timeMonth.every(1));

	$: console.log( 'ticks', x_ticks );

</script>
<div class="w-[600px] h-[400px]">
	<div use:melt={$root} class="w-full h-full">
			{#if typeof window !== 'undefined' && $width && $height}
				<svg class="w-full h-full">
					<g transform="translate({$area.padding.inner.left}, {$area.padding.inner.top})">
						<path
							d="M{$data.map(row => `${$x_get_scaled(row)},${$y_get_scaled(row)}`).join('L')}"
							class="stroke-indigo-900 fill-none stroke-2"
							/>
					</g>

					<g transform="translate({$area.margin.inner.left}, {$area.padding.inner.top})">
						<line
							x1={0}
							x2={0}
							y1={0}
							y2={$area.padding.inner.height}
							class="stroke-black stroke-[3px] [stroke-linecap:round]"
						/>

						{#each $y_scale.ticks() as tick, i}
							<g transform="translate(0, {$y_scale(tick)})">
								<line
									x1={-5}
									y1={0}
									x2={0}
									y2={0}
									class="stroke-black stroke-[3px] [stroke-linecap:round]"
								/>

								<text
									x={-10}
									y={0}
									dominant-baseline="middle"
									text-anchor="end"
									class="fill-black"
									data-tick={JSON.stringify(tick)}
								>{tick}</text>
							</g>
						{/each}
					</g>


					<g transform="translate({$area.padding.inner.left}, {$area.margin.inner.bottom})">
						<line
							x1={0}
							x2={$area.padding.inner.width}
							y1={0}
							y2={0}
							class="stroke-black stroke-[3px] [stroke-linecap:round]"
						/>

						{#each x_ticks as tick, i}
							<g transform="translate({($x_scale(tick) + $x_scale(timeMonth.offset(tick, 1)))/2}, 0)">
								<line
									x1={0}
									y1={0}
									x2={0}
									y2={5}
									class="stroke-black stroke-[3px] [stroke-linecap:round]"
								/>

								<text
									x={0}
									y={10}
									dominant-baseline="hanging"
									text-anchor="middle"
									class="fill-black"
								>{format_month(tick)}</text>
								<text
									x={0}
									y={26}
									dominant-baseline="hanging"
									text-anchor="middle"
									class="fill-black"
								>{format_year(tick)}</text>
							</g>

						{/each}
					</g>

				</svg>
			{/if}
		</div>
</div>