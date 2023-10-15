<script lang="ts">
	import { createCheckbox, melt } from '$lib/index.js';
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
		<button use:melt={$root} id="checkbox">
			{#if $isIndeterminate}
				<Minus class="square-4" />
			{:else if $isChecked}
				<Check class="square-4" />
			{/if}
			<input use:melt={$input} />
		</button>
		<label for="checkbox"> Accept terms and conditions. </label>
	</div>
</form>

<style>
	* {
		all: unset;
		box-sizing: border-box;
	}

	:root {
		--black-hsl: 0 0 0;
		--black: hsl(var(--black-hsl) / 1);

		--white-hsl: 0 0% 100%;
		--white: hsl(var(--white-hsl) / 1);

		--magnum-600: #e47312;
		--magnum-900: #793a15;

		--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

		--radius-lg: 0.5rem;
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button {
		display: flex;
		height: 1.75rem;
		width: 1.75rem;
		appearance: none;

		align-items: center;
		justify-content: center;

		border-radius: var(--radius-lg);

		background-color: var(--white);

		color: var(--magnum-600);

		box-shadow: var(--shadow);
	}

	button:hover {
		opacity: 0.75;
		cursor: pointer;
	}

	label {
		padding-left: 1rem;
		font-weight: 500;

		color: var(--magnum-900);
	}
</style>
