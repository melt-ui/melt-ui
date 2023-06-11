<script lang="ts">
	import { createCheckbox } from '@melt-ui/svelte';
	import { Check, Minus } from 'icons';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
</script>

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			class="flex h-6 w-6 appearance-none items-center
				justify-center rounded-sm bg-white text-magnum-600 shadow-lg outline-none
				hover:opacity-75 focus:ring focus:ring-magnum-400"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox">
			Accept terms and conditions.
		</label>
	</div>
</form>
