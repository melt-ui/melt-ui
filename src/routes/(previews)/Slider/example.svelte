<script lang="ts">
	import { Slider } from '$lib';
	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof Slider>;

	propsObj.Root.value = [20, 40];
</script>

<form>
	<Slider.Root
		class="relative flex h-5 w-[200px] touch-none select-none
		items-center
		"
		bind:value={propsObj.Root.value}
		max={100}
		step={1}
		orientation="horizontal"
		aria-label="Volume"
	>
		<Slider.Track class="relative h-[3px] grow rounded-full bg-black/50">
			<Slider.Range class="absolute h-full rounded-full bg-white" />
		</Slider.Track>
		<Slider.Thumb
			class="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-black/10 hover:bg-violet-100 focus:shadow-[0_0_0_5px] focus:shadow-black/30 focus:outline-none"
		/>
		<Slider.Thumb
			class="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-black/10 hover:bg-violet-100 focus:shadow-[0_0_0_5px] focus:shadow-black/30 focus:outline-none"
		/>
	</Slider.Root>
</form>
