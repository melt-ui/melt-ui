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

<div class="custom-flex-container">
	<label use:melt="label">
		<span class="custom-label">Choose your favorite manga:</span>
	</label>

	<div class="custom-relative-container">
		<input
			use:melt="input"
			class="custom-input"
			placeholder="Best book ever"
		/>
		<div class="custom-absolute-container">
			{#if $open}
				<ChevronUp class="custom-chevron-up" />
			{:else}
				<ChevronDown class="custom-chevron-down" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul class="custom-ul">
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="custom-div" tabindex="0">
			{#each filteredMangas as book, index (index)}
				<li
					use:melt="option"
					class="custom-li"
				>
					{#if $isSelected(book)}
						<div class="custom-check">
							<Check class="custom-check-icon" />
						</div>
					{/if}
					<div class="custom-text">
						<span class="custom-title">{book.title}</span>
						<span class="custom-author">{book.author}</span>
					</div>
				</li>
			{:else}
				<li class="custom-no-results">
					No results found
				</li>
			{/each}
		</div>
	</ul>
{/if}

<style>
    .custom-flex-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .custom-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #333;
    }

    .custom-relative-container {
        position: relative;
    }

    .custom-input {
        display: flex;
        height: 2.5rem;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.375rem;
        background-color: #fff;
        padding: 0.375rem 0.75rem;
        color: #000;
    }

    .custom-absolute-container {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: #333;
    }

    .custom-ul {
        z-index: 10;
        display: flex;
        flex-direction: column;
        max-height: 300px;
        overflow: hidden;
        border-radius: 0.375rem;
    }

    .custom-div {
        display: flex;
        flex-direction: column;
        gap: 0;
        max-height: 100%;
        overflow-y: auto;
        background-color: #fff;
        padding: 0.125rem 0.25rem;
        color: #000;
    }

    .custom-li {
        position: relative;
        cursor: pointer;
        padding: 0.125rem 0.25rem 0.125rem 1rem;
        border-radius: 0.375rem;
    }

    .custom-li[data-highlighted] {
        background-color: #e5e5e5;
        color: #333;
    }

    .custom-li[data-disabled] {
        opacity: 0.5;
    }

    .custom-check {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: #333;
    }

    .custom-check-icon {
        width: 1rem;
        height: 1rem;
    }

    .custom-text {
        padding-left: 1rem;
    }

    .custom-title {
        font-weight: 500;
    }

    .custom-author {
        display: block;
        font-size: 0.875rem;
        opacity: 0.75;
    }

    .custom-no-results {
        position: relative;
        cursor: pointer;
        padding: 0.0625rem 0.25rem 0.0625rem 1.125rem;
        border-radius: 0.375rem;
    }

    .custom-no-results[data-highlighted] {
        background-color: #f5f5f5;
        color: #555;
    }

</style>
