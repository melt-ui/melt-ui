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

<label class="cursor-pointer">
	<span class="block pb-1 capitalize">Choose your favorite book:</span>
	<div class="relative">
		<input
			melt={$input}
			class="flex h-10 items-center justify-between rounded-md bg-white
            px-3 pr-12 text-magnum-700"
			placeholder="Best book ever"
			value={$inputValue}
		/>
		<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-magnum-700">
			{#if $open}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</div>
	</div>
</label>

<div
	class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
	melt={$menu}
>
	<ul class="flex max-h-full flex-col gap-2 overflow-y-auto bg-white px-2 py-2">
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as book, index (index)}
					<li
						melt={$item({
							index,
							item: book,
							disabled: book.disabled,
						})}
						class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
                        data-[highlighted]:bg-magnum-100 data-[highlighted]:text-magnum-700
                        data-[disabled]:opacity-50"
					>
						{#if $isSelected(book)}
							<div class="check">
								<Check />
							</div>
						{/if}
						<div>
							<span>{book.title}</span>
							<span class="block text-sm opacity-70">{book.author}</span>
						</div>
					</li>
				{/each}
			{:else}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                    text-neutral-800 data-[highlighted]:bg-magnum-100
                    data-[highlighted]:text-magnum-700"
				>
					No results found
				</li>
			{/if}
		{/if}
	</ul>
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
