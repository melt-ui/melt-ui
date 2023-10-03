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
					<Check class="square-4" />
				{/if}
			</div>
			Settings Sync is On
		</div>
		<div class="item" use:melt={$subTrigger}>
			Profiles
			<div class="rightSlot">
				<ChevronRight class="square-4" />
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
					<Check class="square-4" />
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

<style>
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
		--lh-sm: 1.25rem;
		--lh-md: 1.5rem;

		--ring-width: 1px;
		--ring-offset-width: 2px;
		--ring-color: var(--magnum-400);
		--ring-offset-color: #fff;
		--ring-offset-shadow: 0 0 0 var(--ring-offset-width)
			var(--ring-offset-color);
		--ring-shadow: 0 0 0 calc(var(--ring-width) + var(--ring-offset-width))
			var(--ring-color);
	}

	.trigger {
		height: 2.25rem;
		width: 2.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		background-color: white;

		color: var(--magnum-900);
		transition-property: color, background-color, border-color, outline-color,
			text-decoration-color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;

		font-weight: var(--fw-medium);
		font-size: var(--fs-sm);
		line-height: var(--lh-sm);
		padding: 0;
	}

	/* TODO: is the data-attribute present in the element? */
	.trigger[data-highlighted] {
		outline: none;
	}

	.trigger:hover {
		background-color: rbg(255 255 255 / 0.9);
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
	}

	.item[data-highlighted] {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.item:disabled {
		color: var(--neutral-300);
	}

	.check {
		position: absolute;
		left: 0;
		width: 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
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

	.text {
		padding-left: 1.5rem;
		font-size: var(--fs-xs);
		line-height: var(--lh-md);
		color: var(--neutral-600);
	}
</style>
