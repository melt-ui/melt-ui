<script lang="ts">
	import {
		createCombobox,
		melt,
		type ComboboxFilterFunction,
	} from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';

	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	let books: Book[] = [
		{
			author: 'Harper Lee',
			title: 'To Kill a Mockingbird',
			disabled: false,
		},
		{
			author: 'Lev Tolstoy',
			title: 'War and Peace',
			disabled: false,
		},
		{
			author: 'Fyodor Dostoyevsy',
			title: 'The Idiot',
			disabled: true,
		},
		{
			author: 'Oscar Wilde',
			title: 'A Picture of Dorian Gray',
			disabled: false,
		},
		{
			author: 'George Orwell',
			title: '1984',
			disabled: false,
		},
		{
			author: 'Jane Austen',
			title: 'Pride and Prejudice',
			disabled: false,
		},
		{
			author: 'Marcus Aurelius',
			title: 'Meditations',
			disabled: false,
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'The Brothers Karamazov',
			disabled: false,
		},
		{
			author: 'Lev Tolstoy',
			title: 'Anna Karenina',
			disabled: false,
		},
		{
			author: 'Fyodor Dostoevsky',
			title: 'Crime and Punishment',
			disabled: false,
		},
	];

	const filterFunction: ComboboxFilterFunction<Book> = ({
		itemValue,
		input,
	}) => {
		// Example string normalization function. Replace as needed.
		const normalize = (str: string) => str.normalize().toLowerCase();
		const normalizedInput = normalize(input);
		return (
			normalizedInput === '' ||
			normalize(itemValue.title).includes(normalizedInput) ||
			normalize(itemValue.author).includes(normalizedInput)
		);
	};

	const {
		elements: { menu, input, item, label },
		states: { open, isEmpty },
		helpers: { isSelected },
	} = createCombobox({
		filterFunction,
		forceVisible: true,
	});
</script>

<label use:melt={$label}>
	<span>Choose your favorite book:</span>
	<div>
		<input use:melt={$input} placeholder="Best book ever" />
		<div class="chevron-wrapper">
			{#if $open}
				<ChevronUp class="square-4" />
			{:else}
				<ChevronDown class="square-4" />
			{/if}
		</div>
	</div>
</label>

<div class="menu-container" use:melt={$menu}>
	{#if $open}
		<ul class="menu">
			{#each books as book, index (index)}
				<li
					use:melt={$item({
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
					<div>
						<span>{book.title}</span>
						<span class="author">{book.author}</span>
					</div>
				</li>
			{/each}
			{#if $isEmpty}
				<li class="item">No results found</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	label {
		cursor: pointer;
	}

	label > span {
		display: block;
		padding-bottom: 0.25rem;
		text-transform: capitalize;
	}

	label > div {
		position: relative;
	}

	label input {
		display: flex;
		height: 2.5rem;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.375rem;

		background-color: rgb(var(--color-white) / 1);

		padding-left: 0.75rem;
		padding-right: 3rem;

		color: rgb(var(--color-magnum-700) / 1);
	}

	.chevron-wrapper {
		position: absolute;
		right: 0.25rem;
		top: 50%;
		z-index: 10;

		transform: translate(0, -50%);

		color: rgb(var(--color-magnum-700) / 1);
	}

	.menu-container {
		display: flex;
		flex-direction: column;

		z-index: 10;
		max-height: 300px;

		overflow: hidden;

		border-radius: 0.375rem;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		max-height: 100%;

		overflow-y: auto;

		background-color: rgb(var(--color-white) / 1);

		padding: 0.5rem;
	}

	.item {
		position: relative;
		cursor: pointer;
		border-radius: 0.375rem;

		padding: 0.25rem 2rem 0.25rem 1rem;

		color: rgb(var(--color-neutral-800) / 1);
	}

	.item .author {
		display: block;

		font-size: 0.875rem;
		line-height: 1.25rem;

		opacity: 0.7;
	}

	.check {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		color: rgb(var(--color-magnum-500) / 1);
		translate: 0 calc(-50% + 1px);
	}
</style>
