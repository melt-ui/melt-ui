<script lang="ts">
	import { createCheckbox, melt } from '@melt-ui/svelte';
	import Check from '~icons/lucide/check';
	import Minus from '~icons/lucide/minus';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
</script>

<form>
	<div class="checkbox-wrapper">
		<button use:melt={$root} class="root" id="checkbox">
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input use:melt={$input} />
		</button>
		<label for="checkbox" class="label"> Accept terms and conditions. </label>
	</div>
</form>

<style lang="postcss">
	.checkbox-wrapper {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

		&:hover {
			opacity: 0.75;
		}
	}

	.root {
		display: flex;
		background-color: #ffffff;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 0.125rem;
		appearance: none;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		color: rgb(228 115 18);

		:hover {
			opacity: 0.75;
		}
	}

	.label {
		color: #ffffff;
		line-height: 1;
		padding-left: 15px;
		color: 15px;
	}
</style>
