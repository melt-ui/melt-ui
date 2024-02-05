<script lang="ts">
	import {
		createCombobox,
		melt,
		type CreateComboboxProps,
	} from '$lib/index.js';
	import { Check, ChevronDown, ChevronUp } from '$icons/index.js';
	import { fly } from 'svelte/transition';
	import { localeOptions } from './locales.js';

	// convert locale option object to array
	const localeOptionsArr = Object.entries(localeOptions).map(
		([value, label]) => ({
			value,
			label,
		}),
	);

	export let onSelectedChange: CreateComboboxProps<string>['onSelectedChange'] =
		undefined;
	export let defaultSelected: CreateComboboxProps<string>['defaultSelected'] = {
		value: 'en-US',
		label: 'English (US)',
	};

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		helpers: { isSelected },
	} = createCombobox<string>({
		forceVisible: true,
		onSelectedChange,
		defaultSelected,
	});

	$: if (!$open) {
		$inputValue = $selected?.label ?? '';
	}

	$: _filteredLocales = localeOptionsArr.filter(({ value, label }) => {
		const normalizedInput = $inputValue.toLowerCase();
		return (
			value.toLowerCase().includes(normalizedInput) ||
			label.toLowerCase().includes(normalizedInput)
		);
	});

	$: filteredLocales = $touchedInput ? _filteredLocales : localeOptionsArr;
</script>

<div class="absolute left-4 top-4 hidden lg:block">
	<div class="flex flex-col gap-1">
		<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
		<label use:melt={$label}>
			<span class="text-sm font-medium text-magnum-900">Choose a locale:</span>
		</label>

		<div class="relative">
			<input
				use:melt={$input}
				aria-describedby="disclaimer"
				class="flex h-8 w-full items-center justify-between rounded-lg
			bg-white px-3 pr-4 text-sm text-black"
				placeholder="Choose a locale"
			/>
			<div
				class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-magnum-900"
			>
				{#if $open}
					<ChevronUp class="size-4" />
				{:else}
					<ChevronDown class="size-4" />
				{/if}
			</div>
		</div>
		<div id="disclaimer" class="text-sm text-magnum-900">
			(Not a complete list)
		</div>
	</div>

	{#if $open}
		<ul
			class="force-dark z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
			use:melt={$menu}
			transition:fly={{ duration: 150, y: -5 }}
		>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
				tabindex="0"
			>
				{#each filteredLocales as locale, index (index)}
					<li
						use:melt={$option(locale)}
						class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
				text-sm
				hover:bg-magnum-100 data-[highlighted]:bg-magnum-200
					data-[highlighted]:text-magnum-900 data-[disabled]:opacity-50"
					>
						{#if $isSelected(locale.value)}
							<div class="check absolute left-2 top-1/2 z-10 text-magnum-900">
								<Check class="size-4" />
							</div>
						{/if}
						<div class="pl-4">
							<span class="font-medium">{locale.label}</span>
							<span class="block text-sm opacity-75">{locale.value}</span>
						</div>
					</li>
				{:else}
					<li class="text-sm pl-4 opacity-50">No results found</li>
				{/each}
			</div>
		</ul>
	{/if}
</div>

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2 text-magnum-500;
		translate: 0 calc(-50% + 1px);
	}
</style>
