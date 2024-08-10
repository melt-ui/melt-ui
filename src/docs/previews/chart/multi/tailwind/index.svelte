<script lang="ts">
	import { createChart, h_band, melt, v_linear } from '$lib/index.js';
	import { scaleFactoryAdjust, scaleFactoryBand } from '$lib/builders/chart/scale.js';

	const sentence = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. These are pangrams and so the distribution frequency of individual letters is unusual.".toLowerCase();
	const frequency = "abcdefghijklmnopqrstuvwyxz".split('').map(
		letter => ({
			letter,
			count: sentence.match(new RegExp(letter, 'g'))?.length ?? 0,
			words: sentence.split(/\w\./g).filter(word => word.includes(letter)).length
		}));

	export const chart = createChart({
		data: frequency,
		padding: 10,
		margin: { top: 0, bottom: 40, left: 40, right: 0 },
		dimensions: {
			letter: {
				get: 'letter',
				...h_band,
				scaleFactory: scaleFactoryAdjust(scaleFactoryBand, scale => scale.paddingInner(0.2))
			},
			frequency: {
				get_sub: {
					count: row => [0, row.count],
					words: 'words'
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
		area,
		elements: {
			root
		},
		dimensions: {
			letter: {
				get_scaled: l_get_scaled,
				scale: l_scale
			},
			frequency: {
				get_sub_scaled: {
					count: y_get_count_scaled,
					words: y_get_words_scaled
				},
				scale: f_scale
			}
		}
	} = chart;

</script>
<h1>Multi</h1>
<div class="w-[600px] h-[400px]">
	<div use:melt={$root} class="w-full h-full">
			{#if typeof window !== 'undefined' && $width && $height}
				<svg class="w-full h-full">
					<g transform="translate({$area.padding.inner.left}, {$area.padding.inner.top})">
						{#each $data as row, i}
							{@const x = $l_get_scaled(row)}
							{@const y = $y_get_count_scaled(row)}
							{@const w = $l_scale.bandwidth() }

							<rect x={x} y={y[1]} width={w} height={y[0] - y[1]} stroke="green" class="fill-indigo-300 stroke-indigo-700 stroke-[2px]"/>
						{/each}

						<g transform="translate({$l_scale.bandwidth() / 2}, 0)">
							<path d="M{$data.map(row => `${$l_get_scaled(row)}, ${$y_get_words_scaled(row)}`).join(' L')}" class="fill-none stroke-fuchsia-900 stroke-[4px]"/>
							<path d="M{$data.map(row => `${$l_get_scaled(row)}, ${$y_get_words_scaled(row)}`).join(' L')}" class="fill-none stroke-fuchsia-500 [stroke-dasharray:4_4] stroke-[2px]"/>
						</g>
					</g>

					<g transform="translate({$area.margin.inner.left}, {$area.padding.inner.top})">
						<line
							x1={0}
							y1={0}
							x2={0}
							y2={$area.padding.inner.height}
							class="stroke-gray-400 stroke-[3px] [stroke-linecap:round]"
						/>

						{#each $f_scale.ticks() as tick, i}
							<g transform="translate(0, {$f_scale(tick)})">
								<line
									x1={-5}
									y1={0}
									x2={0}
									y2={0}
									class="stroke-gray-400 stroke-[3px] [stroke-linecap:round]"
								/>

								<text
									x={-10}
									y={0}
									dominant-baseline="middle"
									text-anchor="end"
									class="fill-gray-400"
								>{tick}</text>
							</g>
						{/each}
					</g>

					<g transform="translate({$area.padding.inner.left}, {$area.margin.inner.bottom})">
						<line
							x1={0}
							y1={0}
							x2={$area.padding.inner.width}
							y2={0}
							class="stroke-gray-400 stroke-[3px] [stroke-linecap:round]"
							/>

						{#each $l_scale.domain() as tick, i}
							<g transform="translate({$l_scale(tick) + $l_scale.bandwidth()/2}, 0)">
								<line
									x1={0}
									y1={0}
									x2={0}
									y2={5}
									class="stroke-gray-400 stroke-[3px] [stroke-linecap:round]"
								/>

								<text
									x={0}
									y={10}
									dominant-baseline="hanging"
									text-anchor="middle"
									class="fill-gray-400"
								>{tick}</text>
							</g>

						{/each}
					</g>
				</svg>
			{/if}
		</div>
</div>