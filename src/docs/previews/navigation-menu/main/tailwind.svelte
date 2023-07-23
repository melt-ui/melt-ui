<script lang="ts">
	import Logo from '$docs/components/icons/logo.svelte';
	import { createNavigationMenu } from '@melt-ui/svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { scale, fly } from 'svelte/transition';

	const {
		elements: { root, viewport },
		builders: { createMenuItem },
		states: { open: rootOpen },
	} = createNavigationMenu();

	const {
		elements: { content, item, link, trigger },
		states: { open, motion },
	} = createMenuItem();

	const {
		elements: {
			content: contentA,
			item: itemA,
			trigger: triggerA,
			link: linkA,
		},
		states: { open: openA, motion: motionA },
	} = createMenuItem();

	const {
		elements: { item: itemB, link: linkB },
	} = createMenuItem();

	const builders: { title: string; href: string; description: string }[] = [
		{
			title: 'Accordion',
			href: '/docs/builders/accordion',
			description:
				'An interactive component that enables the organization and navigation of content by allowing users to expand and collapse sections.',
		},
		{
			title: 'Collapsible',
			href: '/docs/builders/collapsible',
			description: 'An interactive component which expands/collapses a panel.',
		},
		{
			title: 'Dialog',
			href: '/docs/builders/dialog',
			description:
				'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
		},
		{
			title: 'Dropdown Menu',
			href: '/docs/builders/dropdown-menu',
			description:
				'Displays a menu to the user, which can consist of links or functions, triggered by a button.',
		},
		{
			title: 'Pin Input',
			href: '/docs/builders/pin-input',
			description: 'A sequence of one-character alphanumeric inputs.',
		},
		{
			title: 'Tabs',
			href: '/docs/builders/tabs',
			description:
				'A set of tabbed panels, each associated with a header element, where only one panel is visible at a time.',
		},
	];

	$: console.log($open);
	$: console.log($openA);
</script>

<nav
	class="relative flex max-w-max flex-1 items-center justify-center rounded-md bg-white"
	{...$root}
>
	<div class="relative">
		<ul
			class="group flex flex-1 list-none items-center justify-center space-x-1"
			dir="ltr"
			data-orientation="horizontal"
		>
			<li {...$item}>
				<button
					{...$trigger()}
					use:trigger
					class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-magnum-600 transition-colors hover:bg-magnum-300/25 hover:text-magnum-700 focus:text-magnum-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-magnum-800/50 data-[state=open]:bg-magnum-300/25"
				>
					Getting Started
					<ChevronDown
						class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</button>
				<div
					{...$content}
					use:content
					class="left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
				>
					{#if $open}
						<ul
							class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
							in:fly={{ duration: 300, x: '13rem' }}
							out:fly={{ duration: 300, x: '-13rem' }}
						>
							<li class="row-span-3">
								<a
									href="/"
									class="flex h-full w-full select-none rounded-md border-2 border-magnum-600 bg-neutral-900 no-underline outline-none focus:shadow-md"
									{...$link}
								>
									<div
										class="flex h-full w-full flex-col justify-end bg-magnum-600/25 p-6"
									>
										<Logo class="w-7" />
										<div class="mb-2 mt-4 text-lg font-medium text-white">
											Melt UI
										</div>
										<p class="text-sm leading-tight text-neutral-200">
											Open-source component builders for Svelte.
										</p>
									</div>
								</a>
							</li>
							<li>
								<a
									href="/docs/introduction"
									class="focus:bg-accent block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-magnum-300/50 hover:text-magnum-600 focus:text-neutral-600"
									{...$link}
								>
									<div class="text-sm font-medium leading-none">
										Introduction
									</div>
									<p class="line-clamp-2 text-sm leading-snug text-neutral-700">
										Get familiar with our builder APIs.
									</p>
								</a>
							</li>
							<li>
								<a
									href="/docs/installation"
									class="focus:bg-accent block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-magnum-300/50 hover:text-magnum-600 focus:text-neutral-600"
									{...$link}
								>
									<div class="text-sm font-medium leading-none">
										Installation
									</div>
									<p class="line-clamp-2 text-sm leading-snug text-neutral-700">
										How to start using Melt UI in your project.
									</p>
								</a>
							</li>
							<li>
								<a
									href="/docs/introduction"
									class="focus:bg-accent block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-magnum-300/50 hover:text-magnum-600 focus:text-neutral-600"
									{...$link}
								>
									<div class="text-sm font-medium leading-none">
										Preprocessor
									</div>
									<p class="line-clamp-2 text-sm leading-snug text-neutral-700">
										Sprinkle some syntactic sugar on your components.
									</p>
								</a>
							</li>
						</ul>
					{/if}
				</div>
			</li>
			<li {...$itemA}>
				<button
					{...$triggerA()}
					use:triggerA
					class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-magnum-600 transition-colors hover:bg-magnum-300/25 hover:text-magnum-700 focus:text-magnum-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-magnum-800/50 data-[state=open]:bg-magnum-300/25"
				>
					Builders
					<ChevronDown
						class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</button>

				<div
					{...$contentA}
					use:contentA
					class="left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
				>
					{#if $openA}
						<ul
							class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
							in:fly={{ duration: 300, x: '-13rem' }}
							out:fly={{ duration: 300, x: '13rem' }}
						>
							{#each builders as builder}
								<li>
									<a
										href={builder.href}
										class="focus:bg-accent block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-magnum-300/50 hover:text-magnum-600 focus:text-neutral-600"
										{...$linkA}
									>
										<div class="text-sm font-medium leading-none">
											{builder.title}
										</div>
										<p
											class="line-clamp-2 text-sm leading-snug text-neutral-700"
										>
											{builder.description}
										</p>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</li>
			<li {...$itemB}>
				<a
					{...$linkB}
					href="/docs/introduction"
					class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-magnum-600 transition-colors hover:bg-magnum-300/25 hover:text-magnum-700 focus:text-magnum-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-magnum-800/50 data-[state=open]:bg-magnum-300/25"
				>
					Documentation
				</a>
			</li>
		</ul>
	</div>
	<div class="absolute left-0 top-full flex justify-center">
		<div
			{...$viewport}
			use:viewport
			class="origin-top-center relative mt-1.5 h-[var(--melt-nav-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-white text-magnum-700 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--melt-nav-menu-viewport-width)]"
		/>
	</div>
</nav>
