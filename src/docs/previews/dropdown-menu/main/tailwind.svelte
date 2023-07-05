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

	const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);
</script>

<div class="flex w-full items-center justify-center">
	<button type="button" class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
		<AlignJustify class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	<div class="menu" {...$menu} use:menu>
		<div class="item" {...$item} use:item>About Melt UI</div>
		<div class="item" {...$item} use:item>Check for Updates...</div>
		<div class="separator" {...$separator} />
		<div class="item" {...$checkboxItem} use:checkboxItem={{ checked: settingsSync }}>
			<div class="check">
				{#if $settingsSync}
					<Check class="icon" />
				{/if}
			</div>
			Settings Sync is On
		</div>
		<div class="item" {...$subTriggerA} use:subTriggerA>
			Profiles
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		<div class="menu subMenu" {...$subMenuA} use:subMenuA>
			<div class="text">People</div>
			<div {...$radioGroup}>
				{#each personsArr as person}
					<div class="item" {...$radioItem({ value: person })} use:radioItem>
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
		<div {...$separator} class="separator" />

		<div class="item" {...$checkboxItem} use:checkboxItem={{ checked: hideMeltUI }}>
			<div class="check">
				{#if $hideMeltUI}
					<Check class="icon" />
				{/if}
			</div>
			Hide Melt UI
			<div class="rightSlot">⌘H</div>
		</div>
		<div class="item" {...$item} use:item aria-disabled="true">
			Show All Components
			<div class="rightSlot">⇧⌘N</div>
		</div>
		<div {...$separator} class="separator" />
		<div class="item" {...$item} use:item>
			Quit Melt UI
			<div class="rightSlot">⌘Q</div>
		</div>
		<div {...$arrow} />
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
