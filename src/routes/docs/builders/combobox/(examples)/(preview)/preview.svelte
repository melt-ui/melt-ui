<script lang="ts">
	import { createCombobox } from '$lib';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';

	interface Book {
		author: string;
		title: string;
	}

	const books: Book[] = [
		{ author: 'Harper Lee', title: 'To Kill a Mockingbird' },
		{ author: 'Lev Tolstoy', title: 'War and Peace' },
		{ author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
		{ author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
		{ author: 'George Orwell', title: '1984' },
		{ author: 'Jane Austen', title: 'Pride and Prejudice' },
		{ author: 'Marcus Aurelius', title: 'Meditations' },
		{ author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov' },
		{ author: 'Lev Tolstoy', title: 'Anna Karenina' },
		{ author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
	];

	let items = books;

	function getBooksFilter(inputValue: string) {
		const lowerCasedInputValue = inputValue.toLowerCase();

		return function booksFilter(book: Book) {
			return (
				!inputValue ||
				book.title.toLowerCase().includes(lowerCasedInputValue) ||
				book.author.toLowerCase().includes(lowerCasedInputValue)
			);
		};
	}

	const { open, input, menu, option, value } = createCombobox({
		items,
		filterFunction(value) {
			// the store is a super mutable snapshot of books
			items = books.filter(getBooksFilter(value));
		},
		itemToString(item) {
			return item ? item.title : '';
		},
	});

	$: {
		console.log({ items });
	}
</script>

<div>
	<div class="container">
		<label class="label">
			Choose your favorite book:

			<div class="input-container">
				<input
					{...$input}
					value={$value}
					use:input.action
					placeholder="Best book ever"
					class="input"
				/>
				<!-- We must output these at HTML ASCII characters in order for them to render -->
				{$open ? '⬆️' : '⬇️'}
			</div>
		</label>
	</div>
	<ul
		style:--status={!($open && items.length) ? 'visible' : 'visible'}
		class="menu"
		{...$menu}
		use:menu.action
	>
		{#if $open}
			{#each items as item, index (index)}
				<!-- s
			
			{...getItemProps(index)} -->
				<li use:option.action class="option">
					<span>{item.title}</span>
					<span class="item-author">{item.author}</span>
				</li>
			{/each}
		{/if}
	</ul>
</div>

<style lang="postcss">
	.label {
		@apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[360px] flex-col gap-2 overflow-y-auto;
		@apply rounded-md bg-white p-1;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
		@apply focus:bg-magnum-100 focus:text-magnum-700;
	}
	.option[data-highlighted-item] {
		@apply bg-magnum-100;
	}
	.option[data-selected-item] {
		@apply font-bold;
	}
	.input-container {
		@apply flex h-10 w-[360px] items-center justify-between rounded-md bg-white px-3;
		@apply py-2 text-magnum-700;
	}
	.input {
		@apply h-full w-full appearance-none;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
