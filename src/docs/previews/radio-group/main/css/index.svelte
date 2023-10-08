<script lang="ts">
	import { createRadioGroup, melt } from '$lib/index.js';

	const {
		elements: { root, item, hiddenInput },
		helpers: { isChecked },
	} = createRadioGroup({
		defaultValue: 'default',
	});

	const optionsArr = ['default', 'comfortable', 'compact'];
</script>

<div use:melt={$root} class="root" aria-label="View density">
	{#each optionsArr as option}
		<div class="option">
			<button
				use:melt={$item(option)}
				class="radio-button"
				id={option}
				aria-labelledby="{option}-label"
			>
				{#if $isChecked(option)}
					<div class="bullet" />
				{/if}
			</button>
			<label class="label" for={option} id="{option}-label">
				{option}
			</label>
		</div>
	{/each}
	<input name="line-height" use:melt={$hiddenInput} />
</div>

<style>
	/* Reset */
	* {
		all: unset;
	}

	/* CSS Variables */
	:root {
		--magnum-100: #fef2d6;
		--magnum-500: #f38d1c;
		--magnum-900: #793a15;

		--shadow-sm: rgb(0 0 0 / 0.05);

		--radius-full: 9999px;
	}

	/* Elements */
	.root {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.root[data-orientation='horizontal'] {
		flex-direction: row;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.radio-button {
		display: grid;
		height: 1.5rem;
		width: 1.5rem;
		cursor: default;
		place-items: center;
		border-radius: var(--radius-full);
		background-color: white;
		box-shadow: 0 1px 2px 0 var(--shadow-sm);
	}
	.radio-button:hover {
		background-color: var(--magnum-100);
	}
	.radio-button .bullet {
		height: 0.75rem;
		width: 0.75rem;
		border-radius: var(--radius-full);
		background-color: var(--magnum-500);
	}

	.label {
		font-weight: 500;
		text-transform: capitalize;
		line-height: 1;
		color: var(--magnum-900);
	}
</style>
