<script lang="ts">
	import { createDropdownMenu, melt, type CreateDropdownMenuProps } from '$lib/index.js';
	import { writable } from 'svelte/store';
	import { AlignJustify, ChevronRight } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);

	type $$Props = CreateDropdownMenuProps;
	export let loop = false;

	const {
		elements: { trigger, menu, item, separator, arrow },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
		states: { open },
	} = createDropdownMenu({
		forceVisible: true,
		loop,
		...$$restProps,
	});

	const {
		elements: { checkboxItem: settingsSyncCheckbox },
	} = createCheckboxItem({
		checked: settingsSync,
	});
	const {
		elements: { checkboxItem: hideMeltUICheckbox },
	} = createCheckboxItem({
		checked: hideMeltUI,
	});

	const {
		elements: { subMenu: subMenuA, subTrigger: subTriggerA },
		states: { subOpen },
	} = createSubmenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
		defaultValue: 'Hunter Johnston',
	});

	const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];
</script>

<main>
	<button
		type="button"
		class="trigger"
		use:melt={$trigger}
		aria-label="Update dimensions"
		data-testid="trigger"
	>
		<AlignJustify class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>
	{#if $open}
		<div class="menu" use:melt={$menu} data-testid="menu" transition:slide>
			<div class="item" use:melt={$item} data-testid="item1">Item 1</div>
			<div class="item" use:melt={$item} data-testid="item2" data-disabled>Item 2</div>
			<div class="separator" use:melt={$separator} />
			<div data-testid="checkboxItem1" class="item" use:melt={$settingsSyncCheckbox}>
				<div class="check">
					{#if $settingsSync}
						<span data-testid="check1"> Check 1 </span>
					{/if}
				</div>
				Item 3
			</div>
			<div data-testid="checkboxItem2" class="item" use:melt={$hideMeltUICheckbox}>
				<div class="check">
					{#if $hideMeltUI}
						<span data-testid="check2"> Check 2 </span>
					{/if}
				</div>
				Item 4
				<div class="rightSlot">⌘H</div>
			</div>
			<div class="item" use:melt={$subTriggerA} data-testid="subtrigger">
				Item 5
				<div class="rightSlot">
					<ChevronRight class="icon" />
				</div>
			</div>
			{#if $subOpen}
				<div class="menu subMenu" use:melt={$subMenuA} data-testid="submenu" transition:slide>
					<div class="text">People</div>
					<div use:melt={$radioGroup}>
						{#each personsArr as person, i}
							<div
								class="item"
								use:melt={$radioItem({ value: person })}
								data-testid={`subitem${i}`}
							>
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
				<div use:melt={$separator} class="separator" />

				<div class="item" use:melt={$item} aria-disabled="true">
					Show All Components
					<div class="rightSlot">⇧⌘N</div>
				</div>
				<div use:melt={$separator} class="separator" />
				<div class="item" use:melt={$item} data-testid="item3">
					Quit Melt UI
					<div class="rightSlot">⌘Q</div>
				</div>
			{/if}
			<div use:melt={$arrow} data-testid="arrow" />
		</div>
	{/if}
</main>

<style lang="scss">
	.menu {
		--at-apply:  z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
		--at-apply:  rounded-md bg-white p-1 shadow-neutral-900/30 lg:max-h-none;
		--at-apply:  ring-0 !important;
	}
	.subMenu {
		--at-apply:  min-w-[220px] shadow-md shadow-neutral-900/30;
	}
	.item {
		--at-apply:  relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
		--at-apply:  z-20 text-magnum-900 outline-none;
		--at-apply:  data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900;
		--at-apply:  data-[disabled]:text-neutral-300;
		--at-apply:  flex items-center text-sm leading-none;
		--at-apply:  ring-0 !important;
	}
	.trigger {
		--at-apply:  inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		--at-apply:  text-magnum-900 transition-colors hover:bg-white/90;
		--at-apply:  data-[highlighted]:ring-magnum-400 data-[highlighted]:ring-offset-2 !important;
		--at-apply:  p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
	}
	.check {
		--at-apply:  absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}

	.dot {
		--at-apply:  h-[4.75px] w-[4.75px] rounded-full bg-magnum-900;
	}

	.separator {
		--at-apply:  m-[5px] h-[1px] bg-magnum-200;
	}

	.rightSlot {
		--at-apply:  ml-auto pl-5;
	}

	.icon {
		--at-apply:  h-[13px] w-[13px];
	}
	.check {
		--at-apply:  absolute left-0 inline-flex w-6 items-center justify-center;
	}
	.text {
		--at-apply:  pl-6 text-xs leading-6 text-neutral-600;
	}
</style>
