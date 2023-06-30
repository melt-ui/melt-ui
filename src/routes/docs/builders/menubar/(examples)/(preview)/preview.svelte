<script lang="ts">
	import { createMenubar } from '$lib';
	import { writable } from 'svelte/store';
	import ChevronRight from '~icons/lucide/chevron-right';
	import Check from '~icons/lucide/check';

	const { menubar, createMenu } = createMenubar();

	const { trigger, menu, item, separator, createSubmenu, createMenuRadioGroup } = createMenu();
	const { subMenu, subTrigger } = createSubmenu();
	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: 'Nord',
	});

	const { trigger: triggerA, menu: menuA, item: itemA, separator: separatorA } = createMenu();

	const {
		trigger: triggerB,
		menu: menuB,
		item: itemB,
		checkboxItem: checkboxItemB,
		separator: separatorB,
		createSubmenu: createSubmenuB,
	} = createMenu();
	const { subMenu: subMenuB, subTrigger: subTriggerB } = createSubmenuB();

	const {
		trigger: triggerC,
		menu: menuC,
		item: itemC,
		checkboxItem: checkboxItemC,
		separator: separatorC,
	} = createMenu();

	const themesArr = ['Nord', 'GitHub Dark', 'Moonlight'];

	const tipsAndTricks = writable(true);
	const hideMeltUI = writable(false);
	const wordWrap = writable(true);
	const stickyScroll = writable(false);
</script>

<div class="flex rounded-md bg-white p-1 shadow-md" {...menubar} use:menubar.action>
	<button
		type="button"
		class="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-magnum-800"
		{...$trigger}
		use:trigger.action
		aria-label="Update dimensions"
	>
		File
	</button>

	<div class="menu" {...$menu} use:menu.action>
		<div class="item" {...item} use:item.action>New Text File</div>
		<div class="item" {...item} use:item.action>
			New File...
			<div class="rightSlot">⌘T</div>
		</div>
		<div class="item" {...item} use:item.action aria-disabled="true">
			New Window...
			<div class="rightSlot">⇧⌘T</div>
		</div>
		<div class="separator" {...separator} />
		<div class="item" {...$subTrigger} use:subTrigger.action>
			Select theme
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		<div class="menu subMenu" {...$subMenu} use:subMenu.action>
			<div {...radioGroup}>
				{#each themesArr as theme}
					<div class="item" {...$radioItem({ value: theme })} use:radioItem.action>
						<div class="check">
							{#if $isChecked(theme)}
								<div class="dot" />
							{/if}
						</div>
						{theme}
					</div>
				{/each}
			</div>
		</div>
		<div {...separator} class="separator" />
		<div class="item" {...item} use:item.action>
			Quit Melt UI
			<div class="rightSlot">⌘Q</div>
		</div>
	</div>

	<!------------>
	<!-- EDIT -->
	<!------------>
	<button
		type="button"
		class="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-magnum-800"
		{...$triggerA}
		use:triggerA.action
		aria-label="Update dimensions"
	>
		Edit
	</button>

	<div class="menu" {...$menuA} use:menuA.action>
		<div class="item" {...itemA} use:itemA.action>
			Undo
			<div class="rightSlot">⌘Z</div>
		</div>
		<div class="item" {...itemA} use:itemA.action>
			Redo
			<div class="rightSlot">⇧⌘Z</div>
		</div>
		<div class="separator" {...separatorA} />
		<div class="item" {...itemA} use:itemA.action>
			Cut
			<div class="rightSlot">⌘X</div>
		</div>
		<div class="item" {...itemA} use:itemA.action>
			Copy
			<div class="rightSlot">⌘C</div>
		</div>
		<div class="item" {...itemA} use:itemA.action>
			Paste
			<div class="rightSlot">⌘V</div>
		</div>

		<div {...separatorA} class="separator" />

		<div class="item" {...itemA} use:itemA.action>
			Find
			<div class="rightSlot">⌘F</div>
		</div>
		<div class="item" {...itemA} use:itemA.action>
			Replace
			<div class="rightSlot">⌥⌘F</div>
		</div>
	</div>

	<!------------>
	<!-- VIEW -->
	<!------------>
	<button
		type="button"
		class="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-magnum-800"
		{...$triggerB}
		use:triggerB.action
		aria-label="Update dimensions"
	>
		View
	</button>

	<div class="menu" {...$menuB} use:menuB.action>
		<div class="item" {...itemB} use:itemB.action>
			Command Palette..
			<div class="rightSlot">⇧⌘P</div>
		</div>
		<div class="item" {...itemB} use:itemB.action>Open View...</div>
		<div class="separator" {...separatorB} />
		<div class="item" {...$subTriggerB} use:subTriggerB.action>
			Appearance
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		<div class="menu subMenu" {...$subMenuB} use:subMenuB.action>
			<div {...radioGroup}>
				<div class="item" {...itemB} use:itemB.action>Full Screen</div>
				<div class="item" {...itemB} use:itemB.action>Zen Mode</div>
			</div>
		</div>
		<div class="separator" {...separatorB} />

		<div class="item" {...checkboxItemB} use:checkboxItemB.action={{ checked: wordWrap }}>
			<div class="check">
				{#if $wordWrap}
					<Check class="icon" />
				{/if}
			</div>
			Word Wrap
			<div class="rightSlot">⌘H</div>
		</div>
		<div class="item" {...checkboxItemB} use:checkboxItemB.action={{ checked: stickyScroll }}>
			<div class="check">
				{#if $stickyScroll}
					<Check class="icon" />
				{/if}
			</div>
			Sticky Scroll
		</div>
	</div>

	<!------------>
	<!-- HELP -->
	<!------------>
	<button
		type="button"
		class="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-magnum-800"
		{...$triggerC}
		use:triggerC.action
		aria-label="Update dimensions"
	>
		Help
	</button>

	<div class="menu" {...$menuC} use:menuC.action>
		<div class="item" {...itemC} use:itemC.action>About Melt UI</div>
		<div class="item" {...itemC} use:itemC.action>Check for Updates...</div>
		<div class="separator" {...separatorC} />
		<div class="item" {...checkboxItemC} use:checkboxItemC.action={{ checked: tipsAndTricks }}>
			<div class="check">
				{#if $tipsAndTricks}
					<Check class="icon" />
				{/if}
			</div>
			Tips & Tricks
		</div>

		<div {...separatorC} class="separator" />

		<div class="item" {...checkboxItemC} use:checkboxItemC.action={{ checked: hideMeltUI }}>
			<div class="check">
				{#if $hideMeltUI}
					<Check class="icon" />
				{/if}
			</div>
			Documentation
		</div>
		<div class="item" {...itemC} use:itemC.action aria-disabled="true">
			Show All Components
			<div class="rightSlot">⇧⌘N</div>
		</div>
		<div {...separatorC} class="separator" />
		<div class="item" {...itemC} use:itemC.action>Report a bug...</div>
	</div>
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

	.dot {
		@apply h-[4.75px] w-[4.75px] rounded-full bg-magnum-900;
	}

	.separator {
		@apply m-[5px] h-[1px] bg-magnum-200;
	}

	.rightSlot {
		@apply ml-auto pl-5;
	}

	.icon {
		@apply h-[13px] w-[13px];
	}
	.check {
		@apply absolute left-0 inline-flex w-[25px] items-center justify-center;
	}
	.text {
		@apply pl-6 text-xs leading-6 text-neutral-600;
	}
</style>
