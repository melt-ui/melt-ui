<script lang="ts">
	import { createCombobox, melt } from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from '$icons/index.js';
	import { fly } from 'svelte/transition';
	export let componentRoot;
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
		multiple: true,
		rootElement: componentRoot,
	});

	$: filteredMangas = $touchedInput
		? mangas.filter(({ title, author }) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					title.toLowerCase().includes(normalizedInput) ||
					author.toLowerCase().includes(normalizedInput)
				);
		  })
		: mangas;
</script>

<div class="root">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="label">Choose your favorite manga:</span>
	</label>

	<div style:position="relative">
		<input use:melt={$input} class="input" placeholder="Best book ever" />
		<div class="chevron">
			{#if $open}
				<ChevronUp style="width: 1rem; height: 1rem;" />
			{:else}
				<ChevronDown style="width: 1rem; height: 1rem;" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -5 }}>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="menu-inner" tabindex="0">
			{#each filteredMangas as book, index (index)}
				<li
					use:melt={$option({
						value: book,
						label: book.title,
						disabled: book.disabled,
					})}
					class="menu-item"
				>
					{#if $isSelected(book)}
						<div class="check">
							<Check style="width: 1rem; height: 1rem;" />
						</div>
					{/if}
					<div class="text-wrapper">
						<span class="title-text">{book.title}</span>
						<span class="author-text">{book.author}</span>
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
