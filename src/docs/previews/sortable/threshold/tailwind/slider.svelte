<script lang="ts">
	import {
		createSlider,
		melt,
		type SelectOption,
		type SortableOrientation,
	} from '$lib';
	import { writable, type Writable } from 'svelte/store';

	export let threshold = writable([0.5]);
	export let currentOrientation: Writable<SelectOption<SortableOrientation>>;

	const {
		elements: { root, range, thumb },
		options,
	} = createSlider({
		min: 0,
		max: 1,
		defaultValue: $threshold,
		value: threshold,
		step: 0.01,
		orientation:
			$currentOrientation.value === 'horizontal' ? 'horizontal' : 'vertical',
	});

	$: options.orientation.set(
		$currentOrientation.value === 'horizontal' ? 'horizontal' : 'vertical',
	);
</script>

<span
	use:melt={$root}
	class="group relative flex place-content-center items-center justify-center data-[orientation='horizontal']:h-[20px] data-[orientation='vertical']:h-44 data-[orientation='horizontal']:w-48 data-[orientation='vertical']:w-[3px] data-[orientation='horizontal']:flex-row data-[orientation='vertical']:flex-col"
>
	<span
		class="block w-full bg-black/40 group-data-[orientation='horizontal']:h-[3px] group-data-[orientation='vertical']:h-full"
	>
		<span
			use:melt={$range}
			class="bg-white group-data-[orientation='horizontal']:h-[3px] group-data-[orientation='vertical']:w-full"
		/>
	</span>
	<span
		use:melt={$thumb()}
		class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
	/>
</span>
