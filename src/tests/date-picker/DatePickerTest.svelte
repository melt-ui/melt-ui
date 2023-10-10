<script lang="ts">
	import {
		createDatePicker,
		type CreateDateFieldProps,
		type CreateDatePickerProps,
	} from '$lib/builders';
	import { ChevronRight, ChevronLeft, Calendar } from 'lucide-svelte';
	import { melt } from '$lib';
	import { fade } from 'svelte/transition';

	export let value: CreateDatePickerProps['value'] = undefined;
	export let defaultValue: CreateDatePickerProps['defaultValue'] = undefined;
	export let defaultPlaceholderValue: CreateDatePickerProps['defaultPlaceholderValue'] = undefined;
	export let onValueChange: CreateDatePickerProps['onValueChange'] = undefined;
	export let onPlaceholderValueChange: CreateDatePickerProps['onPlaceholderValueChange'] =
		undefined;
	export let unavailable: CreateDatePickerProps['unavailable'] = undefined;
	export let disabled: CreateDatePickerProps['disabled'] = undefined;
	export let fieldDisabled: CreateDatePickerProps['fieldDisabled'] = undefined;
	export let fieldReadOnly: CreateDatePickerProps['fieldReadOnly'] = undefined;
	export let hourCycle: CreateDatePickerProps['hourCycle'] = undefined;
	export let locale: CreateDatePickerProps['locale'] = 'en';
	export let hideTimeZone: CreateDatePickerProps['hideTimeZone'] = undefined;
	export let popoverIds: CreateDatePickerProps['popoverIds'] = undefined;
	export let dateFieldIds: CreateDatePickerProps['dateFieldIds'] = undefined;
	export let calendarIds: CreateDatePickerProps['calendarIds'] = undefined;
	export let granularity: CreateDatePickerProps['granularity'] = undefined;
	export let calendarLabel: CreateDatePickerProps['calendarLabel'] = undefined;
	export let allowDeselect: CreateDatePickerProps['allowDeselect'] = undefined;
	export let numberOfMonths: CreateDatePickerProps['numberOfMonths'] = undefined;
	export let pagedNavigation: CreateDatePickerProps['pagedNavigation'] = undefined;
	export let placeholderValue: CreateDatePickerProps['placeholderValue'] = undefined;
	export let weekStartsOn: CreateDatePickerProps['weekStartsOn'] = undefined;

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
			label,
		},
		states: { value: insideValue, months, headingValue, daysOfWeek, segmentContents, open },
		options: { locale: insideLocale },
	} = createDatePicker({
		value,
		defaultValue,
		defaultPlaceholderValue,
		onValueChange,
		onPlaceholderValueChange,
		unavailable,
		fieldDisabled,
		fieldReadOnly,
		hourCycle,
		locale,
		hideTimeZone,
		granularity,
		dateFieldIds,
		calendarIds,
		popoverIds,
		allowDeselect,
		calendarLabel,
		numberOfMonths,
		pagedNavigation,
		placeholderValue,
		weekStartsOn,
		disabled,
	});
</script>

<main class="flex w-full flex-col items-center gap-3">
	<div class="flex w-full items-center justify-center">
		<p class="text-xs" data-testid="inside-value">{$insideValue}</p>
	</div>
	<div>
		<span use:melt={$label} class="cursor-default text-magnum-800" data-testid="label">Date</span>
		<div
			use:melt={$dateField}
			class="flex w-full max-w-[300px] items-center rounded-md border bg-white p-1.5 text-magnum-800"
			data-testid="field"
		>
			{#each $segmentContents.arr as seg, i (`${i}-${$insideLocale}`)}
				<div
					use:melt={$segment(seg.part)}
					class="segment whitespace-nowrap"
					data-testid={seg.part === 'literal' ? undefined : seg.part}
				>
					{seg.value}
				</div>
			{/each}
			<div class="ml-4 flex w-full items-center justify-end">
				<button use:melt={$trigger} data-testid="trigger" class="rounded bg-magnum-800 p-1">
					<Calendar class="h-4 w-4 text-white" />
				</button>
			</div>
		</div>
	</div>
	<div
		class="z-10 w-80 rounded-[4px] bg-white p-3 shadow-sm"
		transition:fade={{ duration: 100 }}
		use:melt={$content}
	>
		<div class="w-full text-magnum-800" use:melt={$calendar} data-testid="calendar">
			<header class="flex items-center justify-between pb-4">
				<button use:melt={$prevButton} data-testid="prev-button">
					<ChevronLeft />
				</button>
				<h2 class="font-semibold text-magnum-800" use:melt={$heading} data-testid="heading">
					{$headingValue}
				</h2>
				<button use:melt={$nextButton} data-testid="next-button">
					<ChevronRight />
				</button>
			</header>
			{#each $months as month, i (i)}
				{@const { weeks } = month}
				<table use:melt={$grid} class="w-full" data-testid="grid-{i}">
					<thead aria-hidden="true">
						<tr>
							{#each $daysOfWeek as day, idx}
								<th class="text-sm font-semibold text-magnum-800">
									<div
										class="flex h-6 w-6 items-center justify-center p-4"
										data-testid="day-of-week-{idx}"
									>
										{day}
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
										<div
											use:melt={$cell(date)}
											class="cell"
											data-testid="month-{i}-date-{date.day}"
										>
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
</main>

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

	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}
	.segment:not([data-segment='literal']) {
		@apply px-0.5;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
