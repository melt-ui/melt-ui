---
title: Calendar
description: An accessible calendar for selecting and displaying dates.
---

<script>
	import { Preview, Callout } from '$docs/components'
	import { A } from '$docs/components/markdown';
	export let snippets
	export let previews
</script>

## Overview

The **Calendar** builder enables you to compose a fully accessible calendar for selecting and
displaying dates.

<Callout type="warning">
Before jumping into the docs for this builder, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <A href="/docs/dates">here</A>.
</Callout>

## Anatomy

- **Calendar**: The container of the months and days of the calendar
- **Cell**: A single date in the calendar
- **Grid**: A month in the calendar
- **Previous Button**: A button for navigating to the previous page of the calendar
- **Next Button**: A button for navigating to the next page of the calendar
- **Heading**: A visual heading for the calendar

## Tutorial

The following tutorial is designed to help you get started using the **Calendar** builder. We'll
cover some of the key concepts and features of the builder, and by the end you should have a good
understanding of how to use it.

### Build a Basic Calendar

Let's start by initializing a calendar with the `createCalendar` builder function, and destructuring
everything we'll need to compose it. We'll cover what each of these properties are in more detail as
we go.

```svelte
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>
```

The `calendar` element is the root container for everything in the calendar, and all the other
elements will be contained within it.

```svelte showLineNumbers {11-13}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>

<div use:melt={$calendar}>
	<!-- ... -->
</div>
```

We can now add the header of our calendar, which will contain the `heading` and page navigation
buttons (`prevButton` & `nextButton`).

```svelte showLineNumbers {12-18}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>

<div use:melt={$calendar}>
	<header>
		<button use:melt={$prevButton}> Previous Page </button>
		<div use:melt={$heading}>
			{$headingValue}
		</div>
		<button use:melt={$nextButton}> Next Page</button>
	</header>
</div>
```

Something you may notice is that we aren't using an HTML heading element for the `heading`. This is
because the builder automatically adds an accessible heading to the calendar, which is not visible
to sighted users, and will be the first thing the screen reader will announce when the user
navigates to the calendar. The heading here is strictly for visual purposes.

The `headingValue` state is a string that contains the month and year of the current page of the
calendar. It reacts to changes in the `month` and `year` states, and is formatted according to the
`locale` prop.

Now that we've taken care of the header, we can add the meat of the calendar, which is the month(s)
and their days.

We'll be using the `months` store to iterate over each month being displayed in the calendar, which
defaults to 1 but can be changed with the `numberOfMonths` prop. The `months` store is an array of
`Month` objects, which look like this:

```ts showLineNumbers
export type Month = {
	/**
	 * A `DateValue` used to represent the month. Since days
	 * from the previous and next months are included in the
	 * calendar grid, we need a source of truth for the value
	 * the grid is representing.
	 */
	value: DateValue

	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	weeks: DateValue[][]

	/**
	 * An array of all the dates in the current month, including dates from
	 * the previous and next months that are used to fill out the calendar grid.
	 * This array is useful for rendering the calendar grid in a customizable way,
	 * as it provides all the dates that should be displayed in the grid in a flat
	 * array.
	 */
	dates: DateValue[]
}
```

Since we're taking the recommended approach of rendering the calendar grid using a table, we'll be
using the `weeks` property of each month to render the rows of the table. We'll also use the
`daysOfWeek` state to render the column headers of the table, which is an array of formatted day
names according to the `locale` prop.

```svelte showLineNumbers {19-29}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>

<div use:melt={$calendar}>
	<header>
		<button use:melt={$prevButton}> Previous Page </button>
		<div use:melt={$heading}>
			{$headingValue}
		</div>
		<button use:melt={$nextButton}> Next Page</button>
	</header>
	{#each $months as month}
		<table use:melt={$grid}>
			<thead aria-hidden="true">
				<tr>
					{#each $daysOfWeek as day}
						<th>{day}</th>
					{/each}
				</tr>
			</thead>
		</table>
	{/each}
</div>
```

We're setting the `<thead />` to `aria-hidden="true"`, because the day of the week is already read
by screen readers as they focus each cell in the table, and it isn't useful to have it read twice.

Now we can finish off the calendar by rendering the weeks and days within each week.

```svelte showLineNumbers {28-40}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>

<div use:melt={$calendar}>
	<header>
		<button use:melt={$prevButton}> Previous Page </button>
		<div use:melt={$heading}>
			{$headingValue}
		</div>
		<button use:melt={$nextButton}> Next Page</button>
	</header>
	{#each $months as month}
		<table use:melt={$grid}>
			<thead aria-hidden="true">
				<tr>
					{#each $daysOfWeek as day}
						<th>{day}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each month.weeks as weekDates}
					<tr>
						{#each weekDates as date}
							<td role="gridcell" aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}>
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
```

And that, along with your own styles and markup additions, is all you need to build a functional, fully accessible
calendar component!

I know it may seem like it requires a lot of code to get a calendar up and running, but the functionality that the 43 lines of code above provide is quite powerful, which we'll learn more about in the following sections.

