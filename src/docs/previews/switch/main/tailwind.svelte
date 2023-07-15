<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';

	const { root, input, isChecked } = createSwitch();
</script>

<form>
	<div class="flex items-center">
		<label class="pr-4 leading-none text-white" for="airplane-mode">
			Airplane mode
		</label>
		<button
			melt={$root}
			class="relative h-6 w-11 cursor-default rounded-full bg-magnum-800 transition-colors data-[state=checked]:bg-magnum-950"
			id="airplane-mode"
		>
			<span
				class="block h-5 w-5 translate-x-0.5 rounded-full bg-white
                transition-transform will-change-transform
                {$isChecked && 'translate-x-[22px]'}"
			/>
			<input melt={$input} />
		</button>
	</div>
</form>
