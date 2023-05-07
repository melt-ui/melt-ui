<script lang="ts">
	import { Slider } from '$lib';

	let useRadix = true;
</script>

<form>
	{#if useRadix}
		{#each Array(100) as _, i}
			<Slider.Root
				class="relative flex h-5
                        w-full touch-none select-none items-center
                        data-[orientation=vertical]:h-[200px]
                        data-[orientation=vertical]:w-5
                        data-[orientation=vertical]:flex-col
                        "
				value={[50]}
				min={0}
				max={100}
				step={1}
				name={'asd!'}
				disabled={false}
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
		{/each}
	{:else}
		{#each Array(100) as _, i}
			<input min={0} max={100} step={1} value={70} type="range" style="width: 100%;" />
		{/each}
	{/if}
</form>
