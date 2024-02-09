<script lang="ts">
	import { createCheckbox, melt } from '$lib/index.js';
	import { Check, Minus } from '$icons/index.js';

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
				<Minus class="size-4" />
			{:else if $isChecked}
				<Check class="size-4" />
			{/if}
			<input use:melt={$input} />
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

		background-color: rgb(var(--color-white) / 1);

		color: rgb(var(--color-magnum-600) / 1);

		box-shadow: 0 10px 15px -3px rgb(var(--color-black) / 0.1),
			0 4px 6px -4px rgb(var(--color-black) / 0.1);
	}

	button:hover {
		opacity: 0.75;
	}

	label {
		padding-left: 15px;
		font-size: 15px;
		line-height: 1;

		color: rgb(var(--color-white) / 1);
	}
</style>
