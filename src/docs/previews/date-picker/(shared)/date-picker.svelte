<script lang="ts">
	import {
		createDatePicker,
		type CreateDatePickerProps,
		type Matcher,
	} from '$lib/builders';
	import { ChevronRight, ChevronLeft, Calendar } from 'lucide-svelte';
	import { melt } from '$lib';
	import { fade } from 'svelte/transition';
	import { getLocalTimeZone } from '@internationalized/date';

	export let disabled: Matcher | Matcher[] = false;
	export let defaultPlaceholderValue: CreateDatePickerProps['defaultPlaceholderValue'] =
		undefined;
	export let numberOfMonths: CreateDatePickerProps['numberOfMonths'] = 1;
	export let pagedNavigation: CreateDatePickerProps['pagedNavigation'] = false;
	export let weekStartsOn: CreateDatePickerProps['weekStartsOn'] = 0;
	export let fixedWeeks: CreateDatePickerProps['fixedWeeks'] = false;
	// export let locale: CreateDatePickerProps['locale'] = 'en';

	const {
		elements: {
			calendar,
			heading,
			grid,
			cell,
			dateField,
			prevButton,
			nextButton,
			segment,
			trigger,
			content,
		},
		states: { value, months, headingValue, daysOfWeek, segmentContents, open },
		options: { granularity, locale },
	} = createDatePicker({
		allowDeselect: true,
		disabled,
		defaultPlaceholderValue,
		numberOfMonths,
		pagedNavigation,
		weekStartsOn,
		fixedWeeks,
		hourCycle: 12,
		forceVisible: true,
		locale: 'en',
		granularity: 'minute',
	});

	function getDayOfWeek(date: Date) {
		return new Intl.DateTimeFormat($locale, { weekday: 'narrow' }).format(date);
	}
</script>

<div class="flex w-full flex-col items-center gap-3">
	<div class="flex items-center gap-2">
		<button class="btn" on:click={() => locale.set('en')}>EN</button>
		<button class="btn" on:click={() => locale.set('en-UK')}>EN-UK</button>
	</div>
	<div class="flex w-full items-center justify-center">
		<p class="text-xs">{$value}</p>
	</div>
	<div
		use:melt={$dateField}
		class="flex max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
	>
		{#each $segmentContents.arr as seg}
			<div use:melt={$segment(seg.part)}>
				{seg.value}
			</div>
		{/each}
		<div class="ml-4 flex w-full items-center justify-end">
			<button use:melt={$trigger} class="rounded bg-magnum-800 p-1">
				<Calendar class="h-4 w-4 text-white" />
			</button>
		</div>
	</div>
	{#if $open}
		<div
			class="z-10 w-80 rounded-[4px] bg-white p-3 shadow-sm"
			transition:fade={{ duration: 100 }}
			use:melt={$content}
		>
			<div class="w-full text-magnum-800" use:melt={$calendar}>
				<header class="flex items-center justify-between pb-4">
					<button use:melt={$prevButton}>
						<ChevronLeft />
					</button>
					<h2 class="font-semibold text-magnum-800" use:melt={$heading}>
						{$headingValue}
					</h2>
					<button use:melt={$nextButton}>
						<ChevronRight />
					</button>
				</header>
				{#each $months as month}
					{@const { weeks } = month}
					<table use:melt={$grid} class="w-full">
						<thead aria-hidden="true">
							<tr>
								{#each $daysOfWeek as date}
									<th class="text-sm font-semibold text-magnum-800">
										<div class="flex h-6 w-6 items-center justify-center p-4">
											{getDayOfWeek(date.toDate(getLocalTimeZone()))}
										</div>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each weeks as days}
								<tr>
									{#each days as date}
										<td role="gridcell">
											<div use:melt={$cell(date)} class="cell">
												{date.day}
											</div>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.input {
		@apply flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		@apply ring-offset-magnum-300 focus-visible:ring;
		@apply focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		@apply flex-1 items-center justify-center;
		@apply px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		@apply inline-flex w-64 items-center  justify-center rounded bg-white p-0 px-2 py-1 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		@apply absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		@apply bg-white p-0 text-sm font-medium;
	}

	.button {
		@apply flex h-6 w-6 items-center justify-center rounded-full;
		@apply text-magnum-900 transition-colors hover:bg-magnum-500/10;
		@apply focus-visible:ring-1 focus-visible:ring-magnum-400;
		@apply bg-white p-0 text-sm font-medium;
	}

	.content {
		@apply z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}

	.buttons-wrapper {
		@apply flex items-center justify-between border-y border-magnum-700 py-1;
	}

	.cell {
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-month]:pointer-events-none data-[outside-month]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[disabled]:opacity-40 data-[outside-month]:opacity-40 data-[outside-month]:hover:bg-transparent;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
