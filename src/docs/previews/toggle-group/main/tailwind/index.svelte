<script lang="ts">
	import { createToggleGroup, melt } from '$lib/index.js';
	import { AlignCenter, AlignLeft, AlignRight } from '$icons/index.js';

	const {
		elements: { root, item },
	} = createToggleGroup({
		type: 'multiple',
	});
</script>

<div
	use:melt={$root}
	class="flex items-center data-[orientation='vertical']:flex-col"
	aria-label="Text alignment"
>
	<button
		class="toggle-item"
		use:melt={$item('left')}
		aria-label="Left aligned"
	>
		<AlignLeft class="size-4" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('center')}
		aria-label="Center aligned"
	>
		<AlignCenter class="size-4" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('right')}
		aria-label="Right aligned"
	>
		<AlignRight class="size-4" />
	</button>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.white');
		color: theme('colors.magnum.800');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		width: theme('width.9');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		@apply border-x border-l-transparent border-r-magnum-200;

		&:first-child {
			@apply rounded-l-md;
		}

		&:last-child {
			@apply rounded-r-md border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			@apply rounded-r-md;
		}

		&:last-child {
			@apply rounded-l-md border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			@apply rounded-t-md;
		}

		&:last-child {
			@apply rounded-b-md border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-magnum-200 text-magnum-900;
	}
</style>
