<script lang="ts">
	import { createTooltip, melt } from '$lib/index.js';
	import { fade } from 'svelte/transition';
	import { Plus } from 'lucide-svelte';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true,
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
	<Plus class="square-4" aria-label="plus" />
</button>

{#if $open}
	<div use:melt={$content} transition:fade={{ duration: 100 }} class="wrapper">
		<div use:melt={$arrow} />
		<p class="tooltip-text">Add item to library</p>
	</div>
{/if}

<style lang="postcss">
	:root {
		--color-white: 255 255 255;
		--color-magnum-900: 121 58 21;
		--color-magnum-700: 189 87 17;
	}

	* {
		all: unset;
	}

	.wrapper {
		z-index: 10;
		border-radius: 0.5rem;
		background-color: rgb(var(--color-white) / 1);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.tooltip-text {
		display: block;
		padding: 0.25rem 1rem;
		color: rgb(var(--color-magnum-700) / 1);
	}

	.trigger {
		cursor: pointer;
		width: 2.25rem;
		height: 2.25rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border-radius: 9999px;
		background-color: rgb(var(--color-white) / 1);
		color: rgb(var(--color-magnum-900) / 1);
		transition-property: color, background-color, border-color,
			text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;

		&:hover {
			background-color: rgb(var(--color-white) / 0.9);
		}

		&:focus-visible {
			box-shadow: 0 0 0 2px rgb(var(--color-white) / 1);
		}
	}
</style>
