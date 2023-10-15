<script lang="ts">
	import { createToggleGroup, melt } from '$lib/index.js';
	import { AlignCenter, AlignLeft, AlignRight } from 'lucide-svelte';

	const {
		elements: { root, item },
	} = createToggleGroup({
		type: 'multiple',
	});
</script>

<div use:melt={$root} class="root" aria-label="Text alignment">
	<button
		class="toggle-item"
		use:melt={$item('left')}
		aria-label="Left aligned"
	>
		<AlignLeft class="square-4" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('center')}
		aria-label="Center aligned"
	>
		<AlignCenter class="icon" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('right')}
		aria-label="Right aligned"
	>
		<AlignRight class="icon" />
	</button>
</div>

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

		--fs-base: 1rem;

		--radius-md: 0.375rem;

		--lh-4: 1rem;
	}

	/* Elements */
	.root {
		display: flex;
		align-items: center;
	}

	:global([data-orientation='vertical']).root {
		flex-direction: column;
	}

	.toggle-item {
		height: 2.25rem;
		width: 2.25rem;

		display: grid;
		place-items: center;
		align-items: center;

		background-color: white;
		color: var(--magnum-800);
		font-size: var(--fs-base);
		line-height: var(--lh-4);
		border-left-style: solid;
		border-right-style: solid;
		outline: none;
		cursor: pointer;
	}

	.toggle-item:hover {
		background-color: var(--magnum-100);
	}

	.toggle-item:focus {
		z-index: 10;
	}

	:global([data-disabled]).toggle-item {
		cursor: not-allowed;
	}

	:global([data-orientation='horizontal']).toggle-item {
		border-left-width: 1px;
		border-right-width: 1px;
		border-left-color: transparent;
		border-right-color: var(--magnum-200);
	}

	:global([data-orientation='horizontal']).toggle-item:first-child {
		border-top-left-radius: var(--radius-md);
		border-bottom-left-radius: var(--radius-md);
	}

	:global([data-orientation='horizontal']).toggle-item:last-child {
		border-top-right-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
		border-right-color: transparent;
	}

	:global([data-orientation='horizontal']).toggle-item:dir(rtl) {
		border-left-width: 1px;
		border-right-width: 1px;
		border-left-color: var(--magnum-200);
		border-right-color: transparent;
	}

	:global([data-orientation='horizontal']).toggle-item:dir(rtl):first-child {
		border-top-right-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
	}

	:global([data-orientation='horizontal']).toggle-item:dir(rtl):last-child {
		border-top-left-radius: var(--radius-md);
		border-bottom-left-radius: var(--radius-md);
		border-left-color: transparent;
	}

	:global([data-orientation='vertical']).toggle-item {
		border-top-width: 1px;
		border-bottom-width: 1px;
		border-top-color: transparent;
		border-bottom-color: var(--magnum-200);
	}

	:global([data-orientation='vertical']).toggle-item:first-child {
		border-top-left-radius: var(--radius-md);
		border-top-right-radius: var(--radius-md);
	}

	:global([data-orientation='vertical']).toggle-item:last-child {
		border-bottom-left-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
		border-bottom-color: transparent;
	}

	:global([data-state='on']).toggle-item {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.toggle-item :global(.icon) {
		width: 1rem;
		height: 1rem;
	}
</style>
