<script lang="ts">
	import { createCombobox } from '$lib';
	import Check from '~icons/lucide/check';
	import ChevronDown from '~icons/lucide/chevron-down';
	import ChevronUp from '~icons/lucide/chevron-up';

	interface Book {
		author: string;
		title: string;
	}

	let books: Book[] = [
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

	// Approaches
	// 1. `updateList` **
	// 2. originalItems *
	// 3. return original as the store (the filterfunction would need to be rerun) ***
	const { open, input, menu, option, value, isSelected, updateList, filteredItems, originalItems } =
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
			itemToString(item) {
				return item ? item.title : '';
			},
		});
</script>

<div>
	<button
		on:click={() => {
			originalItems.update((value) => {
				return value.concat([{ author: 'Paula Deen', title: '50 shades of gravy' }]);
			});
		}}>Add</button
	>
	<div class="container">
		<label class="label">
			<span class="label-description">Choose your favorite book:</span>
			<div class="input-container">
				<input
					{...$input}
					value={$value}
					use:input.action
					placeholder="Best book ever"
					class="input"
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
			{#each $filteredItems as item, index (index)}
				<li {...$option({ index })} use:option.action class="option">
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
			<!-- This doesn't work because getNextIndex is based on $filteredItems.length -->
			<li {...$option({ index: $filteredItems.length + 1 })} use:option.action class="option">
				Dangboi
			</li>
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
	.option[data-highlighted='true'] {
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
