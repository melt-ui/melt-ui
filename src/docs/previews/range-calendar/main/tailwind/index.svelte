<script lang="ts">
	import { ChevronRight, ChevronLeft } from '$icons/index.js';
	import { melt } from '$lib/index.js';
	import { createRangeCalendar } from '$lib/builders/range-calendar/index.js';
	import LocaleCombobox from './LocaleCombobox.svelte';

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, weekdays },
		helpers: { isDateDisabled, isDateUnavailable },
		options: { locale },
	} = createRangeCalendar();
</script>

<section>
	<LocaleCombobox
		onSelectedChange={({ next }) => {
			if (next) {
				locale.set(next.value);
			}
			return next;
		}}
	/>
	<div use:melt={$calendar}>
		<header>
			<button use:melt={$prevButton}>
				<ChevronLeft />
			</button>
			<div use:melt={$heading}>
				{$headingValue}
			</div>
			<button use:melt={$nextButton}>
				<ChevronRight />
			</button>
		</header>
		<div>
			{#each $months as month}
				<table use:melt={$grid}>
					<thead aria-hidden="true">
						<tr>
							{#each $weekdays as day}
								<th>
									<div>
										{day}
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each month.weeks as dates}
							<tr>
								{#each dates as date}
									<td
										role="gridcell"
										aria-disabled={$isDateDisabled(date) ||
											$isDateUnavailable(date)}
									>
										<div use:melt={$cell(date, month.value)}>
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
</section>

<style lang="postcss">
	[data-melt-calendar] {
		@apply w-full rounded-lg bg-white p-3 text-magnum-800 shadow-sm;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-8;
	}

	[data-melt-calendar-prevbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-nextbutton] {
		@apply rounded-lg p-1 transition-all hover:bg-magnum-100;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold text-magnum-800;
	}

	th {
		@apply text-sm font-semibold text-magnum-800;

		& div {
			@apply flex h-6 w-6 items-center justify-center p-4;
		}
	}

	[data-melt-calendar-grid] {
		@apply w-full;
	}

	[data-melt-calendar-cell] {
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400 data-[outside-month]:pointer-events-none data-[outside-visible-months]:pointer-events-none data-[outside-month]:cursor-default data-[outside-visible-months]:cursor-default data-[highlighted]:bg-magnum-200 data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-month]:opacity-40 data-[outside-visible-months]:opacity-40 data-[outside-month]:hover:bg-transparent data-[outside-visible-months]:hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply opacity-0;
	}

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
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded p-4 hover:bg-magnum-100 focus:ring focus:ring-magnum-400;
	}

	.segment {
		@apply data-[segment="dayPeriod"]:pl-0.5 data-[segment="hour"]:pl-1 data-[segment="timeZoneName"]:pl-1;
	}

	.btn {
		@apply rounded bg-magnum-600 p-1 text-xs text-white;
	}
</style>
