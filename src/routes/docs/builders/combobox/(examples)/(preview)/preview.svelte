<script lang="ts">
	import { createCombobox } from '$lib';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';
	import ChevronUp from '~icons/lucide/chevron-up';

	interface Book {
		author: string;
		title: string;
		disabled: boolean;
	}

	let books: Book[] = [
		{ author: 'Harper Lee', title: 'To Kill a Mockingbird', disabled: false },
		{ author: 'Lev Tolstoy', title: 'War and Peace', disabled: false },
		{ author: 'Fyodor Dostoyevsy', title: 'The Idiot', disabled: true },
		{ author: 'Oscar Wilde', title: 'A Picture of Dorian Gray', disabled: false },
		{ author: 'George Orwell', title: '1984', disabled: false },
		{ author: 'Jane Austen', title: 'Pride and Prejudice', disabled: false },
		{ author: 'Marcus Aurelius', title: 'Meditations', disabled: false },
		{ author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov', disabled: false },
		{ author: 'Lev Tolstoy', title: 'Anna Karenina', disabled: false },
		{ author: 'Fyodor Dostoevsky', title: 'Crime and Punishment', disabled: false },
	];

	const { open, input, menu, option, inputValue, isSelected, filteredItems } = createCombobox({
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

<div>
	<div class="container">
		<label class="label">
			<span class="label-description">Choose your favorite book:</span>
			<div class="input-container">
				<input
					{...$input}
					class="input"
					placeholder="Best book ever"
					use:input.action
					value={$inputValue}
				/>
				<div class="input-icon">
					{#if $open}
						<ChevronUp />
					{:else}
						<ChevronDown />
					{/if}
				</div>
			</div>
		</label>
	</div>
	<ul class="menu" {...$menu} use:menu.action>
		{#if $open}
			{#if $filteredItems.length !== 0}
				{#each $filteredItems as item, index (index)}
					<li
						{...$option({ index, item, disabled: item.disabled })}
						use:option.action
						class="option"
					>
						{#if $isSelected(item)}
							<div class="check">
								<Check />
							</div>
						{/if}
						<div>
							<span>{item.title}</span>
							<span class="item-author">{item.author}</span>
						</div>
					</li>
				{/each}
			{:else}
				<li class="option">No results found</li>
			{/if}
		{/if}
	</ul>
</div>

<style lang="postcss">
	.label {
		@apply cursor-pointer text-neutral-800;
	}
	.label-description {
		@apply block pb-1 font-semibold capitalize text-neutral-800;
	}
	.menu {
		@apply z-10 flex max-h-[360px] flex-col gap-2 overflow-y-auto;
		@apply rounded-md bg-white p-1;
	}
	.option {
		@apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
	}
	.option[data-highlighted] {
		@apply bg-magnum-100 text-magnum-700;
	}
	.input-container {
		@apply relative;
	}
	.input {
		@apply flex h-10 w-[360px] items-center justify-between rounded-md bg-white px-3 pr-12;
	}
	.input-icon {
		@apply absolute right-1 top-1/2 z-10 -translate-y-1/2;
	}
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
