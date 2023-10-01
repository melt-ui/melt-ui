<script lang="ts">
	import { createPinInput, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createPinInput({
		defaultValue: ['1', '2', '3', '4', '5'],
	});
</script>

<div use:melt={$root} class="inputs">
	{#each Array.from({ length: 5 }) as _}
		<input use:melt={$input()} />
	{/each}
</div>

<style>
	.inputs {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	input {
		border-radius: 6px;
		background-color: white;
		text-align: center;

		font-size: 18px;
		line-height: 28px;

		color: rgb(var(--color-magnum-900) / 1);

		width: 3rem;
		height: 3rem;

		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
</style>
