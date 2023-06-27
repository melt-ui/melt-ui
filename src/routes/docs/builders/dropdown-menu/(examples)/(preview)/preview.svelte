<script lang="ts">
	import { createDropdownMenu } from '$lib';
	import { writable } from 'svelte/store';
	import AlignJustify from '~icons/lucide/align-justify';
	import ChevronRight from '~icons/lucide/chevron-right';
	import Check from '~icons/lucide/check';

	const {
		trigger,
		menu,
		item,
		checkboxItem,
		arrow,
		separator,
		createSubMenu,
		createMenuRadioGroup,
	} = createDropdownMenu();

	const { subMenu: subMenuA, subTrigger: subTriggerA } = createSubMenu();

	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: 'Hunter Johnston',
	});

	const personsArr = ['Hunter Johnston', 'Thomas G. Lopes'];

	const showBookmarks = writable(false);
	const showFullURLs = writable(false);
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

<div class="menu" {...$menu} use:menu.action>
	<div class="item" {...item} use:item.action>
		New Tab
		<div class="rightSlot">⌘+T</div>
	</div>

	<div class="item" {...item} use:item.action>
		New Window
		<div class="rightSlot">⌘+N</div>
	</div>

	<div class="item" {...item} use:item.action aria-disabled="true">
		New Private Window
		<div class="rightSlot">⇧+⌘+N</div>
	</div>
	<div class="item" {...$subTriggerA} use:subTriggerA.action>
		More Tools
		<div class="rightSlot">
			<ChevronRight class="h-[15px] w-[15px]" />
		</div>
	</div>
	<div class="menu subMenu" data-testid="hello" {...$subMenuA} use:subMenuA.action>
		<div class="item" {...item} use:item.action>Save Page As...</div>
		<div class="item" {...item} use:item.action>Create Shortcut...</div>
		<div class="item" {...item} use:item.action>Name Window...</div>
		<div {...separator} class="separator" />
		<div class="item" {...item} use:item.action>Developer Tools</div>
	</div>
	<div {...separator} class="separator" />
	<div class="item" {...checkboxItem} use:checkboxItem.action={{ checked: showBookmarks }}>
		<div class="absolute left-0 inline-flex w-[25px] items-center justify-center">
			{#if $showBookmarks}
				<Check class="h-[13px] w-[13px]" />
			{/if}
		</div>
		Show Bookmarks
		<div class="rightSlot">⌘+B</div>
	</div>
	<div class="item" {...checkboxItem} use:checkboxItem.action={{ checked: showFullURLs }}>
		<div class="absolute left-0 inline-flex w-[25px] items-center justify-center">
			{#if $showFullURLs}
				<Check class="h-[13px] w-[13px]" />
			{/if}
		</div>
		Show Full URLs
	</div>
	<div {...separator} class="separator" />
	<div class="pl-6 text-xs leading-6 text-neutral-600">People</div>
	<div {...radioGroup}>
		{#each personsArr as person}
			<div class="item" {...$radioItem(person)} use:radioItem.action>
				<div class="absolute left-0 inline-flex w-[25px] items-center justify-center">
					{#if $isChecked(person)}
						<div class="h-[4.75px] w-[4.75px] rounded-full bg-magnum-900" />
					{/if}
				</div>
				{person}
			</div>
		{/each}
	</div>
	<div {...$arrow} />
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply min-w-[220px] shadow-md shadow-neutral-900/30;
	}
	.item {
		@apply relative h-[25px] min-h-[25px] select-none rounded-sm pl-6 pr-1;
		@apply z-20 text-magnum-900 outline-none;
		@apply data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
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

	.separator {
		@apply m-[5px] h-[1px] bg-magnum-200;
	}

	.rightSlot {
		@apply ml-auto pl-5;
	}
</style>
