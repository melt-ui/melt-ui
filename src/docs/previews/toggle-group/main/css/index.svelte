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
	<button class="toggle-item" use:melt={$item('left')} aria-label="Left aligned">
		<AlignLeft class="square-4" />
	</button>
	<button class="toggle-item" use:melt={$item('center')} aria-label="Center aligned">
		<AlignCenter class="icon" />
	</button>
	<button class="toggle-item" use:melt={$item('right')} aria-label="Right aligned">
		<AlignRight class="icon" />
	</button>
</div>

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

		--fs-base: 1rem;

		--radius-md: 0.375rem;

		--lh-4: 1rem;
	}

	/* Elements */
	.root {
		display: flex;
		align-items: center;
	}

	.root[data-orientation='vertical'] {
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
		outline: none;
		cursor: pointer;
	}

	.toggle-item:hover {
		background-color: var(--magnum-100);
	}

	.toggle-item:focus {
		z-index: 10;
	}

	.toggle-item[data-disabled] {
		cursor: not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		border-left-width: 1px;
		border-right-width: 1px;
		border-left-color: transparent;
		border-right-color: var(--magnum-200);
	}

	.toggle-item[data-orientation='horizontal']:first-child {
		border-top-left-radius: var(--radius-md);
		border-bottom-left-radius: var(--radius-md);
	}

	.toggle-item[data-orientation='horizontal']:last-child {
		/* CSS */
		border-top-right-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
		border-right-color: transparent;
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		border-left-width: 1px;
		border-right-width: 1px;
		border-left-color: var(--magnum-200);
		border-right-color: transparent;
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl):first-child {
		border-top-right-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl):last-child {
		border-top-left-radius: var(--radius-md);
		border-bottom-left-radius: var(--radius-md);
		border-left-color: transparent;
	}

	.toggle-item[data-orientation='vertical'] {
		border-top-width: 1px;
		border-bottom-width: 1px;
		border-top-color: transparent;
		border-bottom-color: var(--magnum-200);
	}

	.toggle-item[data-orientation='vertical']:first-child {
		border-top-left-radius: var(--radius-md);
		border-top-right-radius: var(--radius-md);
	}

	.toggle-item[data-orientation='vertical']:last-child {
		border-bottom-left-radius: var(--radius-md);
		border-bottom-right-radius: var(--radius-md);
		border-bottom-color: transparent;
	}

	.toggle-item[data-state='on'] {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.toggle-item > .icon {
		width: 1rem;
		height: 1rem;
	}
</style>
