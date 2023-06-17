<script lang="ts">
	import { createDropdownMenu } from '$lib';
	import { Docs } from '$routes/(components)';
	import AlignJustify from '~icons/lucide/align-justify';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { trigger, menu, item, arrow, open, createSubMenu } = createDropdownMenu();

	const { subMenu: subMenu1, subTrigger: subTrigger1 } = createSubMenu();
	const { subMenu: subMenu2, subTrigger: subTrigger2 } = createSubMenu();
</script>

<Docs.PreviewWrapper>
	<button type="button" class="trigger" {...$trigger} aria-label="Update dimensions">
		<AlignJustify class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	<div class="menu" {...$menu}>
		<div class="item" {...$item()}>New Tab</div>
		<div class="item" {...$item()}>New Window</div>
		<div class="item" {...$subTrigger1}>
			More Tools
			<ChevronRight class="h-4 w-4" />
		</div>
		<div class="menu subMenu" {...$subMenu1}>
			<div class="item" {...$item()}>New Tab</div>
			<div class="item" {...$item()}>New Window</div>
			<div class="item" {...$subTrigger2}>
				Even More
				<ChevronRight class="h-4 w-4" />
			</div>
			<div class="menu subMenu" {...$subMenu2}>
				<div class="item" {...$item()}>New Tool</div>
				<div class="item" {...$item()}>New Shiny Thing</div>
			</div>
		</div>
		<div class="item" {...$item()}>Show Bookmarks</div>
		<div {...$arrow} />
	</div>
</Docs.PreviewWrapper>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[300px] w-52 flex-col shadow-lg;
		@apply rounded-md bg-white p-1 lg:max-h-none;
	}
	.subMenu {
		@apply shadow-md shadow-neutral-900/50;
	}
	.item {
		@apply relative h-[25px] min-h-[25px] cursor-pointer rounded-md pl-4 pr-1 text-neutral-800;
		@apply z-20 outline-none hocus:bg-magnum-100 hocus:text-magnum-700;
		@apply flex items-center justify-between text-sm leading-none;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90 focus-visible:outline-none;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
