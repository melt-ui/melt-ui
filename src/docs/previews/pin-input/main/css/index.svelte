<script lang="ts">
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput({
		defaultValue: ['1', '2', '3', '4', '5'],
	});
</script>

<div use:melt={$root}>
	{#each Array.from({ length: 5 }) as _}
		<input use:melt={$input()} />
	{/each}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	input {
		border-radius: 0.375rem;
		background-color: var(--color-white);
		text-align: center;
		font-size: 1.125rem;
		color: var(--color-magnum-900);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		width: 3rem;
		height: 3rem;
	}
</style>
