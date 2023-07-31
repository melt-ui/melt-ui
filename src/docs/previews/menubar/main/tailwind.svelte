<script lang="ts">
	import { createMenubar } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import { ChevronRight, Check } from 'lucide-svelte';

	const tipsAndTricks = writable(true);
	const hideMeltUI = writable(false);
	const wordWrap = writable(true);
	const stickyScroll = writable(false);

	const {
		elements: { menubar },
		builders: { createMenu },
	} = createMenubar();

	const {
		elements: { trigger, menu, item, separator },
		builders: { createSubmenu, createMenuRadioGroup },
	} = createMenu();

	const {
		elements: { subMenu, subTrigger },
	} = createSubmenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
		defaultValue: 'Nord',
	});

	const {
		elements: {
			trigger: triggerA,
			menu: menuA,
			item: itemA,
			separator: separatorA,
		},
	} = createMenu();

	const {
		elements: {
			trigger: triggerB,
			menu: menuB,
			item: itemB,
			separator: separatorB,
		},
		builders: {
			createSubmenu: createSubmenuB,
			createCheckboxItem: createCheckboxItemB,
		},
	} = createMenu();

	const {
		elements: { checkboxItem: wordWrapCheckbox },
	} = createCheckboxItemB({
		checked: wordWrap,
	});
	const {
		elements: { checkboxItem: stickyScrollCheckbox },
	} = createCheckboxItemB({
		checked: stickyScroll,
	});

	const {
		elements: { subMenu: subMenuB, subTrigger: subTriggerB },
	} = createSubmenuB();

	const {
		elements: {
			trigger: triggerC,
			menu: menuC,
			item: itemC,
			separator: separatorC,
		},
		builders: { createCheckboxItem: createCheckboxItemC },
	} = createMenu();

	const {
		elements: { checkboxItem: tipsAndTricksCheckbox },
	} = createCheckboxItemC({
		checked: tipsAndTricks,
	});

	const {
		elements: { checkboxItem: hideMeltUICheckbox },
	} = createCheckboxItemC({
		checked: hideMeltUI,
	});

	const themesArr = ['Nord', 'GitHub Dark', 'Moonlight'];
</script>

<div class="flex rounded-md bg-white p-1 shadow-md" melt={$menubar}>
	<!------------>
	<!--- FILE --->
	<!------------>
	<button
		type="button"
		class="trigger"
		melt={$trigger}
		aria-label="Update dimensions"
	>
		File
	</button>

	<div class="menu" melt={$menu}>
		<div class="item" melt={$item}>New Text File</div>
		<div class="item" melt={$item}>
			New File...
			<div class="rightSlot">⌘T</div>
		</div>
		<div class="item" melt={$item} aria-disabled="true">
			New Window...
			<div class="rightSlot">⇧⌘T</div>
		</div>
		<div class="separator" melt={$separator} />
		<div class="item" melt={$subTrigger}>
			Select theme
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		<div class="menu subMenu" melt={$subMenu}>
			<div melt={$radioGroup}>
				{#each themesArr as theme}
					<div class="item" melt={$radioItem({ value: theme })}>
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
		<div melt={$separator} class="separator" />
		<div class="item" melt={$item}>
			Quit Melt UI
			<div class="rightSlot">⌘Q</div>
		</div>
	</div>

	<!------------>
	<!--- EDIT --->
	<!------------>
	<button
		type="button"
		class="trigger"
		melt={$triggerA}
		aria-label="Update dimensions"
	>
		Edit
	</button>

	<div class="menu" melt={$menuA}>
		<div class="item" melt={$itemA}>
			Undo
			<div class="rightSlot">⌘Z</div>
		</div>
		<div class="item" melt={$itemA}>
			Redo
			<div class="rightSlot">⇧⌘Z</div>
		</div>
		<div class="separator" melt={$separatorA} />
		<div class="item" melt={$itemA}>
			Cut
			<div class="rightSlot">⌘X</div>
		</div>
		<div class="item" melt={$itemA}>
			Copy
			<div class="rightSlot">⌘C</div>
		</div>
		<div class="item" melt={$itemA}>
			Paste
			<div class="rightSlot">⌘V</div>
		</div>

		<div melt={$separatorA} class="separator" />

		<div class="item" melt={$itemA}>
			Find
			<div class="rightSlot">⌘F</div>
		</div>
		<div class="item" melt={$itemA}>
			Replace
			<div class="rightSlot">⌥⌘F</div>
		</div>
	</div>

	<!------------>
	<!--- VIEW --->
	<!------------>
	<button
		type="button"
		class="trigger"
		melt={$triggerB}
		aria-label="Update dimensions"
	>
		View
	</button>

	<div class="menu" melt={$menuB}>
		<div class="item" melt={$itemB}>
			Command Palette..
			<div class="rightSlot">⇧⌘P</div>
		</div>
		<div class="item" melt={$itemB}>Open View...</div>
		<div class="separator" melt={$separatorB} />
		<div class="item" melt={$subTriggerB}>
			Appearance
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		<div class="menu subMenu" melt={$subMenuB}>
			<div melt={$radioGroup}>
				<div class="item" melt={$itemB}>Full Screen</div>
				<div class="item" melt={$itemB}>Zen Mode</div>
			</div>
		</div>
		<div class="separator" melt={$separatorB} />

		<div class="item" {...$wordWrapCheckbox} use:wordWrapCheckbox>
			<div class="check">
				{#if $wordWrap}
					<Check class="icon" />
				{/if}
			</div>
			Word Wrap
			<div class="rightSlot">⌘H</div>
		</div>
		<div class="item" {...$stickyScrollCheckbox} use:stickyScrollCheckbox>
			<div class="check">
				{#if $stickyScroll}
					<Check class="icon" />
				{/if}
			</div>
			Sticky Scroll
		</div>
	</div>

	<!------------>
	<!--- HELP --->
	<!------------>
	<button
		type="button"
		class="trigger"
		melt={$triggerC}
		aria-label="Update dimensions"
	>
		Help
	</button>

	<div class="menu" melt={$menuC}>
		<div class="item" melt={$itemC}>About Melt UI</div>
		<div class="item" melt={$itemC}>Check for Updates...</div>
		<div class="separator" melt={$separatorC} />
		<div class="item" {...$tipsAndTricksCheckbox} use:tipsAndTricksCheckbox>
			<div class="check">
				{#if $tipsAndTricks}
					<Check class="icon" />
				{/if}
			</div>
			Tips & Tricks
		</div>

		<div melt={$separatorC} class="separator" />

		<div class="item" {...$hideMeltUICheckbox} use:hideMeltUICheckbox>
			<div class="check">
				{#if $hideMeltUI}
					<Check class="icon" />
				{/if}
			</div>
			Documentation
		</div>
		<div class="item" melt={$itemC} aria-disabled="true">
			Show All Components
			<div class="rightSlot">⇧⌘N</div>
		</div>
		<div melt={$separatorC} class="separator" />
		<div class="item" melt={$itemC}>Report a bug...</div>
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
		@apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
		@apply z-20 text-magnum-900 outline-none;
		@apply data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply cursor-default ring-0 !important;
	}

	.trigger {
		@apply inline-flex items-center justify-center rounded-md bg-white px-3 py-2;
		@apply text-magnum-900 transition-colors hover:bg-white/90 data-[highlighted]:outline-none;
		@apply overflow-visible data-[highlighted]:bg-magnum-200 data-[highlighted]:ring-magnum-400 !important;
		@apply !cursor-default text-sm font-medium leading-none focus:z-30 focus:ring;
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
		@apply absolute left-0 inline-flex w-6 items-center justify-center;
	}
	.text {
		@apply pl-6 text-xs leading-6 text-neutral-600;
	}
</style>
