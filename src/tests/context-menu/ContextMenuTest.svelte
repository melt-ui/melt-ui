<script lang="ts">
	import { createContextMenu, melt, type CreateContextMenuProps } from '$lib/index.js';
	import { writable } from 'svelte/store';
	import { ChevronRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { removeUndefined } from '../utils';

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);

	type $$Props = CreateContextMenuProps;

	export let loop = false;
	export let closeFocus: CreateContextMenuProps['closeFocus'] = undefined;
	export let closeOnEscape: CreateContextMenuProps['closeOnEscape'] = true;
	export let closeOnOutsideClick: CreateContextMenuProps['closeOnOutsideClick'] = true;
	export let submenuIds: CreateContextMenuProps['ids'] = undefined;

	const {
		elements: { trigger, menu, item, separator, arrow },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
		states: { open },
	} = createContextMenu({
		loop,
		closeFocus,
		closeOnEscape,
		closeOnOutsideClick,
		...$$restProps,
		forceVisible: true,
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
	} = createSubmenu(
		removeUndefined({
			ids: submenuIds,
		})
	);

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
		defaultValue: 'Hunter Johnston',
	});

	const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];
</script>

<main>
	<div data-testid="outside-click">outside</div>
	<button id="closeFocus" data-testid="closeFocus">close focus</button>
	<div use:melt={$trigger} aria-label="Update dimensions" data-testid="trigger">open menu</div>
	{#if $open}
		<div use:melt={$menu} data-testid="menu" transition:fade>
			<div use:melt={$item} data-testid="item1">Item 1</div>
			<div use:melt={$item} data-testid="item2" data-disabled>Item 2</div>
			<div class="separator" use:melt={$separator} />
			<div data-testid="checkboxItem1" use:melt={$settingsSyncCheckbox}>
				<div class="check">
					{#if $settingsSync}
						<span data-testid="check1"> Check 1 </span>
					{/if}
				</div>
				Item 3
			</div>
			<div data-testid="checkboxItem2" use:melt={$hideMeltUICheckbox}>
				<div class="check">
					{#if $hideMeltUI}
						<span data-testid="check2"> Check 2 </span>
					{/if}
				</div>
				Item 4
				<div class="rightSlot">⌘H</div>
			</div>
			<div use:melt={$subTriggerA} data-testid="sub-trigger">
				Item 5
				<div class="rightSlot">
					<ChevronRight />
				</div>
			</div>
			{#if $subOpen}
				<div use:melt={$subMenuA} transition:fade data-testid="submenu">
					<div class="text">People</div>
					<div use:melt={$radioGroup}>
						{#each personsArr as person, i}
							<div use:melt={$radioItem({ value: person })} data-testid={`subitem${i}`}>
								<div>
									{#if $isChecked(person)}
										<div />
									{/if}
								</div>
								{person}
							</div>
						{/each}
					</div>
				</div>
			{/if}
			<div use:melt={$separator} />

			<div use:melt={$item} aria-disabled="true">
				Show All Components
				<div>⇧⌘N</div>
			</div>
			<div use:melt={$separator} />
			<div use:melt={$item} data-testid="copy">Copy</div>
			<div use:melt={$item} data-testid="cut">Cut</div>
			<div use:melt={$item} data-testid="paste">Paste</div>
			<div use:melt={$separator} />
			<div use:melt={$arrow} data-testid="arrow" />
		</div>
	{/if}
</main>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg;
		@apply rounded-md;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply min-w-[220px];
	}
	.item {
		@apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
		@apply z-20  outline-none;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}
	.trigger {
		@apply inline-flex h-24 w-24 items-center justify-center rounded-full;
		@apply p-0 text-sm font-medium transition-colors;
	}
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}

	.dot {
		@apply h-[4.75px] w-[4.75px] rounded-full;
	}

	.separator {
		@apply m-[5px] h-[1px];
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
		@apply pl-6 text-xs leading-6;
	}
</style>
