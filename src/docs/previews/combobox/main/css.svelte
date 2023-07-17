<script lang="ts">
	import { createCombobox } from '@melt-ui/svelte';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';
	import ChevronUp from '~icons/lucide/chevron-up';

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

	const { open, input, menu, item, inputValue, isSelected, filteredItems } =
		createCombobox({
			filterFunction: (item, inputValue) => {
				// Example string normalization function. Replace as needed.
				const normalize = (str: string) => str.normalize().toLowerCase();
				const normalizedInput = normalize(inputValue);
				return (
					normalizedInput === '' ||
					normalize(item.title).includes(normalizedInput) ||
					normalize(item.author).includes(normalizedInput)
				);
			},
			items: books,
			itemToString: (item) => item.title,
		});
</script>

<label>
	<span>Choose your favorite book:</span>
	<div>
		<input melt={$input} placeholder="Best book ever" value={$inputValue} />
		<div class="chevron-wrapper">
			{#if $open}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</div>
	</div>
</label>

<div class="menu-container" melt={$menu}>
	<ul class="menu">
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as book, index (index)}
					<li
						melt={$item({
							index,
							item: book,
							disabled: book.disabled,
						})}
						class="item"
					>
						{#if $isSelected(book)}
							<div class="check">
								<Check />
							</div>
						{/if}
						<div>
							<span>{book.title}</span>
							<span class="author">{book.author}</span>
						</div>
					</li>
				{/each}
			{:else}
				<li class="item">No results found</li>
			{/if}
		{/if}
	</ul>
</div>

<style lang="postcss">
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

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		padding-left: 0.75rem;
		padding-right: 3rem;

		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));
	}

	.chevron-wrapper {
		position: absolute;
		right: 0.25rem;
		top: 50%;
		z-index: 10;

		--tw-translate-y: -50%;
		transform: translate(var(--tw-translate-y));

		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));
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

		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255 / var(--tw-bg-opacity));

		padding: 0.5rem;
	}

	.item {
		position: relative;
		cursor: pointer;
		border-radius: 0.375rem;

		padding: 0.25rem 2rem 0.25rem 1rem;

		--tw-text-opacity: 1;
		color: rgb(38 38 38 / var(--tw-text-opacity));
	}

	.item[data-highlighted] {
		--tw-bg-opacity: 1;
		background-color: rgb(254 242 214 / var(--tw-bg-opacity));

		--tw-text-opacity: 1;
		color: rgb(189 87 17 / var(--tw-text-opacity));
	}

	.item[data-disabled] {
		opacity: 0.5;
	}

	.item .author {
		display: block;

		font-size: 0.875rem;
		line-height: 1.25rem;

		opacity: 0.7;
	}

	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
