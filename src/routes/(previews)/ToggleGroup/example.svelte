<script lang="ts">
	import { ToggleGroup } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import TextAlignLeftIcon from '~icons/radix-icons/text-align-left';
	import TextAlignCenterIcon from '~icons/radix-icons/text-align-center';
	import TextAlignRightIcon from '~icons/radix-icons/text-align-right';

	export let propsObj: ResolvedProps<typeof ToggleGroup>;
	// Since we use a discriminated union in ToggleGroup.Root, we need to cast
	// some props to any to satisfy the type checker. TODO: Find a better way to do this.
	$: castPropsObj = propsObj as ResolvedProps<typeof ToggleGroup> & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Root: { type: any; value: any };
	};
</script>

<div class="contents">
	<ToggleGroup.Root
		class=""
		type={castPropsObj.Root.type}
		bind:value={castPropsObj.Root.value}
		dir={propsObj.Root.dir}
		orientation={propsObj.Root.orientation}
		rovingFocus={propsObj.Root.rovingFocus}
		aria-label="Text alignment"
	>
		<ToggleGroup.Item class="" value="left" aria-label="Left aligned">
			<TextAlignLeftIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class="" value="center" aria-label="Center aligned">
			<TextAlignCenterIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class="" value="right" aria-label="Right aligned">
			<TextAlignRightIcon />
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>

<style lang="postcss">
	.contents :global(.toggle-item) {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.white');
		color: theme('colors.vermilion.800');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		width: theme('width.9');

		&:hover {
			background-color: theme('colors.vermilion.100');
		}

		&:focus {
			z-index: 10;
			@apply ring-2 ring-black;
		}
	}

	.contents :global(.toggle-item[data-orientation='horizontal']:dir(ltr)) {
		@apply border-x border-l-transparent  border-r-vermilion-200;

		&:first-child {
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r border-r-transparent;
		}
	}

	.contents :global(.toggle-item[data-orientation='horizontal']:dir(rtl)) {
		@apply border-x border-l-vermilion-200 border-r-transparent;

		&:first-child {
			@apply rounded-r;
		}

		&:last-child {
			@apply rounded-l border-l-transparent;
		}
	}

	.contents :global(.toggle-item[data-orientation='vertical']) {
		@apply border-y border-b-vermilion-200 border-t-transparent;

		&:first-child {
			@apply rounded-t;
		}

		&:last-child {
			@apply rounded-b border-b-transparent;
		}
	}

	.contents :global(.toggle-item[data-state='on']) {
		@apply bg-vermilion-200 text-vermilion-900;
	}
</style>
