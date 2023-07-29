<script lang="ts">
	import { createCheckbox } from '$lib';
	import { Check, Minus } from 'lucide-svelte';

	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate },
	} = createCheckbox({
		defaultChecked: 'indeterminate',
	});
</script>

<form>
	<div>
		<button melt={$root} id="checkbox">
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input melt={$input} />
		</button>
		<label for="checkbox"> Accept terms and conditions. </label>
	</div>
</form>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button {
		display: flex;
		height: 1.5rem;
		width: 1.5rem;
		appearance: none;

		align-items: center;
		justify-content: center;

		border-radius: 0.125rem;

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(228 115 18 / var(--tw-text-opacity));

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	button:hover {
		opacity: 0.75;
	}

	label {
		padding-left: 15px;
		font-size: 15px;
		line-height: 1;

		--tw-text-opacity: 1;
		color: rgb(255 255 255 / var(--tw-text-opacity));
	}
</style>
