<script lang="ts">
	import { createMenubar, melt } from '$lib/index.js';
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

<div class="menubar" use:melt={$menubar}>
	<!------------>
	<!--- FILE --->
	<!------------>
	<button
		type="button"
		class="trigger"
		use:melt={$trigger}
		aria-label="Update dimensions"
	>
		File
	</button>

	<div class="menu" use:melt={$menu}>
		<div class="item" use:melt={$item}>New Text File</div>
		<div class="item" use:melt={$item}>
			New File...
			<div class="rightSlot">⌘T</div>
		</div>
		<div class="item" use:melt={$item} data-disabled>
			New Window...
			<div class="rightSlot">⇧⌘T</div>
		</div>
		<div class="separator" use:melt={$separator} />
		<div class="item" use:melt={$subTrigger}>
			Select theme
			<div class="rightSlot">
				<ChevronRight class="square-4" />
			</div>
		</div>
		<div class="menu subMenu" use:melt={$subMenu}>
			<div use:melt={$radioGroup}>
				{#each themesArr as theme}
					<div class="item" use:melt={$radioItem({ value: theme })}>
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
		<div use:melt={$separator} class="separator" />
		<div class="item" use:melt={$item}>
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
		use:melt={$triggerA}
		aria-label="Update dimensions"
	>
		Edit
	</button>

	<div class="menu" use:melt={$menuA}>
		<div class="item" use:melt={$itemA}>
			Undo
			<div class="rightSlot">⌘Z</div>
		</div>
		<div class="item" use:melt={$itemA}>
			Redo
			<div class="rightSlot">⇧⌘Z</div>
		</div>
		<div class="separator" use:melt={$separatorA} />
		<div class="item" use:melt={$itemA}>
			Cut
			<div class="rightSlot">⌘X</div>
		</div>
		<div class="item" use:melt={$itemA}>
			Copy
			<div class="rightSlot">⌘C</div>
		</div>
		<div class="item" use:melt={$itemA}>
			Paste
			<div class="rightSlot">⌘V</div>
		</div>

		<div use:melt={$separatorA} class="separator" />

		<div class="item" use:melt={$itemA}>
			Find
			<div class="rightSlot">⌘F</div>
		</div>
		<div class="item" use:melt={$itemA}>
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
		use:melt={$triggerB}
		aria-label="Update dimensions"
	>
		View
	</button>

	<div class="menu" use:melt={$menuB}>
		<div class="item" use:melt={$itemB}>
			Command Palette..
			<div class="rightSlot">⇧⌘P</div>
		</div>
		<div class="item" use:melt={$itemB}>Open View...</div>
		<div class="separator" use:melt={$separatorB} />
		<div class="item" use:melt={$subTriggerB}>
			Appearance
			<div class="rightSlot">
				<ChevronRight class="square-4" />
			</div>
		</div>
		<div class="menu subMenu" use:melt={$subMenuB}>
			<div use:melt={$radioGroup}>
				<div class="item" use:melt={$itemB}>Full Screen</div>
				<div class="item" use:melt={$itemB}>Zen Mode</div>
			</div>
		</div>
		<div class="separator" use:melt={$separatorB} />

		<div class="item" use:melt={$wordWrapCheckbox}>
			<div class="check">
				{#if $wordWrap}
					<Check class="square-4" />
				{/if}
			</div>
			Word Wrap
			<div class="rightSlot">⌘H</div>
		</div>
		<div class="item" use:melt={$stickyScrollCheckbox}>
			<div class="check">
				{#if $stickyScroll}
					<Check class="square-4" />
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
		use:melt={$triggerC}
		aria-label="Update dimensions"
	>
		Help
	</button>

	<div class="menu" use:melt={$menuC}>
		<div class="item" use:melt={$itemC}>About Melt UI</div>
		<div class="item" use:melt={$itemC}>Check for Updates...</div>
		<div class="separator" use:melt={$separatorC} />
		<div class="item" use:melt={$tipsAndTricksCheckbox}>
			<div class="check">
				{#if $tipsAndTricks}
					<Check class="square-4" />
				{/if}
			</div>
			Tips & Tricks
		</div>

		<div use:melt={$separatorC} class="separator" />

		<div class="item" use:melt={$hideMeltUICheckbox}>
			<div class="check">
				{#if $hideMeltUI}
					<Check class="square-4" />
				{/if}
			</div>
			Documentation
		</div>
		<div class="item" use:melt={$itemC} data-disabled>
			Show All Components
			<div class="rightSlot">⇧⌘N</div>
		</div>
		<div use:melt={$separatorC} class="separator" />
		<div class="item" use:melt={$itemC}>Report a bug...</div>
	</div>
</div>

<style>
	* {
		all: unset;
	}

	/* CSS Variables */
	:root {
		--magnum-50: #fff9ed;
		--magnum-100: #fef2d6;
		--magnum-200: #fce0ac;
		--magnum-300: #f9c978;
		--magnum-400: #f7b155;
		--magnum-500: #f38d1c;
		--magnum-600: #e47312;
		--magnum-700: #bd5711;
		--magnum-800: #964516;
		--magnum-900: #793a15;
		--magnum-950: #411c09;

		--neutral-50: #fafafa;
		--neutral-100: #f5f5f5;
		--neutral-200: #e5e5e5;
		--neutral-300: #d4d4d4;
		--neutral-400: #a3a3a3;
		--neutral-500: #737373;
		--neutral-600: #525252;
		--neutral-700: #404040;
		--neutral-800: #262626;
		--neutral-900: #171717;
		--neutral-950: #0a0a0a;

		--shadow-sm: 0 1px 2px 0 var(--shadow-color, rgb(0 0 0 / 0.05));
		--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		--shadow-lg: 0 10px 15px -3px var(--shadow-color, rgb(0 0 0 / 0.1)),
			0 4px 6px -4px var(--shadow-color, rgb(0 0 0 / 0.1));
		--shadow-xl: 0 0 #0000, 0 0 #0000,
			0 10px 15px -3px var(--shadow-color, rgb(0 0 0 / 0.1)),
			0 4px 6px -4px var(--shadow-color, rgb(0 0 0 / 0.1));

		--fs-xs: 0.75rem;
		--fs-sm: 0.875rem;
		--fs-base: 1rem;
		--fs-lg: 1.125rem;
		--fs-xl: 1.25rem;
		--fs-2xl: 1.5rem;
		--fs-3xl: 1.875rem;
		--fs-4xl: 2.25rem;
		--fs-5xl: 3rem;
		--fs-6xl: 4rem;
		--fs-7xl: 5rem;
		--fs-8xl: 6rem;
		--fs-9xl: 8rem;

		--fw-thin: 100;
		--fw-extralight: 200;
		--fw-light: 300;
		--fw-normal: 400;
		--fw-medium: 500;
		--fw-semibold: 600;
		--fw-bold: 700;
		--fw-extrabold: 800;
		--fw-black: 900;

		--radius-sm: 0.125rem;
		--radius-base: 0.25rem;
		--radius-md: 0.375rem;
		--radius-lg: 0.5rem;
		--radius-xl: 0.75rem;
		--radius-2xl: 1rem;
		--radius-3xl: 1.5rem;
		--radius-full: 9999px;

		--lh-none: 1;

		--ring-width: 1px;
		--ring-offset-width: 2px;
		--ring-color: var(--magnum-400);
		--ring-offset-color: #fff;
		--ring-offset-shadow: 0 0 0 var(--ring-offset-width)
			var(--ring-offset-color);
		--ring-shadow: 0 0 0 calc(var(--ring-width) + var(--ring-offset-width))
			var(--ring-color);
	}

	.menubar {
		display: flex;
		border-radius: var(--radius-md);
		background-color: white;
		padding: 0.25rem;
		box-shadow: var(--shadow-md);
	}

	.trigger {
		--bg-opacity: 1;

		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		background-color: rgb(255 255 255 / var(--bg-opacity));
		padding-inline: 0.75rem;
		padding-block: 0.5rem;

		color: var(--magnum-900);
		transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);

		overflow: visible;
		cursor: default !important;
		font-size: var(--fs-sm);
		font-weight: var(--fw-medium);
		line-height: var(--lh-none);
	}

	.trigger:hover {
		--bg-opacity: 0.9;
	}

	.trigger:focus {
		z-index: 30;
	}

	:global([data-highlighted]).trigger {
		outline: none;
		background-color: var(--magnum-200);
	}

	.menu {
		--shadow-color: rgb(23 23 23 / 0.3);

		z-index: 10;
		max-width: 300px;
		min-width: 220px;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-lg);
		border-radius: var(--radius-md);
		background-color: white;
		padding: 0.25rem;

		@media (min-width: 1024px) {
			max-height: none;
		}
	}

	.menu:focus-visible {
		box-shadow: none !important;
	}

	.subMenu {
		--shadow-color: rgb(23 23 23 / 0.3);

		min-width: 220px;
		box-shadow: var(--shadow-md);
	}

	.item {
		position: relative;
		height: 1.5rem;
		min-height: 24px;
		user-select: none;
		-webkit-user-select: none;
		border-radius: var(--radius-sm);
		padding-left: 1.5rem;
		padding-right: 0.25rem;

		z-index: 20;
		color: var(--magnum-900);
		outline: none;

		display: flex;
		align-items: center;
		line-height: 1;
		font-size: var(--fs-sm);
		cursor: default;
		box-shadow: none !important;
	}

	:global([data-highlighted]).item {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.item[data-disabled] {
		color: var(--neutral-300);
	}

	.check {
		position: absolute;
		left: 0;
		width: 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--magnum-500);
	}

	.dot {
		height: 4.75px;
		width: 4.75px;
		border-radius: var(--radius-full);
		background-color: var(--magnum-900);
	}

	.separator {
		margin: 5px;
		height: 1px;
		background-color: var(--magnum-200);
	}

	.rightSlot {
		margin-left: auto;
		padding-left: 1.25rem;
	}
</style>
