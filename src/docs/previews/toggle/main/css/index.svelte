<script lang="ts">
	import { createToggle, melt } from '$lib/index.js';
	import { Italic } from 'lucide-svelte';

	const {
		elements: { root },
	} = createToggle();
</script>

<button use:melt={$root} aria-label="Toggle italic" class="root">
	<Italic class="square-4" />
</button>

<style>
	/* Reset */
	* {
		all: unset;
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
	.root[data-state='on'] {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}
	.root[data-state='off']:hover {
		background-color: var(--magnum-100);
	}
	.root[data-disabled] {
		cursor: not-allowed;
	}

	.icon {
		width: 1rem;
		height: 1rem;
	}
</style>
