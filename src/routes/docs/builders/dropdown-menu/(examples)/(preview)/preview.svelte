<script lang="ts">
	import { createDropdownMenu } from '$lib';
	import AlignJustify from '~icons/lucide/align-justify';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { trigger, menu, item, arrow, createSubMenu } = createDropdownMenu();

	const { subMenu: subMenuA, subTrigger: subTriggerA } = createSubMenu();
	const { subMenu: subMenuB, subTrigger: subTriggerB } = createSubMenu();

	function onSelect() {
		alert('You selected an item!');
	}

	function onOpen() {
		// do something
	}

	function onClose() {
		// do something
	}
</script>

<button
	type="button"
	class="trigger"
	{...$trigger}
	use:trigger.action
	aria-label="Update dimensions"
>
	<AlignJustify class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

<div class="menu" {...$menu} use:menu.action on:m-open={onOpen} on:m-close={onClose}>
	<div class="item" {...item} use:item.action on:m-select={onSelect}>New Tab</div>
	<div class="item" {...item} use:item.action on:m-select={onSelect} aria-disabled="true">
		New Window
	</div>
	<div class="item" {...$subTriggerA} use:subTriggerA.action>
		More Tools
		<ChevronRight class="h-4 w-4" />
	</div>
	<div class="menu subMenu" data-testid="hello" {...$subMenuA} use:subMenuA.action>
		<div class="item" {...item} use:item.action on:m-select={onSelect}>Save Page As..</div>
		<div class="item" {...item} use:item.action on:m-select={onSelect}>Create Shortcut..</div>
	</div>
	<div class="item" {...$subTriggerB} use:subTriggerB.action>
		Preferences
		<ChevronRight class="h-4 w-4" />
	</div>
	<div class="menu subMenu" {...$subMenuB} use:subMenuB.action>
		<div class="item" {...item} use:item.action on:m-select={onSelect}>Keyboard Shortcuts</div>
		<div class="item" {...item} use:item.action on:m-select={onSelect}>Accessibility</div>
	</div>
	<div class="item" {...item} use:item.action on:m-select={onSelect}>Show Bookmarks</div>
	<div class="item" {...item} use:item.action on:m-select={onSelect}>Show Full URLs</div>
	<div {...$arrow} />
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] w-52 flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply shadow-md shadow-neutral-900/30;
	}
	.item {
		@apply relative h-[25px] min-h-[25px] select-none rounded-md pl-4 pr-1;
		@apply z-20 text-magnum-900 outline-none;
		@apply data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center justify-between text-sm leading-none;
		@apply ring-0 !important;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90 data-[highlighted]:outline-none;
		@apply data-[highlighted]:ring-magnum-400 data-[highlighted]:ring-offset-2 !important;
		@apply focus:ring;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
