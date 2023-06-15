<script lang="ts">
	import { createSlider } from '$lib';
	import { Docs } from '$routes/(components)';

	const { slider, range, thumb, value, disabled } = createSlider({
		// disabled: true,
		orientation: 'vertical',
		value: [30, 70],
		max: 100,
	});
</script>

<Docs.PreviewWrapper>
	<span
		{...$slider}
		class:opacity-60={$disabled}
		class="relative flex h-[200px] w-[20px] justify-center"
	>
		<span class="block h-[200px] w-[3px] bg-black/40">
			<span {...$range} class="w-[3px] bg-white" />
		</span>

		<span
			{...$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:outline-none focus:ring-4 focus:ring-black/40"
		/>

		<span
			{...$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:outline-none focus:ring-4 focus:ring-black/40"
		/>
	</span>
</Docs.PreviewWrapper>
