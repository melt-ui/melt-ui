<script lang="ts">
	import { createContextMenu } from '$lib';
	import { writable } from 'svelte/store';
	import ChevronRight from '~icons/lucide/chevron-right';
	import Check from '~icons/lucide/check';

	const { trigger, menu, item, checkboxItem, separator, createSubMenu, createMenuRadioGroup } =
		createContextMenu();

	const { subMenu: subMenuA, subTrigger: subTriggerA } = createSubMenu();

	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: 'Hunter Johnston',
	});

	const personsArr = ['Hunter Johnston', 'Thomas G. Lopes', 'Adrian Gonz', 'Franck Poingt'];

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);
</script>

<span class="trigger" {...$trigger} use:trigger.action aria-label="Update dimensions">
	Right click me.
</span>

<div class="menu" {...$menu} use:menu.action>
	<div class="item" {...item} use:item.action>About Melt UI</div>
	<div class="item" {...item} use:item.action>Check for Updates...</div>
	<div class="separator" {...separator} />
	<div class="item" {...checkboxItem} use:checkboxItem.action={{ checked: settingsSync }}>
		<div class="check">
			{#if $settingsSync}
				<Check class="icon" />
			{/if}
		</div>
		Settings Sync is On
	</div>
	<div class="item" {...$subTriggerA} use:subTriggerA.action>
		Profiles
		<div class="rightSlot">
			<ChevronRight class="icon" />
		</div>
	</div>
	<div class="menu subMenu" {...$subMenuA} use:subMenuA.action>
		<div class="text">People</div>
		<div {...radioGroup}>
			{#each personsArr as person}
				<div class="item" {...$radioItem({ value: person })} use:radioItem.action>
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
	<div {...separator} class="separator" />

	<div class="item" {...checkboxItem} use:checkboxItem.action={{ checked: hideMeltUI }}>
		<div class="check">
			{#if $hideMeltUI}
				<Check class="icon" />
			{/if}
		</div>
		Hide Melt UI
		<div class="rightSlot">⌘H</div>
	</div>
	<div class="item" {...item} use:item.action aria-disabled="true">
		Show All Components
		<div class="rightSlot">⇧⌘N</div>
	</div>
	<div {...separator} class="separator" />
	<div class="item" {...item} use:item.action>
		Quit Melt UI
		<div class="rightSlot">⌘Q</div>
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
		@apply block rounded-md border-2 border-dashed border-neutral-50;
		@apply w-[300px] py-12 text-center;
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
