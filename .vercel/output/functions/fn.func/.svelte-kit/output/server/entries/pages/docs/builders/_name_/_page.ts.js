import { e as error } from "../../../../../chunks/index.js";
import { s as slugFromPath, p as previewPathMatcher, a as createPreviewsObject, i as isMainPreviewComponent } from "../../../../../chunks/utils2.js";
const __vite_glob_1_0 = `<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="root" {...root}>
	{#each items as { id, title, description }, i}
		<div {...$item(id)} class="item">
			<h2>
				<button id={i === 0 ? 'trigger' : undefined} {...$trigger(id)} use:trigger class="trigger">
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div class="content" {...$content(id)} transition:slide>
					<div>{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.root {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: var(--tw-width-md);
		border-radius: var(--tw-border-radius-md);
		--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
		--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
			0 4px 6px -4px var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}

	.item {
		margin-top: var(--tw-size-px);
		overflow: hidden;
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.item:first-child {
		margin-top: var(--tw-size-0);
		border-top-left-radius: var(--tw-border-radius-default);
		border-top-right-radius: var(--tw-border-radius-default);
	}

	.item:last-child {
		border-bottom-right-radius: var(--tw-border-radius-default);
		border-bottom-left-radius: var(--tw-border-radius-default);
	}

	.item:focus-within {
		position: relative;
		z-index: 10;
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
			var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
			var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
		--tw-ring-opacity: 1;
		--tw-ring-color: rgb(var(--tw-color-magnum-400) / var(--tw-ring-opacity));
	}

	.item > h2 {
		display: flex;
	}

	.trigger {
		display: flex;
		height: var(--tw-size-12);
		flex: 1 1 0%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-white) / var(--tw-bg-opacity));
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		font-size: var(--tw-font-size-base);
		line-height: var(--tw-line-height-6);
		font-weight: var(--tw-font-weight-medium);
		line-height: var(--tw-line-height-none);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-magnum-700) / var(--tw-text-opacity));
		--tw-shadow: 0 1px 0;
		--tw-shadow-colored: 0 1px 0 var(--tw-shadow-color);
		box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
		transition-property: color, background-color, border-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
			-webkit-text-decoration-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.trigger:hover {
		--tw-bg-opacity: 0.95;
	}

	.content {
		overflow: hidden;
		--tw-bg-opacity: 1;
		background-color: rgb(var(--tw-color-neutral-100) / var(--tw-bg-opacity));
		font-size: var(--tw-font-size-sm);
		line-height: var(--tw-line-height-5);
		--tw-text-opacity: 1;
		color: rgb(var(--tw-color-neutral-900) / var(--tw-text-opacity));
	}

	.content > div {
		padding-left: var(--tw-size-5);
		padding-right: var(--tw-size-5);
		padding-top: var(--tw-size-4);
		padding-bottom: var(--tw-size-4);
	}
</style>
`;
const __vite_glob_1_1 = `<script lang="ts">
	import { createAccordion } from '@melt-ui/svelte';
	import { slide } from 'svelte/transition';

	const { content, item, trigger, isSelected, root } = createAccordion();

	const items = [
		{
			id: 'item-1',
			title: 'Is it accessible?',
			description: 'Yes. It adheres to the WAI-ARIA design pattern.',
		},
		{
			id: 'item-2',
			title: 'Is it unstyled?',
			description: "Yes. It's unstyled by default, giving you freedom over the look & feel.",
		},
		{
			id: 'item-3',
			title: 'Can it be animated?',
			description: 'Yes! You can use the transition prop to configure the animation.',
		},
	];
<\/script>

<div class="mx-auto w-full max-w-md rounded-md shadow-lg" {...root}>
	{#each items as { id, title, description }, i}
		<div
			{...$item(id)}
			class="mt-px overflow-hidden transition-colors first:mt-0 first:rounded-t
        last:rounded-b focus-within:relative focus-within:z-10
        focus-within:ring focus-within:ring-magnum-400"
		>
			<h2 class="flex">
				<button
					id={i === 0 ? 'trigger' : undefined}
					{...$trigger(id)}
					use:trigger
					class="flex h-12 flex-1 cursor-pointer items-center justify-between
            bg-white px-5 text-base font-medium leading-none text-magnum-700
            shadow-[0_1px_0] transition-colors hover:bg-opacity-95"
				>
					{title}
				</button>
			</h2>
			{#if $isSelected(id)}
				<div
					class="overflow-hidden bg-neutral-100 text-sm text-neutral-900"
					{...$content(id)}
					transition:slide
				>
					<div class="px-5 py-4">{description}</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
`;
const __vite_glob_1_2 = `<script lang="ts">
	import { createAvatar } from '@melt-ui/svelte';

	const { image, fallback } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/1162160?v=4',
	});

	// With an exaggerated fallback delay
	const { image: imageA, fallback: fallbackA } = createAvatar({
		src: 'https://avatars.githubusercontent.com/u/5968653?v=4',
		delayMs: 650,
	});

	// A blank source to demonstrate the fallback
	const { image: imageB, fallback: fallbackB } = createAvatar({
		src: '',
	});
<\/script>

<div class="flex w-full items-center justify-center gap-6">
	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallback} class="text-3xl font-medium text-magnum-700">RH</span>
	</div>

	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$imageA} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallbackA} class="text-3xl font-medium text-magnum-700">SH</span>
	</div>

	<div class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
		<img {...$imageB} alt="Avatar" class="h-full w-full rounded-[inherit]" />
		<span {...$fallbackB} class="text-3xl font-medium text-magnum-700">UI</span>
	</div>
</div>
`;
const __vite_glob_1_3 = `<script lang="ts">
	import { createCheckbox } from '$lib';
	import Check from '~icons/lucide/check';
	import Minus from '~icons/lucide/minus';

	const { root, input, isChecked, isIndeterminate } = createCheckbox({
		checked: 'indeterminate',
	});
<\/script>

<form>
	<div class="flex items-center justify-center">
		<button
			{...$root}
			use:root
			class="flex h-6 w-6 appearance-none items-center
            justify-center rounded-sm bg-white text-magnum-600 shadow-lg
            hover:opacity-75"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus />
			{:else if $isChecked}
				<Check />
			{/if}
			<input {...$input} />
		</button>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="checkbox">
			Accept terms and conditions.
		</label>
	</div>
</form>
`;
const __vite_glob_1_4 = `<script lang="ts">
	import { createCollapsible } from '$lib/builders/collapsible';
	import { slide } from 'svelte/transition';
	import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
	import X from '~icons/lucide/x';

	const { open, root, content, trigger } = createCollapsible();
<\/script>

<div {...$root} class="mx-auto w-full max-w-md">
	<div class="flex items-center justify-between">
		<span class="text-sm leading-6 text-white"> @thomasglopes starred 3 repositories </span>
		<button
			{...$trigger}
			use:trigger
			class="relative h-6 w-6 place-items-center rounded-full bg-white text-sm text-magnum-700
        shadow-lg hover:opacity-75
        data-[disabled]:cursor-not-allowed data-[disabled]:opacity-75"
		>
			<div class="abs-center">
				{#if $open}
					<X />
				{:else}
					<ChevronsUpDown />
				{/if}
			</div>
		</button>
	</div>

	<div class="my-2 rounded bg-white p-3 shadow-lg">
		<span class="text-base leading-[25px] text-magnum-800">melt-ui/melt-ui</span>
	</div>

	{#if $open}
		<div {...$content} transition:slide>
			<div class="flex flex-col gap-2">
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/svelte</span>
				</div>
				<div class="rounded bg-white p-3 shadow-lg">
					<span class="text-base leading-[25px] text-magnum-800">sveltejs/kit</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.abs-center {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
`;
const __vite_glob_1_5 = `<script lang="ts">
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
<\/script>

<div class="flex w-full items-center justify-center">
	<span class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
		Right click me.
	</span>

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
`;
const __vite_glob_1_6 = `<script lang="ts">
	import { createDialog } from '$lib/builders/dialog';
	import { fade, fly } from 'svelte/transition';
	// Internal helpers
	import X from '~icons/lucide/x';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
<\/script>

<div>
	<button
		{...$trigger}
		use:trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
			font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
			focus:outline-none focus:ring focus:ring-magnum-400"
	>
		Open Drawer
	</button>
	<div use:portal>
		{#if $open}
			<div
				{...$overlay}
				class="fixed inset-0 z-20 bg-black/50"
				transition:fade={{ duration: 150 }}
			/>
			<div
				{...$content}
				use:content
				class="fixed left-0 top-0 z-50 h-screen w-full max-w-[350px] bg-white p-[25px] shadow-lg
				focus:outline-none"
				transition:fly={{ x: -350, duration: 300, opacity: 1 }}
			>
				<button
					{...$close}
					use:close
					class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
				text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 focus:outline-none focus:ring-2 focus:ring-magnum-400"
				>
					<X />
				</button>
				<h2 {...$title} class="mb-0 text-lg font-medium text-black">Notifications</h2>
				<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
					Check out your latest updates.
				</p>
				<section>
					<div class="rounded-md bg-gray-100/80 p-4 text-zinc-800 shadow">
						<h3 class="mb-3 text-base font-semibold">New invitation</h3>
						<p class="text-sm">
							You have been invited to join the <strong>Designers</strong> team.
						</p>
						<div class="mt-[25px] flex justify-end gap-4">
							<button
								class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
            px-4 font-medium leading-none text-zinc-600 focus:outline-none focus:ring-2 focus:ring-magnum-400"
							>
								Reject
							</button>
							<button
								class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100
            px-4 font-medium leading-none text-magnum-900 focus:outline-none focus:ring-2 focus:ring-magnum-400"
							>
								Accept
							</button>
						</div>
					</div>
				</section>
			</div>
		{/if}
	</div>
</div>
`;
const __vite_glob_1_7 = `<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	/** Internal helpers */
	import { flyAndScale } from '$routes/helpers';
	import X from '~icons/lucide/x';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
<\/script>

<div class="flex w-full items-center justify-center">
	<button
		{...$trigger}
		use:trigger
		class="inline-flex items-center justify-center rounded-md bg-white px-4 py-2
			font-medium leading-none text-magnum-700 shadow-lg hover:opacity-75
			"
	>
		Open Dialog
	</button>
	<div use:portal>
		{#if $open}
			<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
			<div
				class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
				translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-[25px]
				shadow-lg"
				transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
				{...$content}
				use:content
			>
				<h2 {...$title} class="m-0 text-lg font-medium text-black">Edit profile</h2>
				<p {...$description} class="mb-5 mt-[10px] leading-normal text-zinc-600">
					Make changes to your profile here. Click save when you're done.
				</p>

				<fieldset class="mb-4 flex items-center gap-5">
					<label class="w-[90px] text-right text-magnum-800" for="name"> Name </label>
					<input
						class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
						id="name"
						value="Thomas G. Lopes"
					/>
				</fieldset>
				<fieldset class="mb-4 flex items-center gap-5">
					<label class="w-[90px] text-right text-magnum-800" for="username"> Username </label>
					<input
						class="inline-flex h-8 w-full flex-1 items-center justify-center rounded-sm border
						border-solid px-3 leading-none text-magnum-800"
						id="username"
						value="@thomasglopes"
					/>
				</fieldset>
				<div class="mt-[25px] flex justify-end gap-4">
					<button
						{...$close}
						use:close
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-zinc-100
					px-4 font-medium leading-none text-zinc-600"
					>
						Cancel
					</button>
					<button
						{...$close}
						use:close
						class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-magnum-100
					px-4 font-medium leading-none text-magnum-900"
					>
						Save changes
					</button>
				</div>

				<button
					{...$close}
					use:close
					class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full
				text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400"
				>
					<X />
				</button>
			</div>
		{/if}
	</div>
</div>
`;
const __vite_glob_1_8 = `<script lang="ts">
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
<\/script>

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
`;
const __vite_glob_1_9 = `<script lang="ts">
	import { createHoverCard } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	const { trigger, content, open, arrow } = createHoverCard();
<\/script>

<div class="flex w-full items-center justify-center">
	<a
		class="trigger"
		href="https://github.com/melt-ui/melt-ui"
		target="_blank"
		rel="noreferrer"
		{...$trigger}
		use:trigger
	>
		<img
			src="/logo-mark.svg"
			alt="Melt UI Logo"
			class="h-full w-full rounded-full bg-neutral-900 object-contain p-2"
		/>
		<span class="sr-only">Open Melt UI Details</span>
	</a>

	{#if $open}
		<div
			{...$content}
			use:content
			transition:fade={{ duration: 100 }}
			class="z-10 rounded-md bg-white shadow-sm"
		>
			<div class="w-[300px] rounded-md bg-white p-5 shadow-sm">
				<div class="flex flex-col gap-2">
					<img
						src="/logo-mark.svg"
						alt="Melt UI Logo"
						class="object-fit block h-14 w-14 rounded-full bg-neutral-900 p-2"
					/>
					<div class="flex flex-col gap-4">
						<div>
							<div class="font-bold text-neutral-900">Melt UI</div>
							<div class="text-neutral-400">melt-ui/melt-ui</div>
						</div>
					</div>
					<div class="m-0 text-neutral-700">
						A set of accessible, unstyled component builders for Svelte & SvelteKit. Open source.
					</div>
					<div class="flex gap-4">
						<div class="flex gap-1">
							<div class="text-neutral-900">250</div>
							<div class="text-neutral-400">Stars</div>
						</div>
						<div class="flex gap-1">
							<div class="text-neutral-900">23</div>
							<div class="text-neutral-400">Forks</div>
						</div>
					</div>
				</div>
			</div>
			<div {...$arrow} />
		</div>
	{/if}
</div>

<style lang="postcss">
	.trigger {
		@apply flex h-12 w-12 items-center justify-center;
		@apply rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
`;
const __vite_glob_1_10 = `<script lang="ts">
	import { createLabel } from '$lib';

	const { root } = createLabel();
<\/script>

<form class="flex w-full items-center justify-center">
	<div class="flex flex-col items-start justify-center">
		<label use:root.action for="email" class="mb-0.5 font-medium" data-melt-part="root">
			<span>Email</span>
		</label>
		<input
			type="text"
			id="email"
			class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			placeholder="vanilla@melt-ui.com"
		/>
	</div>
</form>
`;
const __vite_glob_1_11 = `<script lang="ts">
	import { createMenubar } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import ChevronRight from '~icons/lucide/chevron-right';
	import Check from '~icons/lucide/check';

	const { menubar, createMenu } = createMenubar();

	const { trigger, menu, item, separator, createSubmenu, createMenuRadioGroup } = createMenu();
	const { subMenu, subTrigger } = createSubmenu();
	const { radioGroup, radioItem, isChecked } = createMenuRadioGroup({
		value: 'Nord',
	});

	const { trigger: triggerA, menu: menuA, item: itemA, separator: separatorA } = createMenu();

	const {
		trigger: triggerB,
		menu: menuB,
		item: itemB,
		checkboxItem: checkboxItemB,
		separator: separatorB,
		createSubmenu: createSubmenuB,
	} = createMenu();
	const { subMenu: subMenuB, subTrigger: subTriggerB } = createSubmenuB();

	const {
		trigger: triggerC,
		menu: menuC,
		item: itemC,
		checkboxItem: checkboxItemC,
		separator: separatorC,
	} = createMenu();

	const themesArr = ['Nord', 'GitHub Dark', 'Moonlight'];

	const tipsAndTricks = writable(true);
	const hideMeltUI = writable(false);
	const wordWrap = writable(true);
	const stickyScroll = writable(false);
<\/script>

<div class="flex w-full items-center justify-center">
	<div class="flex rounded-md bg-white p-1 shadow-md" {...$menubar} use:menubar>
		<!------------>
		<!--- FILE --->
		<!------------>
		<button type="button" class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
			File
		</button>

		<div class="menu" {...$menu} use:menu>
			<div class="item" {...$item} use:item>New Text File</div>
			<div class="item" {...$item} use:item>
				New File...
				<div class="rightSlot">⌘T</div>
			</div>
			<div class="item" {...$item} use:item aria-disabled="true">
				New Window...
				<div class="rightSlot">⇧⌘T</div>
			</div>
			<div class="separator" {...$separator} />
			<div class="item" {...$subTrigger} use:subTrigger>
				Select theme
				<div class="rightSlot">
					<ChevronRight class="icon" />
				</div>
			</div>
			<div class="menu subMenu" {...$subMenu} use:subMenu>
				<div {...$radioGroup}>
					{#each themesArr as theme}
						<div class="item" {...$radioItem({ value: theme })} use:radioItem>
							<div class="check">
								{#if $isChecked(theme)}
									<div class="dot" />
								{/if}
							</div>
							{theme}
						</div>
					{/each}
				</div>
			</div>
			<div {...$separator} class="separator" />
			<div class="item" {...$item} use:item>
				Quit Melt UI
				<div class="rightSlot">⌘Q</div>
			</div>
		</div>

		<!------------>
		<!--- EDIT --->
		<!------------>
		<button
			type="button"
			class="trigger"
			{...$triggerA}
			use:triggerA
			aria-label="Update dimensions"
		>
			Edit
		</button>

		<div class="menu" {...$menuA} use:menuA>
			<div class="item" {...$itemA} use:itemA>
				Undo
				<div class="rightSlot">⌘Z</div>
			</div>
			<div class="item" {...$itemA} use:itemA>
				Redo
				<div class="rightSlot">⇧⌘Z</div>
			</div>
			<div class="separator" {...$separatorA} />
			<div class="item" {...$itemA} use:itemA>
				Cut
				<div class="rightSlot">⌘X</div>
			</div>
			<div class="item" {...$itemA} use:itemA>
				Copy
				<div class="rightSlot">⌘C</div>
			</div>
			<div class="item" {...$itemA} use:itemA>
				Paste
				<div class="rightSlot">⌘V</div>
			</div>

			<div {...$separatorA} class="separator" />

			<div class="item" {...$itemA} use:itemA>
				Find
				<div class="rightSlot">⌘F</div>
			</div>
			<div class="item" {...$itemA} use:itemA>
				Replace
				<div class="rightSlot">⌥⌘F</div>
			</div>
		</div>

		<!------------>
		<!--- VIEW --->
		<!------------>
		<button
			type="button"
			class="trigger"
			{...$triggerB}
			use:triggerB
			aria-label="Update dimensions"
		>
			View
		</button>

		<div class="menu" {...$menuB} use:menuB>
			<div class="item" {...$itemB} use:itemB>
				Command Palette..
				<div class="rightSlot">⇧⌘P</div>
			</div>
			<div class="item" {...$itemB} use:itemB>Open View...</div>
			<div class="separator" {...$separatorB} />
			<div class="item" {...$subTriggerB} use:subTriggerB>
				Appearance
				<div class="rightSlot">
					<ChevronRight class="icon" />
				</div>
			</div>
			<div class="menu subMenu" {...$subMenuB} use:subMenuB>
				<div {...$radioGroup}>
					<div class="item" {...$itemB} use:itemB>Full Screen</div>
					<div class="item" {...$itemB} use:itemB>Zen Mode</div>
				</div>
			</div>
			<div class="separator" {...$separatorB} />

			<div class="item" {...$checkboxItemB} use:checkboxItemB={{ checked: wordWrap }}>
				<div class="check">
					{#if $wordWrap}
						<Check class="icon" />
					{/if}
				</div>
				Word Wrap
				<div class="rightSlot">⌘H</div>
			</div>
			<div class="item" {...$checkboxItemB} use:checkboxItemB={{ checked: stickyScroll }}>
				<div class="check">
					{#if $stickyScroll}
						<Check class="icon" />
					{/if}
				</div>
				Sticky Scroll
			</div>
		</div>

		<!------------>
		<!--- HELP --->
		<!------------>
		<button
			type="button"
			class="trigger"
			{...$triggerC}
			use:triggerC
			aria-label="Update dimensions"
		>
			Help
		</button>

		<div class="menu" {...$menuC} use:menuC>
			<div class="item" {...$itemC} use:itemC>About Melt UI</div>
			<div class="item" {...$itemC} use:itemC>Check for Updates...</div>
			<div class="separator" {...$separatorC} />
			<div class="item" {...$checkboxItemC} use:checkboxItemC={{ checked: tipsAndTricks }}>
				<div class="check">
					{#if $tipsAndTricks}
						<Check class="icon" />
					{/if}
				</div>
				Tips & Tricks
			</div>

			<div {...$separatorC} class="separator" />

			<div class="item" {...$checkboxItemC} use:checkboxItemC={{ checked: hideMeltUI }}>
				<div class="check">
					{#if $hideMeltUI}
						<Check class="icon" />
					{/if}
				</div>
				Documentation
			</div>
			<div class="item" {...$itemC} use:itemC aria-disabled="true">
				Show All Components
				<div class="rightSlot">⇧⌘N</div>
			</div>
			<div {...$separatorC} class="separator" />
			<div class="item" {...$itemC} use:itemC>Report a bug...</div>
		</div>
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
		@apply inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium leading-none;
		@apply text-magnum-900 transition-colors hover:bg-white/90 data-[highlighted]:outline-none;
		@apply overflow-visible data-[highlighted]:bg-magnum-200 data-[highlighted]:ring-magnum-400 !important;
		@apply focus:z-30 focus:ring;
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
`;
const __vite_glob_1_12 = `<script lang="ts">
	import { createPagination } from '@melt-ui/svelte';
	import ChevronLeft from '~icons/lucide/chevron-left';
	import ChevronRight from '~icons/lucide/chevron-right';

	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
		siblingCount: 1,
	});
<\/script>

<div class="flex w-full items-center justify-center">
	<nav class="flex flex-col items-center gap-4" aria-label="pagination" {...root}>
		<p class="text-center">Showing items {$range.start} - {$range.end}</p>
		<div class="flex items-center gap-2">
			<button {...$prevButton} use:prevButton.action><ChevronLeft /></button>
			{#each $pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<span>...</span>
				{:else}
					<button {...$pageTrigger(page)} use:pageTrigger.action>{page.value}</button>
				{/if}
			{/each}
			<button {...$nextButton} use:nextButton.action><ChevronRight /></button>
		</div>
	</nav>
</div>

<style lang="postcss">
	button {
		display: grid;
		place-items: center;
		border-radius: theme('borderRadius.sm');
		background-color: theme('colors.white');
		color: theme('colors.magnum.700');
		box-shadow: theme('boxShadow.sm');

		font-size: theme('fontSize.sm');

		padding-inline: theme('spacing.3');
		height: theme('spacing.8');

		&:hover {
			opacity: 0.75;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&[data-selected] {
			background-color: theme('colors.magnum.900');
			color: theme('colors.white');
		}
	}
</style>
`;
const __vite_glob_1_13 = `<script lang="ts">
	import { createPopover } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Settings2 from '~icons/lucide/settings2';
	import X from '~icons/lucide/x';

	const { trigger, content, open, arrow, close } = createPopover();
<\/script>

<div class="flex items-center justify-center">
	<button
		type="button"
		class="trigger"
		{...$trigger}
		use:trigger.action
		aria-label="Update dimensions"
	>
		<Settings2 class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	{#if $open}
		<div {...$content} use:content.action transition:fade={{ duration: 100 }} class="content">
			<div {...$arrow} />
			<div class="flex flex-col gap-2.5">
				<p>Dimensions</p>
				<fieldset>
					<label for="width"> Width </label>
					<input id="width" value="100%" class="input" />
				</fieldset>
				<fieldset>
					<label for="maxWidth"> Max. width </label>
					<input id="maxWidth" value="300px" class="input" />
				</fieldset>
				<fieldset>
					<label for="height"> Height </label>
					<input id="height" value="25px" class="input" />
				</fieldset>
				<fieldset>
					<label for="maxHeight"> Max. height </label>
					<input id="maxHeight" class="input" />
				</fieldset>
			</div>
			<button class="close" {...close} use:close.action>
				<X class="h-4 w-4 " />
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	fieldset {
		@apply flex items-center gap-5;
	}

	label {
		@apply w-[75px] text-sm text-neutral-700;
	}

	p {
		@apply mb-2 font-medium text-neutral-900;
	}

	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}
</style>
`;
const __vite_glob_1_14 = '<script lang="ts">\n	import { createProgress } from \'@melt-ui/svelte\';\n\n	const { progress, value, max } = createProgress({\n		value: 30,\n		max: 100,\n	});\n\n	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));\n	sleep(1000).then(() => {\n		value.set(75);\n	});\n<\/script>\n\n<div class="flex items-center justify-center">\n	<div {...$progress} class="relative h-6 w-[300px] overflow-hidden rounded-[99999px] bg-black/40">\n		<div\n			class="h-full w-full bg-[white] transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]"\n			style={`transform: translateX(-${100 - (100 * ($value ?? 0)) / ($max ?? 1)}%)`}\n		/>\n	</div>\n</div>\n';
const __vite_glob_1_15 = `<script lang="ts">
	import { createRadioGroup } from '@melt-ui/svelte';

	const { root, item, isChecked } = createRadioGroup({
		value: 'default',
	});

	const optionsArr = ['default', 'comfortable', 'compact'];
<\/script>

<div class="flex items-center justify-center">
	<div
		{...$root}
		class="flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
		aria-label="View density"
	>
		{#each optionsArr as option}
			<div class="flex items-center gap-3">
				<button
					{...$item(option)}
					use:item.action
					class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm
        hover:bg-magnum-100"
					id={option}
					aria-labelledby="{option}-label"
				>
					{#if $isChecked(option)}
						<div class="h-3 w-3 rounded-full bg-magnum-500" />
					{/if}
				</button>
				<label class="capitalize leading-none text-white" for={option} id="{option}-label">
					{option}
				</label>
			</div>
		{/each}
	</div>
</div>
`;
const __vite_glob_1_16 = `<script lang="ts">
	import { createSelect } from '@melt-ui/svelte';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	const { label, trigger, menu, option, isSelected, createGroup } = createSelect();

	const options = {
		sweet: ['Caramel', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
		savory: ['Basil', 'Bacon', 'Rosemary', 'Balsamic Fig'],
	};
<\/script>

<div class="flex w-full items-center justify-center">
	<button class="trigger" {...$trigger} use:trigger.action aria-label="Food">
		{$label || 'Select an option'}
		<ChevronDown />
	</button>

	<div class="menu" {...$menu} use:menu.action>
		{#each Object.entries(options) as [key, arr]}
			{@const { group, label } = createGroup()}
			<div {...group}>
				<div class="label" {...label}>{key}</div>
				{#each arr as item}
					<div class="option" {...$option({ value: item, label: item })} use:option.action>
						{#if $isSelected(item)}
							<div class="check">
								<Check />
							</div>
						{/if}
						{item}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4  font-semibold capitalize text-neutral-800;
	}

	.menu {
		@apply z-10 flex max-h-[360px]  flex-col overflow-y-auto;
		@apply rounded-md bg-white p-1;
		@apply ring-0 !important;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:z-10 focus:text-magnum-700;
		@apply data-[highlighted]:bg-magnum-50 data-[highlighted]:text-magnum-900;
		@apply data-[selected]:bg-magnum-100 data-[selected]:text-magnum-900;
	}
	.trigger {
		@apply flex h-10 min-w-[220px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700 transition-opacity hover:opacity-90;
	}
	.check {
		@apply absolute left-2 top-1/2 z-20 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
`;
const __vite_glob_1_17 = `<script lang="ts">
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';

	const { root: vertical } = createSeparator({
		orientation,
	});

	const { root: horizontalSeparator } = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
<\/script>

<h2>Melt UI</h2>
<p>Flavors for everyone</p>
<div {...$horizontalSeparator} class="separator separator--horizontal" />
<div class="ice-creams">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div {...$vertical} class="separator separator--vertical" />
		{/if}
	{/each}
</div>

<style lang="postcss">
	h2 {
		font-weight: var(--tw-font-weight-bold);
	}

	.ice-creams {
		display: flex;
		align-items: center;
		column-gap: var(--tw-size-3_5);
	}

	.separator {
		--tw-bg-opacity: 1;

		background-color: rgb(255 255 255 / var(--tw-bg-opacity));
	}

	.separator--horizontal {
		margin-top: var(--tw-size-3_5);
		margin-bottom: var(--tw-size-3_5);
		height: 1px;
		width: 100%;
	}

	.separator--vertical {
		height: var(--tw-size-4);
		width: 1px;
	}
</style>
`;
const __vite_glob_1_18 = `<script lang="ts">
	import { createSeparator, type CreateSeparatorArgs } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorArgs['orientation'] = 'vertical';

	const { root: vertical } = createSeparator({
		orientation,
	});

	const { root: horizontalSeparator } = createSeparator({
		orientation: 'horizontal',
		decorative: true,
	});

	const icecreams = ['Caramel', 'Vanilla', 'Napolitan'];
<\/script>

<h2 class="font-bold">Melt UI</h2>
<p>Flavors for everyone</p>
<div {...$horizontalSeparator} class="my-3.5 h-[1px] w-full bg-white" />
<div class="flex items-center space-x-3.5">
	{#each icecreams as icecream, i}
		<p>{icecream}</p>
		{#if i !== icecreams.length - 1}
			<div {...$vertical} class="h-4 w-[1px] bg-white" />
		{/if}
	{/each}
</div>
`;
const __vite_glob_1_19 = `<script lang="ts">
	import { createSlider } from '@melt-ui/svelte';

	const { slider, range, thumb, value } = createSlider({
		value: [30],
		max: 100,
	});
<\/script>

<div class="flex w-full items-center justify-center">
	<span {...$slider} class="relative flex h-[20px] w-[200px] items-center">
		<span class="block h-[3px] w-full bg-black/40">
			<span {...$range} class="h-[3px] bg-white" />
		</span>

		{#each { length: $value.length } as _}
			<span
				{...$thumb()}
				use:thumb.action
				class="block h-5 w-5 rounded-full bg-white focus:ring-4 focus:ring-black/40"
			/>
		{/each}
	</span>
</div>
`;
const __vite_glob_1_20 = `<script lang="ts">
	import { createSwitch } from '@melt-ui/svelte';

	const { root, input, isChecked } = createSwitch();
<\/script>

<form class="flex w-full items-center justify-center">
	<div class="flex items-center">
		<label class="pr-4 leading-none text-white" for="airplane-mode"> Airplane mode </label>
		<button
			{...$root}
			use:root.action
			class="relative h-6 w-11 cursor-default rounded-full bg-magnum-800 transition-colors data-[state=checked]:bg-magnum-950"
			id="airplane-mode"
		>
			<span
				class="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform
                {$isChecked && 'translate-x-[22px]'}"
			/>
			<input {...$input} />
		</button>
	</div>
</form>
`;
const __vite_glob_1_21 = `<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';

	const { root, list, content, trigger } = createTabs({ value: 'tab1' });
<\/script>

<div class="flex items-center justify-center">
	<div {...$root} class="root">
		<div {...$list} class="list" aria-label="Manage your account">
			<button {...$trigger('tab1')} use:$trigger.action class="trigger">Account</button>
			<button {...$trigger('tab2')} use:$trigger.action class="trigger">Password</button>
			<!-- You don't need to set disabled on the action when using a button element, since
                $trigger will set the 'disabled' attribute on the button -->
			<button
				use:$trigger.action
				{...$trigger({ value: 'tab3', disabled: true })}
				class="trigger opacity-50">Disabled</button
			>
			<button {...$trigger('tab4')} use:$trigger.action class="trigger">Settings</button>
		</div>
		<div {...$content('tab1')} class="content">
			<p class="description">Make changes to your account here. Click save when you're done.</p>
			<fieldset>
				<label for="name"> Name </label>
				<input id="name" value="Thomas G. Lopes" />
			</fieldset>

			<div class="actions">
				<button>Save changes</button>
			</div>
		</div>
		<div {...$content('tab2')} class="content">
			<p class="description">Change your password here. Click save when you're done.</p>
			<fieldset>
				<label for="new"> New password </label>
				<input id="new" type="password" />
			</fieldset>
			<div class="actions">
				<button>Save changes</button>
			</div>
		</div>
		<div {...$content('tab4')} class="content">
			<p class="description">Change your settings here. Click save when you're done.</p>

			<fieldset>
				<label for="new"> New email </label>
				<input id="new" type="password" />
			</fieldset>
			<div class="actions">
				<button>Save changes</button>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	/* Tab Parts */
	.root {
		@apply flex flex-col overflow-hidden rounded-md shadow-lg data-[orientation=vertical]:flex-row;
	}

	.list {
		@apply flex shrink-0 border-b border-magnum-100 bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r;
		overflow-x: auto;
	}

	.trigger {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center rounded-none bg-white px-4 leading-none text-magnum-900
			 focus:relative;
	}

	.trigger[data-orientation='vertical'] {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent border-b-magnum-100 py-4  last:border-b-0;
	}

	.trigger[data-state='active'] {
		@apply text-magnum-700 focus:relative;
	}

	.trigger[data-state='active'][data-orientation='horizontal'] {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative;
	}

	.trigger[data-state='active'][data-orientation='vertical'] {
		@apply border-r-magnum-500;
	}

	.content {
		@apply grow bg-white p-5;
	}

	/* Content Elements */
	.description {
		@apply mb-5 leading-normal text-magnum-950;
	}

	fieldset {
		@apply mb-4 flex w-full flex-col justify-start;
	}

	label {
		@apply mb-2.5 block text-sm leading-none text-magnum-950;
	}

	input {
		@apply h-8 shrink-0 grow rounded border px-2.5 leading-none text-magnum-900  focus:ring focus:ring-magnum-800;
	}

	.actions {
		@apply mt-5 flex justify-end;
	}

	button {
		@apply inline-flex h-8 cursor-default items-center justify-center rounded bg-green-100 px-[15px] font-medium leading-none text-green-900;
	}
</style>
`;
const __vite_glob_1_22 = `<script lang="ts">
	import { createTagsInput } from '@melt-ui/svelte';
	import X from '~icons/lucide/x';

	const { root, input, tags, tag, deleteTrigger } = createTagsInput({
		tags: ['one', 'two'],
	});
<\/script>

<div class="flex flex-col items-center justify-center gap-2 overflow-hidden">
	<div
		{...$root}
		use:root
		class="flex w-[280px] flex-row flex-wrap gap-2.5 rounded-md bg-white px-3 py-2 text-magnum-700"
	>
		{#each $tags as t}
			<div {...$tag(t)} class="tag">
				<span class="flex items-center border-r border-white/10 px-1.5">{t.value}</span>

				<button {...$deleteTrigger(t)} use:deleteTrigger class="tag-delete">
					<X class="h-3 w-3" />
				</button>
			</div>
		{/each}

		<input
			{...$input}
			use:input
			type="text"
			class="shake min-w-[4.5rem] shrink grow basis-0 border-0 outline-none focus:!ring-0"
		/>
	</div>
</div>

<style lang="postcss">
	.tag {
		@apply flex items-center overflow-hidden rounded-md [word-break:break-word];
		@apply bg-magnum-600 text-white;
		@apply data-[selected]:bg-teal-500;
		@apply data-[disabled]:bg-magnum-300 data-[disabled]:hover:cursor-default data-[disabled]:focus:!outline-none data-[disabled]:focus:!ring-0;
	}

	.tag-delete {
		@apply flex h-full items-center px-1;
		@apply enabled:hover:bg-magnum-700;
		@apply data-[selected]:hover:bg-teal-600;
	}
</style>
`;
const __vite_glob_1_23 = `<script lang="ts">
	import { createToggleGroup } from '@melt-ui/svelte';
	import AlignCenter from '~icons/lucide/align-center';
	import AlignLeft from '~icons/lucide/align-left';
	import AlignRight from '~icons/lucide/align-right';

	const { root, item } = createToggleGroup();
<\/script>

<div class="flex w-full items-center justify-center">
	<div
		{...$root}
		class="flex items-center data-[orientation='vertical']:flex-col"
		aria-label="Text alignment"
	>
		<button class="toggle-item" {...$item('left')} use:item.action aria-label="Left aligned">
			<AlignLeft />
		</button>
		<button class="toggle-item" {...$item('center')} use:item.action aria-label="Center aligned">
			<AlignCenter />
		</button>
		<button class="toggle-item" {...$item('right')} use:item.action aria-label="Right aligned">
			<AlignRight />
		</button>
	</div>
</div>

<style lang="postcss">
	.toggle-item {
		display: grid;
		place-items: center;
		align-items: center;

		background-color: theme('colors.white');
		color: theme('colors.magnum.800');
		font-size: theme('fontSize.base');
		line-height: theme('lineHeight.4');
		outline: none;

		height: theme('height.9');
		width: theme('width.9');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&:focus {
			z-index: 10;
		}
	}

	.toggle-item[data-disabled] {
		@apply cursor-not-allowed;
	}

	.toggle-item[data-orientation='horizontal'] {
		@apply border-x border-l-transparent border-r-magnum-200;

		&:first-child {
			@apply rounded-l;
		}

		&:last-child {
			@apply rounded-r border-r-transparent;
		}
	}

	.toggle-item[data-orientation='horizontal']:dir(rtl) {
		@apply border-x border-l-magnum-200 border-r-transparent;

		&:first-child {
			@apply rounded-r;
		}

		&:last-child {
			@apply rounded-l border-l-transparent;
		}
	}

	.toggle-item[data-orientation='vertical'] {
		@apply border-y border-b-magnum-200 border-t-transparent;

		&:first-child {
			@apply rounded-t;
		}

		&:last-child {
			@apply rounded-b border-b-transparent;
		}
	}

	.toggle-item[data-state='on'] {
		@apply bg-magnum-200 text-magnum-900;
	}
</style>
`;
const __vite_glob_1_24 = `<script lang="ts">
	import { createToggle } from '@melt-ui/svelte';
	import Italic from '~icons/lucide/italic';

	const { toggle } = createToggle();
<\/script>

<div class="flex w-full items-center justify-center">
	<button
		{...$toggle}
		use:toggle.action
		aria-label="Toggle italic"
		class="grid h-9 w-9 place-items-center items-center justify-center rounded
	bg-white text-base leading-4 text-magnum-800 shadow-lg hover:bg-magnum-100 data-[disabled]:cursor-not-allowed data-[state=on]:bg-magnum-200
	data-[state=on]:text-magnum-900"
	>
		<Italic />
	</button>
</div>
`;
const __vite_glob_1_25 = `<script lang="ts">
	import { createToolbar } from '@melt-ui/svelte';

	import Bold from '~icons/lucide/bold';
	import Italic from '~icons/lucide/italic';
	import Strikethrough from '~icons/lucide/strikethrough';
	import AlignLeft from '~icons/lucide/align-left';
	import AlignCenter from '~icons/lucide/align-center';
	import AlignRight from '~icons/lucide/align-right';

	const { root, button, link, separator, createToolbarGroup } = createToolbar();
	const { root: fontGroup, item: fontItem } = createToolbarGroup({
		type: 'multiple',
	});
	const { root: alignGroup, item: alignItem } = createToolbarGroup();
<\/script>

<div
	{...$root}
	class="flex min-w-max items-center gap-4 rounded-md bg-white px-3 py-3 text-neutral-700 shadow-sm"
>
	<div class="group" {...$fontGroup}>
		<button class="item" {...$fontItem('bold')} use:fontItem.action>
			<Bold />
		</button>
		<button class="item" {...$fontItem('italic')} use:fontItem.action>
			<Italic />
		</button>
		<button class="item" {...$fontItem('strikethrough')} use:fontItem.action>
			<Strikethrough />
		</button>
	</div>
	<div class="separator" {...$separator} />
	<div class="group" {...$alignGroup}>
		<button class="item" {...$alignItem('left')} use:alignItem.action>
			<AlignLeft />
		</button>
		<button class="item" {...$alignItem('center')} use:alignItem.action>
			<AlignCenter />
		</button>
		<button class="item" {...$alignItem('right')} use:alignItem.action>
			<AlignRight />
		</button>
	</div>
	<div class="separator" {...$separator} />
	<!-- svelte-ignore a11y-invalid-attribute -->
	<a href="#" class="link nowrap flex-shrink-0" {...link} use:link.action> Edited 2 hours ago </a>
	<button class="button" {...button} use:button.action>Save</button>
</div>

<style lang="postcss">
	.group {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.item {
		padding: theme('spacing.1');
		border-radius: theme('borderRadius.md');

		&:hover {
			background-color: theme('colors.magnum.100');
		}

		&[data-state='on'] {
			background-color: theme('colors.magnum.200');
			color: theme('colors.magnum.900');
		}
	}

	.separator {
		width: 1px;
		background-color: theme('colors.neutral.300');
		align-self: stretch;
	}

	.button {
		background-color: theme('colors.magnum.600');
		color: theme('colors.magnum.100');
		padding: theme('spacing.1') theme('spacing.3');
		border-radius: theme('borderRadius.md');
		font-weight: theme('fontWeight.medium');
		margin-inline-start: auto;

		&:hover {
			opacity: theme('opacity.75');
		}

		&:active {
			opacity: theme('opacity.50');
		}
	}
</style>
`;
const __vite_glob_1_26 = `<script lang="ts">
	import { createTooltip } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import Plus from '~icons/lucide/plus';

	const { trigger, content, open, arrow } = createTooltip({
		positioning: {
			placement: 'top',
		},
		openDelay: 500,
		closeDelay: 250,
	});
<\/script>

<div class="flex w-full items-center justify-center">
	<button
		type="button"
		class="trigger"
		{...$trigger}
		use:trigger.action
		aria-label="Update dimensions"
	>
		<Plus class="h-4 w-4" />
		<span class="sr-only">Open Popover</span>
	</button>

	{#if $open}
		<div
			{...$content}
			use:content.action
			transition:fade={{ duration: 100 }}
			class="z-10 rounded-md bg-white shadow-sm"
		>
			<div {...$arrow} />
			<p class="px-4 py-1 text-magnum-700">Add to library</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
`;
const builder$m = {
  title: "createAccordion",
  description: "The configuration object passed to the `createAccordion` builder function.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["string", "string[]", "undefined"]
    }
  ]
};
const root$8 = {
  title: "root",
  description: "Contains all the parts of an accordion.",
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    }
  ]
};
const item$4 = {
  title: "item",
  description: "Contains all the parts of a collapsible section.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    }
  ]
};
const trigger$7 = {
  title: "trigger",
  description: "Toggles the collapsed state of an item. It should be nested inside of its associated `item`.",
  args: [
    {
      label: "type",
      type: ['"single"', '"multiple"'],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["string", "string[]", "undefined"]
    }
  ],
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ["trigger"]
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    },
    {
      label: "[data-value]",
      value: "The value of the associated item."
    }
  ]
};
const content$1 = {
  title: "content",
  description: "Contains the collapsible content for an accordion item.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: ["true", "undefined"]
    }
  ]
};
const keyboard$i = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When the `trigger` of a collapsed section is focused, expands the section."
    },
    {
      key: "Enter",
      description: "When the `trigger` of a collapsed section is focused, expands the section."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element"
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next `trigger` element."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the previous `trigger` element."
    },
    {
      key: "Home",
      description: "When focus is on a `trigger`, moves focus to the first `trigger`."
    },
    {
      key: "End",
      description: "When focus is on a `trigger`, moves focus to the last `trigger`."
    }
  ]
};
const schemas$m = {
  builder: builder$m,
  content: content$1,
  root: root$8,
  item: item$4,
  trigger: trigger$7,
  keyboard: keyboard$i
};
const features$n = [
  "Full keyboard navigation",
  "Can expand one or multiple items",
  "Can be controlled or uncontrolled"
];
const accordionData = {
  schemas: schemas$m,
  features: features$n
};
const builder$l = {
  title: "createAvatar",
  description: "The configuration object passed to the `createAvatar` builder function.",
  args: [
    {
      label: "src",
      type: "string",
      default: '""'
    },
    {
      label: "delayMs",
      type: "number"
    }
  ]
};
const schemas$l = {
  builder: builder$l
};
const features$m = [
  "Automatic & manual control over image rendering",
  "Fallback supports any children elements",
  "Optionally delay fallback rendering to avoid flashes"
];
const avatarData = {
  schemas: schemas$l,
  features: features$m
};
const builder$k = {
  title: "createCheckbox",
  description: "The configuration object passed to the `createCheckbox` builder function.",
  args: [
    {
      label: "checked",
      type: 'boolean | "indeterminate"',
      default: false
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const keyboard$h = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Toggles the checkbox state."
    }
  ]
};
const schemas$k = {
  builder: builder$k,
  keyboard: keyboard$h
};
const features$l = [
  "Supports indeterminate state",
  "Full keyboard navigation",
  "Can be controlled or uncontrolled"
];
const checkboxData = {
  schemas: schemas$k,
  features: features$l
};
const builder$j = {
  title: "CreateCollapsibleArgs",
  description: "The configuration object passed to the `createCollapsible` builder function.",
  args: [
    {
      label: "open",
      type: "boolean",
      default: "false"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const keyboard$g = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Activates the trigger and toggles the visibility of the collapsible content"
    },
    {
      key: "Enter",
      description: "Activates the trigger and toggles the visibility of the collapsible content"
    }
  ]
};
const schemas$j = {
  builder: builder$j,
  keyboard: keyboard$g
};
const features$k = [
  "Full keyboard navigation",
  "Svelte transition support",
  "Can be controlled or uncontrolled"
];
const collapsibleData = {
  schemas: schemas$j,
  features: features$k
};
const builder$i = {
  title: "CreateContextMenuArgs",
  description: "The configuration object passed to the `createContextMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'bottom'"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    }
  ]
};
const menu$1 = {
  title: "Menu",
  description: "The element which wraps the entire dropdown menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"menu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the menu element."
    }
  ]
};
const trigger$6 = {
  title: "Trigger",
  description: "The element which when right clicked inside, opens the context menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"trigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    }
  ]
};
const arrow$5 = {
  title: "Arrow",
  description: "An optional arrow element which points to the trigger.",
  dataAttributes: [
    {
      label: "[data-arrow]",
      value: "`true`"
    },
    {
      label: "[data-melt-part]",
      value: ['"arrow"']
    }
  ]
};
const item$3 = {
  title: "Item",
  description: "A basic menu item.",
  args: [
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const checkboxItem$1 = {
  title: "Checkbox Item",
  description: "A checkbox menu item.",
  args: [
    {
      label: "checked",
      type: "Writable<boolean>"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const radioGroupBuilder$1 = {
  title: "CreateMenuRadioGroupArgs",
  description: "The configuration object passed to the `createMenuRadioGroup` builder function.",
  args: [
    {
      label: "value",
      type: "string"
    }
  ]
};
const radioGroup$1 = {
  title: "Menu Radio Group",
  description: "A group of radio menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"radio-group"']
    }
  ]
};
const radioItem$1 = {
  title: "Radio Group Item",
  description: "A radiogroup menu item.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const separator$3 = {
  title: "Separator",
  description: "A horizontal line which separates menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"separator"']
    }
  ]
};
const submenuBuilder$1 = {
  title: "CreateDropdownSubMenuArgs",
  description: "The configuration object passed to the `createDropdownSubMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'right'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    }
  ]
};
const submenu$1 = {
  title: "Submenu",
  description: "A submenu element displayed when its trigger is selected.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"submenu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the submenu element."
    }
  ]
};
const subTrigger$1 = {
  title: "Sub Trigger",
  description: "A button which opens its associated submenu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"subtrigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: "Present if the element is disabled"
    }
  ]
};
const keyboard$f = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "Enter",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "ArrowDown",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item."
    },
    {
      key: "ArrowUp",
      description: "When focused on an `item`, shifts focus to the next item.."
    },
    {
      key: "ArrowRight",
      description: "When focused on a `subTrigger`, opens the `subMenu` and focuses the first item."
    },
    {
      key: "ArrowLeft",
      description: "When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`."
    },
    {
      key: "Esc",
      description: "Closes the dropdown menu and focuses the `trigger`."
    }
  ]
};
const schemas$i = {
  builder: builder$i,
  radioGroup: radioGroup$1,
  radioItem: radioItem$1,
  radioGroupBuilder: radioGroupBuilder$1,
  checkboxItem: checkboxItem$1,
  menu: menu$1,
  arrow: arrow$5,
  item: item$3,
  trigger: trigger$6,
  keyboard: keyboard$f,
  subTrigger: subTrigger$1,
  submenu: submenu$1,
  submenuBuilder: submenuBuilder$1,
  separator: separator$3
};
const features$j = [
  "Can be controlled or uncontrolled.",
  "Supports submenus with configurable reading direction.",
  "Customize menu positioning.",
  "Optionally render a pointing arrow.",
  "Fully managed focus.",
  "Full keyboard navigation.",
  "Typeahead support"
];
const contextMenuData = {
  schemas: schemas$i,
  features: features$j
};
const builder$h = {
  title: "CreateDialogArgs",
  description: "The configuration object passed to the `createDialog` builder function.",
  args: [
    {
      label: "role",
      type: "'dialog' | 'alert-dialog'",
      default: "'dialog'"
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    },
    {
      label: "closeOnEscape",
      type: "boolean",
      default: true
    },
    {
      label: "closeOnOutsideClick",
      type: "boolean",
      default: true
    }
  ]
};
const keyboard$e = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Opens/closes the dialog."
    },
    {
      key: "Enter",
      description: "Opens/closes the dialog."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element within the dialog."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element within the dialog."
    },
    {
      key: "Esc",
      description: "Closes the dialog and moves focus to the trigger element."
    }
  ]
};
const schemas$h = {
  builder: builder$h,
  keyboard: keyboard$e
};
const features$i = [
  "Fully managed focus",
  "Can be controlled or uncontrolled",
  "Esc closes the component automaticlaly"
];
const dialogData = {
  schemas: schemas$h,
  features: features$i
};
const builder$g = {
  title: "CreateDropdownMenuArgs",
  description: "The configuration object passed to the `createDropdownMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'bottom'"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    }
  ]
};
const menu = {
  title: "Menu",
  description: "The element which wraps the entire dropdown menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"menu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the menu element."
    }
  ]
};
const trigger$5 = {
  title: "Trigger",
  description: "The button which toggles the dropdown menu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"trigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    }
  ]
};
const arrow$4 = {
  title: "Arrow",
  description: "An optional arrow element which points to the trigger.",
  dataAttributes: [
    {
      label: "[data-arrow]",
      value: "`true`"
    },
    {
      label: "[data-melt-part]",
      value: ['"arrow"']
    }
  ]
};
const item$2 = {
  title: "Item",
  description: "A basic menu item.",
  args: [
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const checkboxItem = {
  title: "Checkbox Item",
  description: "A checkbox menu item.",
  args: [
    {
      label: "checked",
      type: "Writable<boolean>"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const radioGroupBuilder = {
  title: "CreateMenuRadioGroupArgs",
  description: "The configuration object passed to the `createMenuRadioGroup` builder function.",
  args: [
    {
      label: "value",
      type: "string"
    }
  ]
};
const radioGroup = {
  title: "Menu Radio Group",
  description: "A group of radio menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"radio-group"']
    }
  ]
};
const radioItem = {
  title: "Radio Group Item",
  description: "A radiogroup menu item.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    },
    {
      label: "onSelect",
      type: "function"
    }
  ],
  dataAttributes: [
    {
      label: "[data-orientation]",
      value: ['"vertical"', '"horizontal"']
    },
    {
      label: "[data-melt-part]",
      value: ['"item"']
    }
  ]
};
const separator$2 = {
  title: "Separator",
  description: "A horizontal line which separates menu items.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"separator"']
    }
  ]
};
const submenuBuilder = {
  title: "CreateDropdownSubMenuArgs",
  description: "The configuration object passed to the `createDropdownSubMenu` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'right'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    }
  ]
};
const submenu = {
  title: "Submenu",
  description: "A submenu element displayed when its trigger is selected.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"submenu"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-melt-menu]",
      value: "Present on the submenu element."
    }
  ]
};
const subTrigger = {
  title: "Sub Trigger",
  description: "A button which opens its associated submenu.",
  dataAttributes: [
    {
      label: "[data-melt-part]",
      value: ['"subtrigger"']
    },
    {
      label: "[data-state]",
      value: ['"open"', '"closed"']
    },
    {
      label: "[data-disabled]",
      value: "Present if the element is disabled"
    }
  ]
};
const keyboard$d = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "Enter",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, selects the item."
    },
    {
      key: "ArrowDown",
      description: "When focused on the `trigger`, opens the dropdown and focuses the first item. When focused on an `item`, shifts focus to the next item."
    },
    {
      key: "ArrowUp",
      description: "When focused on an `item`, shifts focus to the next item.."
    },
    {
      key: "ArrowRight",
      description: "When focused on a `subTrigger`, opens the `subMenu` and focuses the first item."
    },
    {
      key: "ArrowLeft",
      description: "When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`."
    },
    {
      key: "Esc",
      description: "Closes the dropdown menu and focuses the `trigger`."
    }
  ]
};
const schemas$g = {
  builder: builder$g,
  radioGroup,
  radioItem,
  radioGroupBuilder,
  checkboxItem,
  menu,
  arrow: arrow$4,
  item: item$2,
  trigger: trigger$5,
  keyboard: keyboard$d,
  subTrigger,
  submenu,
  submenuBuilder,
  separator: separator$2
};
const features$h = [
  "Can be controlled or uncontrolled.",
  "Supports submenus with configurable reading direction.",
  "Customize menu positioning.",
  "Optionally render a pointing arrow.",
  "Fully managed focus.",
  "Full keyboard navigation.",
  "Typeahead support"
];
const dropdownMenuData = {
  schemas: schemas$g,
  features: features$h
};
const builder$f = {
  title: "CreateHoverCardArgs",
  description: "The configuration object passed to the `createHoverCard` builder function.",
  args: [
    {
      label: "defaultOpen",
      type: "boolean",
      default: false
    },
    {
      label: "positioning",
      type: "FloatingConfig",
      default: 'placement: "bottom"'
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "open",
      type: "boolean",
      default: false
    },
    {
      label: "closeOnOutsideClick",
      type: "boolean",
      default: true
    },
    {
      label: "openDelay",
      type: "number",
      default: 700
    },
    {
      label: "closeDelay",
      type: "number",
      default: 300
    }
  ]
};
const trigger$4 = {
  title: "Trigger",
  description: "The hover card trigger element.",
  dataAttributes: [
    {
      label: "data-state",
      value: ["'open'", "'closed'"]
    },
    {
      label: "data-melt-hover-card-trigger",
      value: ""
    }
  ]
};
const content = {
  title: "Content",
  description: "The content displayed in the hovercard",
  dataAttributes: [
    {
      label: "data-melt-hover-card-content",
      value: ""
    }
  ]
};
const arrow$3 = {
  title: "Arrow",
  description: "The optional arrow element that points to the trigger.",
  dataAttributes: [
    {
      label: "data-arrow",
      value: "true"
    },
    {
      label: "data-melt-hover-card-arrow",
      value: ""
    }
  ]
};
const schemas$f = {
  builder: builder$f,
  trigger: trigger$4,
  arrow: arrow$3,
  content
};
const features$g = [
  "Controlled or uncontrolled",
  "Ignored by screen readers",
  "Custom open and close delay support",
  "Positioning and alignment customization"
];
const hoverCardData = {
  schemas: schemas$f,
  features: features$g
};
const features$f = [
  "Supports nested controls",
  "Disables text selection when double clicking the label"
];
const labelData = {
  features: features$f
};
const menuSchemas = dropdownMenuData.schemas;
const builder$e = {
  title: "CreateMenubar",
  description: "The configuration object passed to the `createMenubar` builder function.",
  args: [
    {
      label: "loop",
      type: "boolean",
      default: "true"
    }
  ]
};
const menuBuilder = {
  title: "CreateMenu",
  description: "The configuration object passed to the `createMenu` builder function returned from the `createMenubar` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig",
      default: "placement: 'bottom'"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    },
    {
      label: "loop",
      type: "boolean",
      default: false
    }
  ]
};
const keyboard$c = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item."
    },
    {
      key: "Enter",
      description: "When focused on the `trigger`, opens the associated menu. When focused on an `item`, selects the item."
    },
    {
      key: "ArrowDown",
      description: "When focused on a `trigger`, opens the associated menu. When focused on an `item`, shifts focus to the next item."
    },
    {
      key: "ArrowUp",
      description: "When focused on an `item`, shifts focus to the next item.."
    },
    {
      key: "ArrowRight",
      description: "When focused on a `subTrigger`, opens the `subMenu` and focuses the first item. When focus is within the menu, opens the next menu in the menubar"
    },
    {
      key: "ArrowLeft",
      description: "When focused on within a `subMenu`, closes the submenu and shifts focus to that submenu's `subTrigger`. When focus is within the menu, opens the previous menu in the menubar"
    },
    {
      key: "Esc",
      description: "Closes the open menu and focuses that menu's `trigger`."
    }
  ]
};
const schemas$e = {
  builder: builder$e,
  menuBuilder,
  radioGroup: menuSchemas.radioGroup,
  radioItem: menuSchemas.radioItem,
  radioGroupBuilder: menuSchemas.radioGroupBuilder,
  checkboxItem: menuSchemas.checkboxItem,
  menu: menuSchemas.menu,
  arrow: menuSchemas.arrow,
  item: menuSchemas.item,
  trigger: menuSchemas.trigger,
  keyboard: keyboard$c,
  subTrigger: menuSchemas.subTrigger,
  submenu: menuSchemas.submenu,
  submenuBuilder: menuSchemas.submenuBuilder,
  separator: menuSchemas.separator
};
const features$e = [
  "Can be controlled or uncontrolled.",
  "Supports submenus with configurable reading direction.",
  "Customize menu positioning.",
  "Optionally render a pointing arrow.",
  "Fully managed focus.",
  "Full keyboard navigation.",
  "Typeahead support"
];
const menubarData = {
  schemas: schemas$e,
  features: features$e
};
const builder$d = {
  title: "CreatePaginationArgs",
  description: "The configuration object passed to the `createPagination` builder function.",
  args: [
    {
      label: "count",
      type: "number"
    },
    {
      label: "perPage",
      type: "number",
      default: 1
    },
    {
      label: "siblingCount",
      type: "number",
      default: 1
    },
    {
      label: "page",
      type: "number",
      default: 1
    }
  ]
};
const keyboard$b = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focused on a `pageTrigger` or `nextButton`, moves to that page."
    },
    {
      key: "Enter",
      description: "When focused on a `pageTrigger` or `nextButton`, moves to that page."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element"
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next focusable `pageTrigger` or `nextButton`."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous focusable `pageTrigger` or `prevButton`"
    },
    {
      key: "Home",
      description: "Moves focus to the first focusable `pageTrigger` or `prevButton`."
    },
    {
      key: "End",
      description: "Moves focus to the first focusable `pageTrigger` or `prevButton`."
    }
  ]
};
const root$7 = {
  title: "Root",
  description: "The root element of the pagination component.",
  dataAttributes: [
    {
      label: "data-scope",
      value: "`pagination`"
    }
  ]
};
const pageTrigger = {
  title: "Page Trigger",
  description: "A button that triggers a page change.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-trigger`"
    },
    {
      label: "data-selected",
      value: "Present when the page is selected."
    }
  ]
};
const prevButton = {
  title: "Previous Button",
  description: "A button that moves to the previous page.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-prev-button`"
    }
  ]
};
const nextButton = {
  title: "Next Button",
  description: "A button that moves to the next page.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`page-next-button`"
    }
  ]
};
const schemas$d = {
  builder: builder$d,
  keyboard: keyboard$b,
  root: root$7,
  pageTrigger,
  prevButton,
  nextButton
};
const features$d = [
  "Full keyboard navigation support",
  "Supports a custom number of pages",
  "Display range of visible pages",
  "Supports a custom number of visible pages",
  "Supports a custom number of sibling pages"
];
const paginationData = {
  schemas: schemas$d,
  features: features$d
};
const builder$c = {
  title: "CreatePopoverArgs",
  description: "The configuration object passed to the `createPopover` builder function.",
  args: [
    {
      label: "checked",
      type: ["boolean", '"indeterminate"'],
      default: false
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const trigger$3 = {
  title: "Trigger",
  description: "The button(s) which open/close the popover.",
  dataAttributes: [
    {
      label: "data-state",
      value: ['"open"', '"closed"']
    }
  ]
};
const arrow$2 = {
  title: "Arrow",
  description: "The optional arrow element.",
  dataAttributes: [
    {
      label: "data-arrow",
      value: ["true"]
    }
  ]
};
const keyboard$a = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Toggles the popover."
    },
    {
      key: "Enter",
      description: "Toggles the popover."
    },
    {
      key: "Tab",
      description: "Moves focus to the next focusable element; all focusable elements in the popover are included in the page Tab sequence."
    },
    {
      key: "Shift + Tab",
      description: "Moves focus to the previous focusable element; all focusable elements in the popover are included in the page Tab sequence."
    },
    {
      key: "Esc",
      description: "Closes the popover and moves focus to the trigger element."
    }
  ]
};
const schemas$c = {
  keyboard: keyboard$a,
  builder: builder$c,
  trigger: trigger$3,
  arrow: arrow$2
};
const features$c = [
  "Full keyboard navigation",
  "Customize positioning of popover",
  "Can be controlled or uncontrolled",
  "Focus is fully managed",
  "Supports an optional arrow component"
];
const popoverData = {
  schemas: schemas$c,
  features: features$c
};
const builder$b = {
  title: "CreateProgressArgs",
  description: "The configuration object passed to the `createProgress` builder function.",
  args: [
    {
      label: "value",
      type: "number"
    },
    {
      label: "max",
      type: "number",
      default: 100
    }
  ]
};
const root$6 = {
  title: "Progress",
  description: "The progress component.",
  dataAttributes: [
    {
      label: "data-value",
      value: "The current value of the progress bar."
    },
    {
      label: "data-state",
      value: ['"indeterminate"', '"complete"', '"loading"']
    },
    {
      label: "data-max",
      value: "The maximum value of the progress bar."
    }
  ]
};
const schemas$b = {
  builder: builder$b,
  root: root$6
};
const features$b = ["Assistive reading technology support for progress bar"];
const progressData = {
  schemas: schemas$b,
  features: features$b
};
const builder$a = {
  title: "CreateRadioGroupArgs",
  description: "The configuration object passed to the `createRadioGroup` builder function.",
  args: [
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "orientation",
      type: ['"horizontal"', '"vertical"'],
      default: '"vertical"'
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const root$5 = {
  title: "Root",
  description: "The radio group component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`radio-group`"
    }
  ]
};
const item$1 = {
  title: "Item",
  description: "The radio group item components.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-disabled",
      value: "Present if the item is disabled."
    },
    {
      label: "data-state",
      value: ['"checked"', '"unchecked"']
    },
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`radio-group-item`"
    }
  ]
};
const keyboard$9 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Moves focus to either the checked radio item or the first radio item."
    },
    {
      key: "Space",
      description: "When focused on an unchecked item, checks it."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to & checks the next radio item"
    },
    {
      key: "ArrowRight",
      description: "Moves focus to & checks the next radio item"
    },
    {
      key: "ArrowUp",
      description: "Moves focus to & checks the previous radio item"
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to & checks the previous radio item"
    }
  ]
};
const schemas$a = {
  builder: builder$a,
  root: root$5,
  item: item$1,
  keyboard: keyboard$9
};
const features$a = [
  "Full keyboard navigation",
  "Can be controlled or uncontrolled",
  "Supports horizontal and vertical orientation"
];
const radioGroupData = {
  schemas: schemas$a,
  features: features$a
};
const builder$9 = {
  title: "CreateSelectArgs",
  description: "The configuration object passed to the `createSelect` builder function.",
  args: [
    {
      label: "required",
      type: "boolean",
      default: false
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "label",
      type: "string"
    },
    {
      label: "value",
      type: "unknown"
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "preventScroll",
      type: "boolean",
      default: true
    },
    {
      label: "loop",
      type: "boolean",
      default: false
    }
  ]
};
const trigger$2 = {
  title: "Trigger",
  description: "The element which opens/closes the select.",
  dataAttributes: [
    {
      label: "data-state",
      value: ['"open"', '"closed"']
    },
    {
      label: "data-disabled",
      value: "Present if the `select` element is disabled."
    }
  ]
};
const option = {
  title: "Option",
  description: "The option elements",
  args: [
    {
      label: "label",
      type: "string"
    },
    {
      label: "value",
      type: "unknown"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const arrow$1 = {
  title: "Arrow",
  description: "The optional arrow element",
  dataAttributes: [
    {
      label: "data-arrow",
      value: ['"true"']
    }
  ]
};
const separator$1 = {
  title: "Separator",
  description: "An optional separator element"
};
const group = {
  title: "createGroup",
  description: "An optional builder used to group options together."
};
const keyboard$8 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option."
    },
    {
      key: "Enter",
      description: "When focus is on the `trigger`, opens the select and focuses the selected option. When focus is on an `option`, selects the focused option."
    },
    {
      key: "ArrowDown",
      description: "When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the next option."
    },
    {
      key: "ArrowUp",
      description: "When focus is on the `trigger`, opens the select. When focus is on an `option`, moves focus to the previous option."
    },
    {
      key: "Esc",
      description: "Closes the select and moves focus to the `trigger`."
    }
  ]
};
const schemas$9 = {
  builder: builder$9,
  trigger: trigger$2,
  option,
  arrow: arrow$1,
  group,
  separator: separator$1,
  keyboard: keyboard$8
};
const features$9 = [
  "Full keyboard navigation",
  "Can be controlled or uncontrolled",
  "Typeahead support",
  "Optional arrow component",
  "Custom positioning"
];
const selectData = {
  schemas: schemas$9,
  features: features$9
};
const builder$8 = {
  title: "CreateSeparatorArgs",
  description: "The configuration object passed to the `createSeparator` builder function.",
  args: [
    {
      label: "orientation",
      type: ["'horizontal'", "'vertical'"],
      default: "'horizontal'"
    },
    {
      label: "decorative",
      type: "boolean",
      default: false
    }
  ]
};
const schemas$8 = {
  builder: builder$8
};
const features$8 = [
  "Supports horizontal and vertical orientation",
  "Supports decorative and non-decorative separators"
];
const separatorData = {
  schemas: schemas$8,
  features: features$8
};
const builder$7 = {
  title: "CreateSliderArgs",
  description: "The configuration object passed to the `createSlider` builder function.",
  args: [
    {
      label: "value",
      type: "number[]",
      default: "[]"
    },
    {
      label: "min",
      type: "number",
      default: 0
    },
    {
      label: "max",
      type: "number",
      default: 100
    },
    {
      label: "step",
      type: "number",
      default: 1
    },
    {
      label: "orientation",
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const keyboard$7 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "ArrowRight",
      description: "Increments/decrements by the `step` value depending on `orientation`."
    },
    {
      key: "ArrowLeft",
      description: "Increments/decrements by the `step` value depending on `orientation`."
    },
    {
      key: "ArrowUp",
      description: "Increases the value by the `step` amount."
    },
    {
      key: "ArrowDown",
      description: "Decreases the value by the `step` amount."
    },
    {
      key: "Home",
      description: "Sets the value to its minimum"
    },
    {
      key: "End",
      description: "Sets the value to its maximum"
    }
  ]
};
const slider = {
  title: "Slider",
  description: "The slider component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    }
  ]
};
const thumb = {
  title: "Thumb",
  description: "The slider thumb component.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`thumb`"
    }
  ]
};
const schemas$7 = {
  builder: builder$7,
  keyboard: keyboard$7,
  slider,
  thumb
};
const features$7 = [
  "Supports multiple thumbs",
  "Can be controlled or uncontrolled",
  "Supports a minimum value between thumbs",
  "Supports both touch and click",
  "Supports a custom step size",
  "Can be vertical or horizontal"
];
const sliderData = {
  schemas: schemas$7,
  features: features$7
};
const builder$6 = {
  title: "CreateSwitchArgs",
  description: "The configuration object passed to the `createSwitch` builder function.",
  args: [
    {
      label: "checked",
      type: "boolean",
      default: "false"
    },
    {
      label: "disabled",
      type: "boolean",
      default: "false"
    },
    {
      label: "required",
      type: "boolean",
      default: "false"
    },
    {
      label: "name",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    }
  ]
};
const root$4 = {
  title: "Root",
  description: "The switch component.",
  dataAttributes: [
    {
      label: "data-disabled",
      value: "Present if the switch is disabled."
    },
    {
      label: "data-state",
      value: ['"checked"', '"unchecked"']
    }
  ]
};
const keyboard$6 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "When the switch has focus, toggles the switch."
    },
    {
      key: "Enter",
      description: "When the switch has focus, toggles the switch."
    }
  ]
};
const schemas$6 = {
  builder: builder$6,
  keyboard: keyboard$6,
  root: root$4
};
const features$6 = ["Full keyboard navigation", "Can be controlled or uncontrolled"];
const switchData = {
  schemas: schemas$6,
  features: features$6
};
const builder$5 = {
  title: "CreateTabsArgs",
  description: "The configuration object passed to the `createTabs` builder function.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "onChange",
      type: "(value: string) => void"
    },
    {
      label: "activateOnFocus",
      type: "boolean",
      default: true
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ['"horizontal"', '"vertical"'],
      default: '"horizontal"'
    },
    {
      label: "autoSet",
      type: "boolean",
      default: true
    }
  ]
};
const root$3 = {
  title: "Root",
  description: "The tabs component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-melt-part",
      value: "`tabs-root`"
    }
  ]
};
const list = {
  title: "List",
  description: "The tabs list component.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    }
  ]
};
const trigger$1 = {
  title: "Trigger",
  description: "The element which opens a given tab.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-state",
      value: ['"active"', '"inactive"']
    },
    {
      label: "data-orientation",
      value: ['"horizontal"', '"vertical"']
    },
    {
      label: "data-disabled",
      value: "Present if disabled"
    }
  ]
};
const keyboard$5 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the preview trigger depending on `orientation` & activates the corresponding content."
    },
    {
      key: "Home",
      description: "Moves focus to the first trigger depending & activates the corresponding content."
    },
    {
      key: "End",
      description: "Moves focus to the last trigger depending & activates the corresponding content."
    }
  ]
};
const schemas$5 = {
  builder: builder$5,
  root: root$3,
  list,
  trigger: trigger$1,
  keyboard: keyboard$5
};
const features$5 = [
  "Full keyboard navigation",
  "Can be controlled or uncontrolled",
  "Supports horizontal and vertical orientation"
];
const tabsData = {
  schemas: schemas$5,
  features: features$5
};
const builder$4 = {
  title: "CreateTagsInputArgs",
  description: "The configuration object passed to the `createTagsInput` builder function.",
  args: [
    {
      label: "placeholder",
      type: "string",
      default: "Enter tags..."
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "selectedTag",
      type: "{id: string, value: string}"
    },
    {
      label: "tags",
      type: "string[] | {id: string, value: string}[]",
      default: "[]"
    },
    {
      label: "unique",
      type: "boolean",
      default: false
    }
  ]
};
const root$2 = {
  title: "Root",
  description: "The tags input component.",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`tags-input`"
    },
    {
      label: "data-disabled",
      value: "Present if the item is disabled."
    }
  ]
};
const input = {
  title: "Root",
  description: "The input component",
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`tags-input-input`"
    },
    {
      label: "data-disabled",
      value: "Present if the item is disabled."
    }
  ]
};
const tag = {
  title: "Item",
  description: "The tag components.",
  args: [
    {
      label: "id",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`tags-input-tag`"
    },
    {
      label: "data-tag-id",
      value: "Unique tag ID."
    },
    {
      label: "data-tag-value",
      value: "Tag value"
    },
    {
      label: "data-disabled",
      value: "Present if the tag is disabled."
    },
    {
      label: "data-selected",
      value: "Present if the tag is selected."
    }
  ]
};
const deleteTrigger = {
  title: "Item",
  description: "The tag components.",
  args: [
    {
      label: "id",
      type: "string"
    },
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-melt-part",
      value: "`tags-input-delete-trigger`"
    },
    {
      label: "data-tag-id",
      value: "Unique tag ID."
    },
    {
      label: "data-tag-value",
      value: "Tag value"
    },
    {
      label: "data-disabled",
      value: "Present if the tag is disabled."
    },
    {
      label: "data-selected",
      value: "Present if the tag is selected."
    }
  ]
};
const keyboard$4 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "tab",
      description: "Moves focus between tags and the input."
    },
    {
      key: "Delete",
      description: "When focused on a tag, deletes it and moves focus to the right."
    },
    {
      key: "Backspace",
      description: "When focused on a tag, deletes it and moves focus to the left. If there are no tags to the left, either the next tags gets focus, or the input."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next tag or input."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous tag."
    }
  ]
};
const schemas$4 = {
  builder: builder$4,
  root: root$2,
  input,
  tag,
  deleteTrigger,
  keyboard: keyboard$4
};
const features$4 = [
  "Type in the input and press enter to add tags",
  "Delete tags",
  "Disable everything or disable specific tags",
  "Option to only allow unique tags",
  "Keyboard navigation"
];
const tagsInputData = {
  schemas: schemas$4,
  features: features$4
};
const builder$3 = {
  title: "CreateToggleArgs",
  description: "The configuration object passed to the `createToggle` builder function.",
  args: [
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "pressed",
      type: "boolean",
      default: false
    }
  ]
};
const toggle = {
  title: "Toggle",
  description: "The toggle component.",
  dataAttributes: [
    {
      label: "data-disabled",
      value: "Present if the toggle is disabled."
    },
    {
      label: "data-state",
      value: ["'on'", "'off'"]
    }
  ]
};
const keyboard$3 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Space",
      description: "Activates/deactivates the toggle."
    },
    {
      key: "Enter",
      description: "Activates/deactivates the toggle."
    }
  ]
};
const schemas$3 = {
  builder: builder$3,
  toggle,
  keyboard: keyboard$3
};
const features$3 = ["Full keyboard navigation", "Can be controlled or uncontrolled"];
const toggleData = {
  schemas: schemas$3,
  features: features$3
};
const builder$2 = {
  title: "CreateToggleGroupArgs",
  description: "The configuration object passed to the `createToggleGroup` builder function.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    },
    {
      label: "value",
      type: ["'string'", "string[]", "null"],
      default: "null"
    },
    {
      label: "rovingFocus",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ["'horizontal'", "'vertical'"],
      default: "'horizontal'"
    },
    {
      label: "loop",
      type: "boolean",
      default: true
    }
  ]
};
const root$1 = {
  title: "Root",
  description: "The root toggle group element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-part",
      value: "`toggle-group`"
    }
  ]
};
const item = {
  title: "Item",
  description: "The toggle group item element.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-part",
      value: "`toggle-group-item`"
    },
    {
      label: "data-state",
      value: ["'on'", "'off'"]
    }
  ]
};
const keyboard$2 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Moves focus to either the pressed item or the first item in the group."
    },
    {
      key: "Space",
      description: "Activates/deactivates the item."
    },
    {
      key: "Enter",
      description: "Activates/deactivates the item."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next item in the group."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next item in the group."
    },
    {
      key: "ArrowUp",
      description: "Moves focus to the previous item in the group."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous item in the group."
    },
    {
      key: "Home",
      description: "Moves focus to the first item in the group."
    },
    {
      key: "End",
      description: "Moves focus to the last item in the group."
    }
  ]
};
const schemas$2 = {
  builder: builder$2,
  root: root$1,
  item,
  keyboard: keyboard$2
};
const features$2 = [
  "Horizontal or vertical orientation",
  "Can be controlled or uncontrolled",
  "Full keyboard navigation"
];
const toggleGroupData = {
  schemas: schemas$2,
  features: features$2
};
const builder$1 = {
  title: "CreateToolbarArgs",
  description: "The configuration object passed to the `createToolbar` builder function.",
  args: [
    {
      label: "loop",
      type: "boolean",
      default: true
    },
    {
      label: "orientation",
      type: ["'horizontal'", "'vertical'"]
    }
  ]
};
const root = {
  title: "Root",
  description: "The root toolbar element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar",
      value: ""
    }
  ]
};
const button = {
  title: "Button",
  description: "The toolbar button element.",
  dataAttributes: [
    {
      label: "data-melt-toolbar-item",
      value: ""
    }
  ]
};
const link = {
  title: "Link",
  description: "The toolbar link element.",
  dataAttributes: [
    {
      label: "data-melt-toolbar-item",
      value: ""
    }
  ]
};
const separator = {
  title: "Separator",
  description: "The toolbar separator element.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar-separator",
      value: ""
    }
  ]
};
const groupBuilder = {
  title: "CreateToolbarGroupArgs",
  description: "Configuration options for the `createToolbarGroup` builder.",
  args: [
    {
      label: "type",
      type: ["'single'", "'multiple'"],
      default: "'single'"
    },
    {
      label: "value",
      type: ["string", "string[]", "null"]
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ]
};
const groupRoot = {
  title: "Group Root",
  description: "The root toolbar element for a toolbar group.",
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar-group",
      value: ""
    }
  ]
};
const groupItem = {
  title: "Group Item",
  description: "A an item within a toolbar group.",
  args: [
    {
      label: "value",
      type: "string"
    },
    {
      label: "disabled",
      type: "boolean",
      default: false
    }
  ],
  dataAttributes: [
    {
      label: "data-orientation",
      value: ["'horizontal'", "'vertical'"]
    },
    {
      label: "data-melt-toolbar-item",
      value: ""
    },
    {
      label: "data-disabled",
      value: "Present if the item is disabled."
    },
    {
      label: "data-state",
      value: ["'on'", "'off'"]
    }
  ]
};
const keyboard$1 = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Moves focus to the first item in the group."
    },
    {
      key: "Space",
      description: "Toggles the state of the focused item."
    },
    {
      key: "Enter",
      description: "Toggles the state of the focused item."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the next item depeding on `orientation`."
    },
    {
      key: "ArrowRight",
      description: "Moves focus to the next item depeding on `orientation`."
    },
    {
      key: "ArrowDown",
      description: "Moves focus to the previous item depeding on `orientation`."
    },
    {
      key: "ArrowLeft",
      description: "Moves focus to the previous item depeding on `orientation`."
    },
    {
      key: "Home",
      description: "Moves focus to the first item."
    },
    {
      key: "End",
      description: "Moves focus to the last item."
    }
  ]
};
const schemas$1 = {
  builder: builder$1,
  root,
  button,
  link,
  separator,
  groupBuilder,
  groupRoot,
  groupItem,
  keyboard: keyboard$1
};
const features$1 = [
  "Full keyboard navigation",
  "Can be controlled or uncontrolled",
  "Horizontal or vertical orientation"
];
const toolbarData = {
  schemas: schemas$1,
  features: features$1
};
const builder = {
  title: "CreateTooltipArgs",
  description: "The configuration object passed to the `createTooltip` builder function.",
  args: [
    {
      label: "positioning",
      type: "FloatingConfig"
    },
    {
      label: "arrowSize",
      type: "number",
      default: 8
    },
    {
      label: "open",
      type: "boolean",
      default: false
    },
    {
      label: "closeOnPointerDown",
      type: "boolean",
      default: true
    },
    {
      label: "openDelay",
      type: "number",
      default: 1e3
    },
    {
      label: "closeDelay",
      type: "number",
      default: 500
    }
  ]
};
const trigger = {
  title: "Trigger",
  description: "The tooltip trigger element.",
  dataAttributes: [
    {
      label: "data-state",
      value: ["'open'", "'closed'"]
    }
  ]
};
const arrow = {
  title: "Arrow",
  description: "The tooltip arrow element.",
  dataAttributes: [
    {
      label: "data-arrow",
      value: "true"
    }
  ]
};
const keyboard = {
  title: "Keyboard Interactions",
  description: "",
  keyboardInteractions: [
    {
      key: "Tab",
      description: "Opens/closes the tooltip without delay."
    },
    {
      key: "Space",
      description: "If open, closes the tooltip without delay."
    },
    {
      key: "Enter",
      description: "If open, closes the tooltip without delay."
    },
    {
      key: "Escape",
      description: "If open, closes the tooltip without delay."
    }
  ]
};
const schemas = {
  builder,
  trigger,
  arrow,
  keyboard
};
const features = [
  "Opens when the trigger is focused or hovered",
  "Closes when the trigger is activated or with escape",
  "Custom delay for opening and closing",
  "Supports custom positioning"
];
const tooltipData = {
  schemas,
  features
};
const builderList = [
  "accordion",
  "avatar",
  "checkbox",
  "collapsible",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "hover-card",
  "label",
  "menubar",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "tags-input",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip"
];
function isBuilderName(key) {
  return builderList.includes(key);
}
const data = {
  accordion: accordionData,
  avatar: avatarData,
  checkbox: checkboxData,
  collapsible: collapsibleData,
  "context-menu": contextMenuData,
  dialog: dialogData,
  "dropdown-menu": dropdownMenuData,
  "hover-card": hoverCardData,
  label: labelData,
  menubar: menubarData,
  pagination: paginationData,
  popover: popoverData,
  progress: progressData,
  "radio-group": radioGroupData,
  select: selectData,
  separator: separatorData,
  slider: sliderData,
  switch: switchData,
  tabs: tabsData,
  "tags-input": tagsInputData,
  "toggle-group": toggleGroupData,
  toggle: toggleData,
  toolbar: toolbarData,
  tooltip: tooltipData
};
const load = async (event) => {
  const modules = /* @__PURE__ */ Object.assign({ "/src/docs/content/builders/accordion.md": () => import("../../../../../chunks/accordion.js"), "/src/docs/content/builders/avatar.md": () => import("../../../../../chunks/avatar.js"), "/src/docs/content/builders/checkbox.md": () => import("../../../../../chunks/checkbox.js"), "/src/docs/content/builders/collapsible.md": () => import("../../../../../chunks/collapsible.js"), "/src/docs/content/builders/context-menu.md": () => import("../../../../../chunks/context-menu.js"), "/src/docs/content/builders/dialog.md": () => import("../../../../../chunks/dialog.js"), "/src/docs/content/builders/dropdown-menu.md": () => import("../../../../../chunks/dropdown-menu.js"), "/src/docs/content/builders/hover-card.md": () => import("../../../../../chunks/hover-card.js"), "/src/docs/content/builders/label.md": () => import("../../../../../chunks/label.js"), "/src/docs/content/builders/menubar.md": () => import("../../../../../chunks/menubar.js"), "/src/docs/content/builders/pagination.md": () => import("../../../../../chunks/pagination.js"), "/src/docs/content/builders/popover.md": () => import("../../../../../chunks/popover.js"), "/src/docs/content/builders/progress.md": () => import("../../../../../chunks/progress.js"), "/src/docs/content/builders/radio-group.md": () => import("../../../../../chunks/radio-group.js"), "/src/docs/content/builders/select.md": () => import("../../../../../chunks/select.js"), "/src/docs/content/builders/separator.md": () => import("../../../../../chunks/separator.js"), "/src/docs/content/builders/slider.md": () => import("../../../../../chunks/slider.js"), "/src/docs/content/builders/switch.md": () => import("../../../../../chunks/switch.js"), "/src/docs/content/builders/tabs.md": () => import("../../../../../chunks/tabs.js"), "/src/docs/content/builders/tags-input.md": () => import("../../../../../chunks/tags-input.js"), "/src/docs/content/builders/toggle-group.md": () => import("../../../../../chunks/toggle-group.js"), "/src/docs/content/builders/toggle.md": () => import("../../../../../chunks/toggle.js"), "/src/docs/content/builders/toolbar.md": () => import("../../../../../chunks/toolbar.js"), "/src/docs/content/builders/tooltip.md": () => import("../../../../../chunks/tooltip.js") });
  let match = {};
  for (const [path, resolver] of Object.entries(modules)) {
    const strippedPath = slugFromPath(path).split("/")[1];
    if (strippedPath === event.params.name) {
      match = { path, resolver };
      break;
    }
  }
  const doc = await match?.resolver?.();
  if (!doc || !doc.metadata) {
    throw error(404);
  }
  const previewsCode = /* @__PURE__ */ Object.assign({
    "/src/docs/previews/accordion/main/css.svelte": __vite_glob_1_0,
    "/src/docs/previews/accordion/main/tailwind.svelte": __vite_glob_1_1,
    "/src/docs/previews/avatar/main/tailwind.svelte": __vite_glob_1_2,
    "/src/docs/previews/checkbox/main/tailwind.svelte": __vite_glob_1_3,
    "/src/docs/previews/collapsible/main/tailwind.svelte": __vite_glob_1_4,
    "/src/docs/previews/context-menu/main/tailwind.svelte": __vite_glob_1_5,
    "/src/docs/previews/dialog/drawer/tailwind.svelte": __vite_glob_1_6,
    "/src/docs/previews/dialog/main/tailwind.svelte": __vite_glob_1_7,
    "/src/docs/previews/dropdown-menu/main/tailwind.svelte": __vite_glob_1_8,
    "/src/docs/previews/hover-card/main/tailwind.svelte": __vite_glob_1_9,
    "/src/docs/previews/label/main/tailwind.svelte": __vite_glob_1_10,
    "/src/docs/previews/menubar/main/tailwind.svelte": __vite_glob_1_11,
    "/src/docs/previews/pagination/main/tailwind.svelte": __vite_glob_1_12,
    "/src/docs/previews/popover/main/tailwind.svelte": __vite_glob_1_13,
    "/src/docs/previews/progress/main/tailwind.svelte": __vite_glob_1_14,
    "/src/docs/previews/radio-group/main/tailwind.svelte": __vite_glob_1_15,
    "/src/docs/previews/select/main/tailwind.svelte": __vite_glob_1_16,
    "/src/docs/previews/separator/main/css.svelte": __vite_glob_1_17,
    "/src/docs/previews/separator/main/tailwind.svelte": __vite_glob_1_18,
    "/src/docs/previews/slider/main/tailwind.svelte": __vite_glob_1_19,
    "/src/docs/previews/switch/main/tailwind.svelte": __vite_glob_1_20,
    "/src/docs/previews/tabs/main/tailwind.svelte": __vite_glob_1_21,
    "/src/docs/previews/tags-input/main/tailwind.svelte": __vite_glob_1_22,
    "/src/docs/previews/toggle-group/main/tailwind.svelte": __vite_glob_1_23,
    "/src/docs/previews/toggle/main/tailwind.svelte": __vite_glob_1_24,
    "/src/docs/previews/toolbar/main/tailwind.svelte": __vite_glob_1_25,
    "/src/docs/previews/tooltip/main/tailwind.svelte": __vite_glob_1_26
  });
  const previewCodeMatches = [];
  for (const [path, resolver] of Object.entries(previewsCode)) {
    const isMatch = previewPathMatcher(path, event.params.name);
    if (isMatch) {
      const prev = { path, content: resolver };
      previewCodeMatches.push(prev);
    }
  }
  const snippets = await createPreviewsObject(event.params.name, previewCodeMatches);
  const previewComponents = /* @__PURE__ */ Object.assign({ "/src/docs/previews/accordion/main/css.svelte": () => import("../../../../../chunks/css.js"), "/src/docs/previews/accordion/main/tailwind.svelte": () => import("../../../../../chunks/tailwind.js"), "/src/docs/previews/avatar/main/tailwind.svelte": () => import("../../../../../chunks/tailwind2.js"), "/src/docs/previews/checkbox/main/tailwind.svelte": () => import("../../../../../chunks/tailwind3.js"), "/src/docs/previews/collapsible/main/tailwind.svelte": () => import("../../../../../chunks/tailwind4.js"), "/src/docs/previews/context-menu/main/tailwind.svelte": () => import("../../../../../chunks/tailwind5.js"), "/src/docs/previews/dialog/drawer/tailwind.svelte": () => import("../../../../../chunks/tailwind6.js"), "/src/docs/previews/dialog/main/tailwind.svelte": () => import("../../../../../chunks/tailwind7.js"), "/src/docs/previews/dropdown-menu/main/tailwind.svelte": () => import("../../../../../chunks/tailwind8.js"), "/src/docs/previews/hover-card/main/tailwind.svelte": () => import("../../../../../chunks/tailwind9.js"), "/src/docs/previews/label/main/tailwind.svelte": () => import("../../../../../chunks/tailwind10.js"), "/src/docs/previews/menubar/main/tailwind.svelte": () => import("../../../../../chunks/tailwind11.js"), "/src/docs/previews/pagination/main/tailwind.svelte": () => import("../../../../../chunks/tailwind12.js"), "/src/docs/previews/popover/main/tailwind.svelte": () => import("../../../../../chunks/tailwind13.js"), "/src/docs/previews/progress/main/tailwind.svelte": () => import("../../../../../chunks/tailwind14.js"), "/src/docs/previews/radio-group/main/tailwind.svelte": () => import("../../../../../chunks/tailwind15.js"), "/src/docs/previews/select/main/tailwind.svelte": () => import("../../../../../chunks/tailwind16.js"), "/src/docs/previews/separator/main/css.svelte": () => import("../../../../../chunks/css2.js"), "/src/docs/previews/separator/main/tailwind.svelte": () => import("../../../../../chunks/tailwind17.js"), "/src/docs/previews/slider/main/tailwind.svelte": () => import("../../../../../chunks/tailwind18.js"), "/src/docs/previews/switch/main/tailwind.svelte": () => import("../../../../../chunks/tailwind19.js"), "/src/docs/previews/tabs/main/tailwind.svelte": () => import("../../../../../chunks/tailwind20.js"), "/src/docs/previews/tags-input/main/tailwind.svelte": () => import("../../../../../chunks/tailwind21.js"), "/src/docs/previews/toggle-group/main/tailwind.svelte": () => import("../../../../../chunks/tailwind22.js"), "/src/docs/previews/toggle/main/tailwind.svelte": () => import("../../../../../chunks/tailwind23.js"), "/src/docs/previews/toolbar/main/tailwind.svelte": () => import("../../../../../chunks/tailwind24.js"), "/src/docs/previews/tooltip/main/tailwind.svelte": () => import("../../../../../chunks/tailwind25.js") });
  let mainPreviewObj = {};
  for (const [path, resolver] of Object.entries(previewComponents)) {
    if (isMainPreviewComponent(event.params.name, path)) {
      mainPreviewObj = { path, resolver };
      break;
    }
  }
  const mainPreview = await mainPreviewObj.resolver?.();
  if (!mainPreview) {
    throw error(500);
  }
  if (!isBuilderName(event.params.name)) {
    throw error(500);
  }
  return {
    component: doc.default,
    metadata: doc.metadata,
    title: doc.metadata.title,
    mainPreview: mainPreview.default,
    snippets,
    builderData: data[event.params.name]
  };
};
export {
  load
};
