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
		open,
	} = createDropdownMenu();

	const { subMenu: subMenuA, subTrigger: subTriggerA } = createSubMenu();

	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: 'Hunter Johnston',
	});

	const personsArr = [
		'Hunter Johnston',
		'Thomas G. Lopes',
		'Adrian Gonz',
		'Franck Poingt',
	];

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);
</script>

<button
	type="button"
	class="trigger"
	melt={$trigger}
	aria-label="Update dimensions"
>
	<AlignJustify class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

<div class="menu" melt={$menu}>
	<div class="item" melt={$item}>About Melt UI</div>
	<div class="item" melt={$item}>Check for Updates...</div>
	<div class="separator" melt={$separator} />
	<div
		class="item"
		{...$checkboxItem}
		use:checkboxItem={{ checked: settingsSync }}
	>
		<div class="check">
			{#if $settingsSync}
				<Check class="icon" />
			{/if}
		</div>
		Settings Sync is On
	</div>
	<div class="item" melt={$subTriggerA}>
		Profiles
		<div class="rightSlot">
			<ChevronRight class="icon" />
		</div>
	</div>
	<div class="menu subMenu" melt={$subMenuA}>
		<div class="text">People</div>
		<div melt={$radioGroup}>
			{#each personsArr as person}
				<div class="item" melt={$radioItem({ value: person })}>
					<div class="check">
						{#if $isChecked(person)}
							<div class="dot" />
						{/if}
					</div>
					{person}
				</div>
			{/each}
		</div>
	</div>
	<div melt={$separator} class="separator" />

	<div
		class="item"
		{...$checkboxItem}
		use:checkboxItem={{ checked: hideMeltUI }}
	>
		<div class="check">
			{#if $hideMeltUI}
				<Check class="icon" />
			{/if}
		</div>
		Hide Melt UI
		<div class="rightSlot">⌘H</div>
	</div>
	<div class="item" melt={$item} aria-disabled="true">
		Show All Components
		<div class="rightSlot">⇧⌘N</div>
	</div>
	<div melt={$separator} class="separator" />
	<div class="item" melt={$item}>
		Quit Melt UI
		<div class="rightSlot">⌘Q</div>
	</div>
	<div melt={$arrow} />
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
		@apply rounded-md bg-white p-1 shadow-neutral-900/30 lg:max-h-none;
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
		@apply ring-0 !important;
	}
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply data-[highlighted]:ring-magnum-400 data-[highlighted]:ring-offset-2 !important;
		@apply p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
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
