<script lang="ts">
	import { createToolbar, melt } from '$lib/index.js';

	// Icons
	import {
		Bold,
		Italic,
		Strikethrough,
		AlignLeft,
		AlignCenter,
		AlignRight,
	} from 'lucide-svelte';

	const {
		elements: { root, button, link, separator },
		builders: { createToolbarGroup },
	} = createToolbar();
	const {
		elements: { group: fontGroup, item: fontItem },
	} = createToolbarGroup({
		type: 'multiple',
	});
	const {
		elements: { group: alignGroup, item: alignItem },
	} = createToolbarGroup();
</script>

<div
	use:melt={$root}
	class="flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm lg:w-[35rem]"
>
	<div class="flex items-center gap-1" use:melt={$fontGroup}>
		<button class="item" aria-label="bold" use:melt={$fontItem('bold')}>
			<Bold class="square-5" />
		</button>
		<button class="item" aria-label="italic" use:melt={$fontItem('italic')}>
			<Italic class="square-5" />
		</button>
		<button
			class="item"
			aria-label="strikethrough"
			use:melt={$fontItem('strikethrough')}
		>
			<Strikethrough class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<div class="flex items-center gap-1" use:melt={$alignGroup}>
		<button class="item" aria-label="align left" use:melt={$alignItem('left')}>
			<AlignLeft class="square-5" />
		</button>
		<button
			class="item"
			aria-label="align center"
			use:melt={$alignItem('center')}
		>
			<AlignCenter class="square-5" />
		</button>
		<button
			class="item"
			aria-label="align-right"
			use:melt={$alignItem('right')}
		>
			<AlignRight class="square-5" />
		</button>
	</div>
	<div class="separator" use:melt={$separator} />
	<a href="/" class="link nowrap flex-shrink-0" use:melt={$link}>
		Edited 2 hours ago
	</a>
	<button
		class="ml-auto rounded-md bg-magnum-600 px-3 py-1 font-medium text-magnum-100 hover:opacity-75 active:opacity-50"
		use:melt={$button}>Save</button
	>
</div>

<style lang="scss">
	.item {
		/*		padding: _Theme('spacing.1');*/
		/*		border-radius: _Theme('borderRadius.md');*/

		&:hover {
			/*			background-color: _Theme('colors.magnum.100');*/
		}

		&[data-state='on'] {
			/*			background-color: _Theme('colors.magnum.200');*/
			/*			color: _Theme('colors.magnum.900');*/
		}

		&:focus {
			@apply ring-2 ring-magnum-400;
		}
	}

	.separator {
		width: 1px;
		/*		background-color: _Theme('colors.neutral.300');*/
		align-self: stretch;
	}
</style>
