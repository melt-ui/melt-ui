<script lang="ts">
	import { createCombobox, melt } from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput },
		helpers: { isSelected },
	} = createCombobox({
		forceVisible: true,
	});

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

<div class="container">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="label">Choose your favorite manga:</span>
	</label>

	<div class="relative">
		<input use:melt={$input} class="input" placeholder="Best book ever" />
		<div class="icon">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -5 }}>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="item-container" tabindex="0">
			{#each filteredMangas as book, index (index)}
				<li
					use:melt={$option({
						value: book,
						label: book.title,
						disabled: book.disabled,
					})}
					class="item"
				>
					{#if $isSelected(book)}
						<div class="check">
							<Check class="square-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="title">{book.title}</span>
						<span class="author">{book.author}</span>
					</div>
				</li>
			{:else}
				<li class="result-not-found">No results found</li>
			{/each}
		</div>
	</ul>
{/if}

<style>
	:root {
		--magnum-500: #f38d1c;
		--magnum-100: #fef2d6;
		--magnum-200: #fce0ac;
		--magnum-700: #bd5711;
		--magnum-900: #793a15;
	}

	* {
		all: unset;
	}

	.pl-4 {
		display:block;
		padding-left: 1rem;
	}

	.title {
		display: block;
		font-weight: 500;
	}

	.author {
		display: block;
		opacity: 0.75;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		display: block;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 500;
		color: var(--magnum-900);
	}

	.relative {
		position: relative;
	}

	.input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.5rem;
		background-color: white;
		padding: 0 3rem 0 0.75rem;
		height: 2.5rem;
		color: black;
	}

	.icon {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		z-index: 10;
		transform: translateY(-50%);
		color: var(--magnum-900);
	}

	.square-4 {
		width: 1rem;
		height: 1rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		max-height: 300px;
		overflow: hidden;
		z-index: 10;
		border-radius: 0.5rem;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		max-height: 100%;
		overflow-y: auto;
		background-color: white;
		padding: 0.5rem;
		color: black;
		gap: 0;
	}

	.item {
		position: relative;
		cursor: pointer;
		padding: 0.5rem 1rem;
		scroll-margin-top: 0.5rem;
		scroll-margin-bottom: 0.5rem;
		border-radius: 0.375rem;
	}

	.item[data-highlighted] {
		background-color: var(--magnum-200);
		color: var(--magnum-900);
	}

	.item[data-disabled] {
		opacity: 50%;
	}

	.check {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		color: var(--magnum-500);
		/*@apply absolute left-2 top-1/2 text-magnum-500;*/
		translate: 0 calc(-50% + 1px);
		z-index: 10;
	}

	.result-not-found {
		position: relative;
		cursor: pointer;
		border-radius: 0.5rem;
		padding: 0.25rem 1rem 0.25rem 2rem;
		left: 0.5rem;
		top: 50%;
		z-index: 10;
		color: var(--magnum-900);
	}

	.result-not-found[data-highlighted] {
		background-color: var(--magnum-100);
		color: var(--magnum-700);
	}
</style>
