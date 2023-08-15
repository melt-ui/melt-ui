<script lang="ts">
	import {
		createCombobox,
		melt,
		type ComboboxFilterFunction,
	} from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

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
		defaultValue: books[0],
	});
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="block capitalize">Choose your favorite book:</span>
	</label>

	<div class="relative">
		<input
			use:melt={$input}
			class="flex h-10 items-center justify-between rounded-md bg-white
					px-3 pr-12 text-magnum-700"
			placeholder="Best book ever"
		/>
		<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-magnum-700">
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
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-md"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex max-h-full flex-col gap-2 overflow-y-auto bg-white px-2 py-2"
			tabindex="0"
		>
			{#each books as book, index (index)}
				<li
					use:melt={$item({
						value: book,
						label: book.title,
						disabled: book.disabled,
					})}
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800
                        data-[highlighted]:bg-magnum-100 data-[highlighted]:text-magnum-700
                        data-[disabled]:opacity-50"
				>
					{#if $isSelected(book)}
						<div class="check">
							<Check class="square-4" />
						</div>
					{/if}
					<div>
						<span>{book.title}</span>
						<span class="block text-sm opacity-70">{book.author}</span>
					</div>
				</li>
			{/each}
			{#if $isEmpty}
				<li
					class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
                    text-neutral-800 data-[highlighted]:bg-magnum-100
                    data-[highlighted]:text-magnum-700"
				>
					No results found
				</li>
			{/if}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
