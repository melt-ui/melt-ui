<script lang="ts">
	import { createContextMenu } from '$lib';
	import { writable } from 'svelte/store';
	import ChevronRight from '~icons/lucide/chevron-right';
	import Check from '~icons/lucide/check';

	const {
		elements: { trigger, menu, item, checkboxItem, separator },
		builders: { createSubMenu, createMenuRadioGroup },
	} = createContextMenu();

	const {
		elements: { subMenu: subMenuA, subTrigger: subTriggerA },
	} = createSubMenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
	} = createMenuRadioGroup({
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

<span class="trigger" melt={$trigger} aria-label="Update dimensions">
	Right click me.
</span>

<div class="menu" melt={$menu}>
	<div class="item" melt={$item}>About Melt UI</div>
	<div class="item" melt={$item}>Check for Updates...</div>
	<div class="separator" melt={$separator} />
	<div
		class="item"
		{...$checkboxItem}
		use:$checkboxItem.action={{ checked: settingsSync }}
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
		use:$checkboxItem.action={{ checked: hideMeltUI }}
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
</div>

<style lang="postcss">
	.menu {
		display: flex;
		flex-direction: column;

		max-height: 300px;
		min-width: 220px;

		padding: 0.25rem;

		border-radius: 0.375rem;

		z-index: 10;

		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-color: rgb(23 23 23 / 0.3);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		--tw-shadow: var(--tw-shadow-colored);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
			var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0
			calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
			var(--tw-shadow, 0 0 #0000) !important;
	}

	@media screen and (min-width: 1024px) {
		.menu {
			max-height: none;
		}
	}

	.subMenu {
		min-width: 220px;

		--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		--tw-shadow-color: rgb(23 23 23 / 0.3);
		--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
			0 2px 4px -2px var(--tw-shadow-color);
		--tw-shadow: var(--tw-shadow-colored);

		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
			var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	}

	.item {
		display: flex;
		align-items: center;

		position: relative;

		height: 1.5rem;
		min-height: 1.5rem;

		padding-left: 1.5rem;
		padding-right: 0.25rem;

		font-size: 0.875rem;
		line-height: 1.25rem;
		line-height: 1;

		user-select: none;
		border-radius: 0.125rem;

		z-index: 20;

		--tw-text-opacity: 1;
		color: rgb(121 58 21 / var(--tw-text-opacity));

		outline: 2px solid transparent;
		outline-offset: 2px;

		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
			var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0
			calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
			var(--tw-shadow, 0 0 #0000);
	}

	.item[data-highlighted] {
		--tw-bg-opacity: 1;
		background-color: rgb(252 224 172 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(121 58 21 / var(--tw-text-opacity));
	}

	.item[data-disabled] {
		--tw-text-opacity: 1;
		color: rgb(212 212 212 / var(--tw-text-opacity));
	}

	.trigger {
		display: block;
		width: 300px;
		padding: 3rem 0;

		--tw-border-opacity: 1;
		border-color: rgb(250 250 250 / var(--tw-border-opacity));
		border-width: 2px;
		border-style: dashed;
		border-radius: 0.375rem;

		text-align: center;
	}

	.check {
		position: absolute;
		left: 0.5rem;
		top: 50%;

		translate: 0 calc(-50% + 1px);

		--tw-text-opacity: 1;
		color: rgb(243 141 28 / var(--tw-text-opacity));
	}

	.dot {
		height: 4.75px;
		width: 4.75px;

		border-radius: 9999px;

		--tw-bg-opacity: 1;
		background-color: rgb(121 58 21 / var(--tw-bg-opacity));
	}

	.separator {
		height: 1px;
		margin: 5px;

		--tw-bg-opacity: 1;
		background-color: rgb(252 224 172 / var(--tw-bg-opacity));
	}

	.rightSlot {
		margin-left: auto;
		padding-left: 1.25rem;
	}

	.icon {
		height: 13px;
		width: 13px;
	}

	.check {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		left: 0;

		width: 1.5rem;
	}

	.text {
		padding-left: 1.5rem;

		font-size: 0.75rem;
		line-height: 1.5rem;

		--tw-text-opacity: 1;
		color: rgb(82 82 82 / var(--tw-text-opacity));
	}
</style>
