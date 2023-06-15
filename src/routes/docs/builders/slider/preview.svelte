<script lang="ts">
	import { createSlider } from '$lib';
	import { Docs } from '$routes/(components)';

	const { slider, range, thumb, value } = createSlider({
		value: [30, 70, 10],
		max: 100,
	});
</script>

<Docs.PreviewWrapper>
	<span {...slider} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span {...$range} class="h-[3px] bg-white" />
		</span>

		<span
			{...$thumb()}
			class="block h-5 w-5 rounded-full bg-white focus:outline-none focus:ring-4 focus:ring-black/40"
		/>

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
