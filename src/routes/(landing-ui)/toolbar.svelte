<script lang="ts">
	import { cn } from '$docs/utils';
	import { createToolbar, melt } from '$lib';

	// Icons
	import { Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight } from 'lucide-svelte';

	const {
		elements: { root, button, link, separator },
		builders: { createToolbarGroup },
	} = createToolbar();
	const {
		elements: { group: fontGroup, item: fontItem },
	} = createToolbarGroup({
		type: 'multiple',
		defaultValue: ['bold', 'italic'],
	});
	const {
		elements: { group: alignGroup, item: alignItem },
	} = createToolbarGroup({
		defaultValue: 'left',
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
		'flex min-w-max items-center gap-4 rounded-xl bg-white px-3 py-3 text-neutral-700 shadow-sm lg:w-[35rem]',
		className
	)}
>
	<div class="flex items-center gap-1" use:melt={$fontGroup}>
		<button class="item" use:melt={$fontItem('bold')}>
			<Bold class="square-5" />
		</button>
		<button class="item" use:melt={$fontItem('italic')}>
			<Italic class="square-5" />
		</button>
		<button class="item" use:melt={$fontItem('strikethrough')}>
			<Strikethrough class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<div class="flex items-center gap-1" use:melt={$alignGroup}>
		<button class="item" use:melt={$alignItem('left')}>
			<AlignLeft class="square-5" />
		</button>
		<button class="item" use:melt={$alignItem('center')}>
			<AlignCenter class="square-5" />
		</button>
		<button class="item" use:melt={$alignItem('right')}>
			<AlignRight class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<a href="/" class="link nowrap flex-shrink-0 transition" use:melt={$link}> Edited 2 hours ago </a>
	<button
		class="ml-auto rounded-lg bg-magnum-300 px-3 py-1 font-medium text-magnum-900
    transition hover:opacity-75 active:opacity-50"
		use:melt={$button}>Save</button
	>
</div>

<style lang="postcss">
	.item {
		/*		padding: _Theme('spacing.1');*/
		/*		border-radius: _Theme('borderRadius.md');*/
		/*		color: _Theme('colors.neutral.400');*/
		position: relative;

		@apply transition;

		&:hover {
			opacity: 0.75;
		}

		&[data-state='on'] {
			/*			color: _Theme('colors.magnum.800');*/
		}

		&::after {
			position: absolute;
			left: 50%;
			bottom: -0.25rem;
			transform: translateX(-50%);
			content: '';
			width: 0.25rem;
			height: 0.25rem;
			/*			border-radius: _Theme('borderRadius.full');*/
			/*			background-color: _Theme('colors.magnum.400');*/
			opacity: 0;
			@apply transition;
		}

		&:focus::after {
			opacity: 1;
		}
	}

	.separator {
		width: 1px;
		/*		background-color: _Theme('colors.neutral.300');*/
		align-self: stretch;
	}
</style>
