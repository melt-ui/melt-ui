<script lang="ts">
	import { createContextMenu, melt } from '$lib';
	import { writable } from 'svelte/store';
	import { ChevronRight, Check } from 'lucide-svelte';

	const settingsSync = writable(true);
	const hideMeltUI = writable(false);

	const {
		elements: { trigger, menu, item, separator },
		builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
	} = createContextMenu();

	const {
		elements: { subMenu: subMenuA, subTrigger: subTriggerA },
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

<span class="trigger" use:melt={$trigger} aria-label="Update dimensions">
	Right click me.
</span>

<div class="menu" use:melt={$menu}>
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
	<div class="item" use:melt={$subTriggerA}>
		Profiles
		<div class="rightSlot">
			<ChevronRight class="icon" />
		</div>
	</div>
	<div class="menu subMenu" use:melt={$subMenuA}>
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
	<div class="item" use:melt={$item} aria-disabled="true">
		Show All Components
		<div class="rightSlot">⇧⌘N</div>
	</div>
	<div use:melt={$separator} class="separator" />
	<div class="item" use:melt={$item}>
		Quit Melt UI
		<div class="rightSlot">⌘Q</div>
	</div>
</div>

<style>
	.menu {
		display: flex;
		flex-direction: column;

		max-height: 300px;
		min-width: 220px;

		padding: 0.25rem;

		border-radius: 0.375rem;

		z-index: 10;

		background-color: rgb(var(--color-white) / 1);

		box-shadow: 0 10px 15px -3px rgb(var(--color-neutral-900) / 0.3),
			0 4px 6px -4px rgb(var(--color-neutral-900) / 0.3);
	}

	@media screen and (min-width: 1024px) {
		.menu {
			max-height: none;
		}
	}

	.subMenu {
		min-width: 220px;

		box-shadow: 0 4px 6px -1px rgb(var(--color-neutral-900) / 0.3),
			0 2px 4px -2px rgb(var(--color-neutral-900) / 0.3);
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

		color: rgb(var(--color-magnum-900) / 1);

		outline: 2px solid transparent;
		outline-offset: 2px;

		box-shadow: none;
	}

	.item[data-highlighted] {
		background-color: rgb(var(--color-magnum-200) / 1);

		color: rgb(var(--color-magnum-900) / 1);
	}

	.item[data-disabled] {
		color: rgb(var(--color-neutral-300) / 1);
	}

	.trigger {
		display: block;
		width: 300px;
		padding: 3rem 0;

		border-color: rgb(var(--color-neutral-50) / 1);
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

		color: rgb(var(--color-magnum-500) / 1);
	}

	.dot {
		height: 4.75px;
		width: 4.75px;

		border-radius: 9999px;

		background-color: rgb(var(--color-magnum-900) / 1);
	}

	.separator {
		height: 1px;
		margin: 5px;

		background-color: rgb(var(--color-magnum-200) / 1);
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

		color: rgb(var(--color-neutral-600) / 1);
	}
</style>
