<script lang="ts">
	import { createCombobox, melt } from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	type Manga = {
		author: string;
		title: string;
		disabled: boolean;
	};

	let mangas: Manga[] = [
		{
			author: 'Kentaro Miura',
			title: 'Berserk',
			disabled: false,
		},
		{
			author: 'Hajime Isayama',
			title: 'Attack on Titan',
			disabled: false,
		},
		{
			author: 'Junji Ito',
			title: 'Uzumaki',
			disabled: false,
		},
		{
			author: 'Yomi Sarachi',
			title: 'Steins Gate',
			disabled: false,
		},
		{
			author: 'Tite Kubo',
			title: 'Bleach',
			disabled: false,
		},
		{
			author: 'Masashi Kishimoto',
			title: 'Naruto',
			disabled: true,
		},
		{
			author: 'Katsura Hoshino',
			title: 'D.Gray Man',
			disabled: false,
		},
		{
			author: 'Tsugumi Ohba',
			title: 'Death Note',
			disabled: false,
		},
		{
			author: 'ONE',
			title: 'Mob Psycho 100',
			disabled: false,
		},
		{
			author: 'Hiromu Arakawa',
			title: 'Fullmetal Alchemist',
			disabled: false,
		},
	];

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput },
		helpers: { isSelected },
	} = createCombobox({
		forceVisible: true,
	});

	let debounceTimer: ReturnType<typeof setTimeout>;

	const debounce = (callback: () => void) => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(callback, 450);
	};

	let filteredMangas = mangas;

	$: {
		if ($touchedInput) {
			debounce(() => {
				filteredMangas = mangas.filter(({ title, author }) => {
					const normalizedInput = $inputValue.toLowerCase();
					return (
						title.toLowerCase().includes(normalizedInput) ||
						author.toLowerCase().includes(normalizedInput)
					);
				});
			});
		} else {
			filteredMangas = mangas;
		}
	}
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="text-sm font-medium text-magnum-900"
			>Choose your favorite manga:</span
		>
	</label>

	<div class="relative">
		<input
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-lg bg-white
					px-3 pr-12 text-black"
			placeholder="Best book ever"
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
			tabindex="0"
		>
			{#each filteredMangas as book, index (index)}
				<li
					use:melt={$option({
						value: book,
						label: book.title,
						disabled: book.disabled,
					})}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
				data-[highlighted]:bg-magnum-200 data-[highlighted]:text-magnum-900
					data-[disabled]:opacity-50"
				>
					{#if $isSelected(book)}
						<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{book.title}</span>
						<span class="block text-sm opacity-75">{book.author}</span>
					</div>
				</li>
			{:else}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
				data-[highlighted]:bg-magnum-100 data-[highlighted]:text-magnum-700"
				>
					No results found
				</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="scss">
	.check {
		--at-apply: absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
