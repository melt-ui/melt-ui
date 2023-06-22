<script lang="ts">
	import { createCheckbox } from '$lib';
	import Check from '~icons/lucide/check';
	import Minus from '~icons/lucide/minus';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
</script>

<form class="form">
	<button {...$root} class="checkbox" id="checkbox">
		{#if $isIndeterminate}
			<Minus />
		{:else if $isChecked}
			<Check />
		{/if}
		<input {...$input} />
	</button>
	<label class="label" for="checkbox"> Accept terms and conditions. </label>
</form>

<style lang="postcss">
	.form {
		@apply flex items-center justify-center;
	}

	.checkbox {
		@apply flex h-6 w-6 appearance-none items-center justify-center;
		@apply rounded-sm bg-white text-magnum-600 shadow-lg hover:opacity-75;
	}

	.label {
		@apply pl-[15px] text-[15px] leading-none text-white;
	}
</style>
