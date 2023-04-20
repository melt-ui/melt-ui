<script lang="ts">
	import { Slider } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';

	export let propsObj: ResolvedProps<typeof Slider>;

	propsObj.Root.value = [20];
</script>

<form>
	<Slider.Root
		class="relative flex h-5
		w-[200px] touch-none select-none items-center 
		data-[orientation=vertical]:h-[200px] 
		data-[orientation=vertical]:w-5 
		data-[orientation=vertical]:flex-col
		"
		bind:value={propsObj.Root.value}
		min={propsObj.Root.min}
		max={propsObj.Root.max}
		step={propsObj.Root.step}
		orientation={propsObj.Root.orientation}
		name={propsObj.Root.name}
		minStepsBetweenThumbs={propsObj.Root.minStepsBetweenThumbs}
		inverted={propsObj.Root.inverted}
		dir={propsObj.Root.dir}
		disabled={propsObj.Root.disabled}
		aria-label="Volume"
	>
		<Slider.Track
			class="relative grow rounded-full bg-black/50 
					data-[orientation=horizontal]:h-[3px] 
					data-[orientation=vertical]:w-[3px]"
		>
			<Slider.Range
				class="absolute rounded-full bg-white 
				data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
			/>
		</Slider.Track>
		<Slider.Thumb
			class="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-black/10 
					hover:bg-vermilion-100 focus:shadow-[0_0_0_5px] focus:shadow-black/30 focus:outline-none"
		/>
	</Slider.Root>
</form>
