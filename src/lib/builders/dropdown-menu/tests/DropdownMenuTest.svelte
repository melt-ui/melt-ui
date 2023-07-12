<script lang="ts">
	import { createDropdownMenu } from '..';
	import { writable } from 'svelte/store';

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

<button
	type="button"
	class="trigger"
	{...$trigger}
	use:trigger
	aria-label="Update dimensions"
	data-testid="trigger"
>
	AlignJustify
	<span class="sr-only">Open Popover</span>
</button>

<div class="menu" {...$menu} use:menu data-testid="menu">
	<div class="item" {...$item} use:item>About Melt UI</div>
	<div class="item" {...$item} use:item>Check for Updates...</div>
	<div class="separator" {...$separator} />
	<div class="item" {...$checkboxItem} use:checkboxItem={{ checked: settingsSync }}>
		<div class="check">
			{#if $settingsSync}
				Check
			{/if}
		</div>
		Settings Sync is On
	</div>
	<div class="item" {...$subTriggerA} use:subTriggerA>
		Profiles
		<div class="rightSlot">ChevronRight</div>
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
				Check
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
