<script lang="ts">
	import { createToggleGroup, melt } from '$lib/index.js';
	import { AlignCenter, AlignLeft, AlignRight } from 'lucide-svelte';

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
		<AlignLeft class="square-4" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('center')}
		aria-label="Center aligned"
	>
		<AlignCenter class="square-4" />
	</button>
	<button
		class="toggle-item"
		use:melt={$item('right')}
		aria-label="Right aligned"
	>
		<AlignRight class="square-4" />
	</button>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		/*		background-color: _Theme('colors.white');*/
		/*		color: _Theme('colors.magnum.800');*/
		/*		font-size: _Theme('fontSize.base');*/
		/*		line-height: _Theme('lineHeight.4');*/
		outline: none;

		/*		height: _Theme('height.9');*/
		/*		width: _Theme('width.9');*/

		&:hover {
			/*			background-color: _Theme('colors.magnum.100');*/
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		--_apply: cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		--_apply: border-x border-l-transparent border-r-magnum-200;

		&:first-child {
			--_apply: rounded-l-md;
		}

		&:last-child {
			--_apply: rounded-r-md border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		--_apply: border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			--_apply: rounded-r-md;
		}

		&:last-child {
			--_apply: rounded-l-md border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		--_apply: border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			--_apply: rounded-t-md;
		}

		&:last-child {
			--_apply: rounded-b-md border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		--_apply: bg-magnum-200 text-magnum-900;
	}
</style>
