<script lang="ts">
	import { createToggle, melt } from '$lib/index.js';
	import { Italic } from 'lucide-svelte';

	const {
		elements: { root },
	} = createToggle();
</script>

<button use:melt={$root} aria-label="Toggle italic" class="root">
	<Italic class="icon" />
</button>

<style>
	/* Reset */
	* {
		all: unset;
		box-sizing: border-box;
	}

	/* CSS Variables */
	:root {
		--magnum-100: #fef2d6;
		--magnum-200: #fce0ac;
		--magnum-800: #964516;
		--magnum-900: #793a15;

		--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);

		--radius-md: 0.375rem;

		--fs-base: 1rem;

		--lh-4: 1rem;
	}

	/* Elemeents */
	.root {
		height: 2.25rem;
		width: 2.25rem;

		display: grid;
		align-items: center;
		justify-items: center;
		justify-content: center;

		background-color: white;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		color: var(--magnum-800);
		cursor: pointer;

		font-size: var(--fs-base);
		line-height: var(--lh-4);
	}
	:global([data-state='on']).root {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}
	:global([data-state='off']).root:hover {
		background-color: var(--magnum-100);
	}
	:global([data-disabled]).root {
		cursor: not-allowed;
	}

	.root :global(.icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
