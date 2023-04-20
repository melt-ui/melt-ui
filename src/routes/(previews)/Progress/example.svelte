<script lang="ts">
	import { Progress } from '$lib';
	import type { ResolvedProps } from '$lib';

	export let propsObj: ResolvedProps<typeof Progress>;
</script>

<form class="grid h-full place-items-center">
	<div class="flex items-center justify-center">
		<Progress.Root
			class="relative h-6 w-[300px] overflow-hidden rounded-[99999px] bg-black/40"
			value={propsObj.Root.value}
			max={propsObj.Root.max}
			id="c1"
		>
			<Progress.Indicator
				class="h-full w-full bg-[white] transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
				style={`transform: translateX(-${
					100 - (100 * (propsObj.Root.value ?? 0)) / (propsObj.Root.max ?? 1)
				}%)`}
			/>
		</Progress.Root>
	</div>
</form>
