<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { createToggleGroup } from '$lib';
	import AlignCenter from '~icons/lucide/align-center';
	import AlignLeft from '~icons/lucide/align-left';
	import AlignRight from '~icons/lucide/align-right';

	const { root, item } = createToggleGroup();
</script>

<Docs.PreviewWrapper>
	<div
		{...$root}
		class="flex items-center data-[orientation='vertical']:flex-col"
		aria-label="Text alignment"
	>
		<button class="toggle-item" {...$item('left')} aria-label="Left aligned">
			<AlignLeft />
		</button>
		<button class="toggle-item" {...$item('center')} aria-label="Center aligned">
			<AlignCenter />
		</button>
		<button class="toggle-item" {...$item('right')} aria-label="Right aligned">
			<AlignRight />
		</button>
	</div>
</Docs.PreviewWrapper>

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
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			@apply rounded-r;
		}

		&:last-child {
			@apply rounded-l border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			@apply rounded-t;
		}

		&:last-child {
			@apply rounded-b border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-magnum-200 text-magnum-900;
	}
</style>
