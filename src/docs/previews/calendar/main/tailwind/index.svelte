<script lang="ts">
	import { createCalendar, melt } from '$lib';
	import { ChevronRight, ChevronLeft } from 'lucide-svelte';
	import LocaleCombobox from './LocaleCombobox.svelte';

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable },
		options: { locale },
	} = createCalendar();
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
				<ChevronLeft size={24} />
			</button>
			<div use:melt={$heading}>
				{$headingValue}
			</div>
			<button use:melt={$nextButton}>
				<ChevronRight size={24} />
			</button>
		</header>
		<div>
			{#each $months as month}
				<table use:melt={$grid}>
					<thead aria-hidden="true">
						<tr>
							{#each $daysOfWeek as day}
								<th>
									<div>
										{day}
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each month.weeks as weekDates}
							<tr>
								{#each weekDates as date}
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
		@apply flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-lg p-4 data-[outside-visible-months]:pointer-events-none data-[outside-visible-months]:cursor-default data-[range-highlighted]:bg-magnum-200 data-[selected]:bg-magnum-300 data-[selected]:text-magnum-900 data-[disabled]:opacity-40 data-[outside-visible-months]:opacity-40 hover:bg-magnum-100 data-[outside-visible-months]:hover:bg-transparent focus:ring focus:ring-magnum-400;
	}

	[data-melt-calendar-cell][data-outside-month='true'][data-outside-visible-months='true'] {
		@apply opacity-0;
	}
</style>
