<script lang="ts">
	import { createDropdownMenu, melt } from '$lib/index.js';
	import { writable } from 'svelte/store';
	import { AlignJustify, ChevronRight, Check } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);

	const {
		elements: { trigger, menu, item, separator, arrow },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
		states: { open },
	} = createDropdownMenu({
		forceVisible: true,
	});

	const {
		elements: { subMenu, subTrigger },
		states: { subOpen },
	} = createSubmenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
		defaultValue: 'Hunter Johnston',
	});

	const {
		elements: { checkboxItem },
	} = createCheckboxItem({
		checked: settingsSync,
	});

	const {
		elements: { checkboxItem: checkboxItemA },
	} = createCheckboxItem({
		checked: hideMeltUI,
	});

	const personsArr = [
		'Hunter Johnston',
		'Thomas G. Lopes',
		'Adrian Gonz',
		'Franck Poingt',
	];
</script>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
>
	<AlignJustify class="square-4" />
	<span class="sr-only">Open Popover</span>
</button>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<div class="item" use:melt={$item}>About Melt UI</div>
		<div class="item" use:melt={$item}>Check for Updates...</div>
		<div class="separator" use:melt={$separator} />
		<div class="item" use:melt={$checkboxItem}>
			<div class="check">
				{#if $settingsSync}
					<Check class="icon" />
				{/if}
			</div>
			Settings Sync is On
		</div>
		<div class="item" use:melt={$subTrigger}>
			Profiles
			<div class="rightSlot">
				<ChevronRight class="icon" />
			</div>
		</div>
		{#if $subOpen}
			<div
				class="menu subMenu"
				use:melt={$subMenu}
				transition:fly={{ x: -50, duration: 150 }}
			>
				<div class="text">People</div>
				<div use:melt={$radioGroup}>
					{#each personsArr as person}
						<div class="item" use:melt={$radioItem({ value: person })}>
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
		{/if}
		<div use:melt={$separator} class="separator" />

		<div class="item" use:melt={$checkboxItemA}>
			<div class="check">
				{#if $hideMeltUI}
					<Check class="icon" />
				{/if}
			</div>
			Hide Melt UI
			<div class="rightSlot">⌘H</div>
		</div>
		<div class="item" use:melt={$item} data-disabled>
			Show All Components
			<div class="rightSlot">⇧⌘N</div>
		</div>
		<div use:melt={$separator} class="separator" />
		<div class="item" use:melt={$item}>
			Quit Melt UI
			<div class="rightSlot">⌘Q</div>
		</div>
		<div use:melt={$arrow} />
	</div>
{/if}

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
		@apply p-0 text-sm font-medium  data-[highlighted]:outline-none;
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
