<script lang="ts">
	import { cn } from '$docs/utils';
	import { createToggleGroup, melt } from '$lib';
	import { AlignCenter, AlignLeft, AlignRight } from 'lucide-svelte';

	const {
		elements: { root, item },
	} = createToggleGroup({
		type: 'single',
		defaultValue: 'right',
		onValueChange: ({ curr, next }) => {
			if (next === undefined) {
				return curr;
			}
			return next;
		},
	});

	let className = '';
	export { className as class };
</script>

<div
	use:melt={$root}
	class={cn(
		"flex items-center overflow-hidden rounded-xl shadow-sm data-[orientation='vertical']:flex-col",
		className
	)}
	aria-label="Text alignment"
>
	<button class="toggle-item" use:melt={$item('left')} aria-label="Left aligned">
		<AlignLeft class="square-5" />
	</button>
	<button class="toggle-item" use:melt={$item('center')} aria-label="Center aligned">
		<AlignCenter class="square-5" />
	</button>
	<button class="toggle-item" use:melt={$item('right')} aria-label="Right aligned">
		<AlignRight class="square-5" />
	</button>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.neutral.100');
		color: theme('colors.neutral.400');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.12');
		width: theme('width.12');

		position: relative;

		@apply transition;

		&::after {
			position: absolute;
			left: 50%;
			bottom: 0.25rem;
			transform: translateX(-50%);
			content: '';
			width: 0.25rem;
			height: 0.25rem;
			border-radius: theme('borderRadius.full');
			background-color: theme('colors.magnum.400');
			opacity: 0;
			@apply transition;
		}

		&:focus::after {
			opacity: 1;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		&:first-child {
			@apply rounded-l-xl;
		}

		&:last-child {
			@apply rounded-r-xl;
		}
	}

	.toggle-item[data-state='on'] {
		background-color: theme('colors.white');
		color: theme('colors.magnum.800');
	}
</style>
