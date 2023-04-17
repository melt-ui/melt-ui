<script lang="ts">
	import { ToggleGroup } from '$lib';
	import type { ResolvedProps } from '../helpers';
	import TextAlignLeftIcon from '~icons/radix-icons/text-align-left';
	import TextAlignCenterIcon from '~icons/radix-icons/text-align-center';
	import TextAlignRightIcon from '~icons/radix-icons/text-align-right';

	export let propsObj: ResolvedProps<typeof ToggleGroup>;
</script>

<div class="contents">
	<ToggleGroup.Root class="flex items-center" type="single" aria-label="Text alignment">
		<ToggleGroup.Item class="toggle-item" value="left" aria-label="Left aligned">
			<TextAlignLeftIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class="toggle-item" value="center" aria-label="Center aligned">
			<TextAlignCenterIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class="toggle-item" value="right" aria-label="Right aligned">
			<TextAlignRightIcon />
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>

<style lang="postcss">
	.contents :global(.toggle-item) {
		@apply grid h-9 w-9 place-items-center items-center
	justify-center bg-white text-base leading-4 text-vermilion-800 shadow-lg
	hover:bg-vermilion-100 focus:ring-2 focus:ring-black;

		&:first-child {
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r;
		}
	}

	.contents :global(.toggle-item[data-state='on']) {
		@apply bg-vermilion-200 text-vermilion-900;
	}
</style>
