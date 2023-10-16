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

## Scaffold a Calendar

The following tutorial is designed to help you get started using the **Calendar** builder, and
explain some of the concepts to help you understand how it works.

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

And that, along with your own styles and markup additions, is all you need to build a functional,
fully accessible calendar component!

I know it may seem like it requires a lot of code to get a calendar up and running, but the
functionality that the 43 lines of code above provide is quite powerful, which we'll learn more
about in the following sections.

## Placeholder

In this section, we'll learn about the placeholder props, which are used to change what the calendar
displays when no date is selected.

### Set the Starting Month

The Calendar has two placeholder props, `placeholder` (controlled), and `defaultPlaceholder`
(uncontrolled), which are used to change what is displayed in the calendar when no date is selected.

By default, the placeholder will be set to the current date, but you can override this by passing a
`DateValue` object to the `defaultPlaceholder` prop.

```svelte showLineNumbers {10}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultPlaceholder: new CalendarDate(2021, 2, 1)
	})
</script>
```

<Preview code={snippets.changePh} variant="dark" size="auto">
	<svelte:component this={previews.changePh} />
</Preview>

Now our calendar starts out in February 2021, rather than the current month.

## Values

The Calendar has two value props, `value` (controlled), and `defaultValue` (uncontrolled), which are
used to determine what date is selected in the calendar.

### Setting a Default Value

To have a date selected by default, we can use the `value` (controlled), or `defaultValue`
(uncontrolled) props. If provided, the placeholder props will be set to this value.

```svelte showLineNumbers {10}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultValue: new CalendarDate(2024, 1, 11)
	})
</script>
```

<Preview code={snippets.changeValue} variant="dark" size="auto">
	<svelte:component this={previews.changeValue} />
</Preview>

### Reacting to Value Changes

To react to changes in the selected date, we have a few options available to us. We can pass in our
own value store to the `value` prop, use the `onValueChange`
[change function](/docs/controlled#change-functions), or use the `value` store returned as part of
the `createCalendar` return object.

Which option you choose is up to you, but for the sake of this example, we'll be using the `value`
store returned from `createCalendar`. This is a writable store that will be updated whenever the
selected date changes. It's also the store that the `value` prop uses under the hood, so you can use
it to control the selected date programmatically.

Let's say that when a user selects Halloween (October 31st), we want to display an alert that says
"Happy Halloween!".

```svelte showLineNumbers {3,5,9,15-17}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { CalendarDate, isSameDay } from '@internationalized/date'

	const halloween = new CalendarDate(2023, 10, 31)

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultPlaceholder: new CalendarDate(2023, 10, 1)
	})

	$: if ($value && isSameDay($value, halloween)) {
		alert('Happy Halloween! 🎃')
	}
</script>
```

<Preview code={snippets.reactToVal} variant="dark" size="auto">
	<svelte:component this={previews.reactToVal} />
</Preview>


### Using the Value

The `value` store returned from the `createCalendar` builder is a `DateValue` object with whatever type of date object that was passed via the placeholder or value props, which default to a `CalendarDate` object.

You can use this value to display the selected date in your own markup, or use its value within a form. Although for forms we highly recommend using our [Date Picker](/docs/builders/date-picker), as it is a combination of the Calendar, [Date Field](/docs/builders/date-field), and [Popover](/docs/builders/popover) which makes it more similar to a native date picker, but with a lot more power.


```svelte showLineNumbers {11,13}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar()
</script>

<span>{$value.toString()}</span>
<!-- or -->
<input name="myDate" value={$value.toString()} />
```


## Appearance & Behavior

### Fixed Weeks

If you press the previous button on the example below, you'll notice something that may be
unappealing. The calendar navigates to the previous month, and since that month has an additional
week, the calendar jumps in height.

<Preview code={snippets.changeValue} variant="dark" size="auto">
	<svelte:component this={previews.changeValue} />
</Preview>

You could use CSS to add the extra space to accommodate for such a jump, or you can set the
`fixedWeeks` prop to `true`, which will ensure the calendar always has the same number of weeks,
regardless of the month.

```svelte showLineNumbers {11}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultValue: new CalendarDate(2024, 1, 11),
		fixedWeeks: true
	})
</script>
```

<Preview code={snippets.fixedWeeks} variant="dark" size="auto">
	<svelte:component this={previews.fixedWeeks} />
</Preview>

### Multiple Months

By default, the calendar will display one month, but it supports displaying as many months as you'd
like, using the `numberOfMonths` prop.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		numberOfMonths: 2
	})
</script>
```

<Preview code={snippets.multipleMonths} variant="dark" size="auto">
	<svelte:component this={previews.multipleMonths} />
</Preview>

### Paged Navigation

By default, when the calendar has more than one month, the previous and next buttons will shift the
calendar forward or backward by one month. However, you can change this behavior by setting the
`pagedNavigation` prop to `true`, which will shift the calendar forward or backward by the number of
months being displayed.

```svelte showLineNumbers {10}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		numberOfMonths: 2,
		pagedNavigation: true
	})
</script>
```

<Preview code={snippets.pagedNav} variant="dark" size="auto">
	<svelte:component this={previews.pagedNav} />
</Preview>

### Localization

The calendar will automatically format the content of the calendar according to the `locale` prop,
which defaults to 'en-US', but can be changed to any locale supported by the
[Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
constructor.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		locale: 'de'
	})
</script>
```

<Preview code={snippets.locale} variant="dark" size="auto">
	<svelte:component this={previews.locale} />
</Preview>

### Deselection

By default, users can deselect a selected date without selecting another, by selecting the date
again. This results in the `value` potentially being `undefined`. If you'd like to disable this
behavior, you can set the `preventDeselect` prop to `true`, which will prevent the user from being
able to deselect dates.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		preventDeselect: true
	})
</script>
```

<Preview code={snippets.preventDeselect} variant="dark" size="auto">
	<svelte:component this={previews.preventDeselect} />
</Preview>

### Multiple Selection

Sometimes, you may want to allow the user to select multiple dates in the calendar. To enable this
behavior, you can set the `multiple` prop to `true`.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		multiple: true
	})
</script>
```

<Preview code={snippets.multipleSelect} variant="dark" size="auto">
	<svelte:component this={previews.multipleSelect} />
</Preview>

### Limiting Selected Dates

When allowing users to select multiple dates, you may want to limit the number of dates they can
select. Since this could be handled in a variety of ways, the Calendar doesn't handle this for you,
but does provide the means to do so.

We can use the `onValueChange` [change function](/docs/controlled#change-functions) to limit the
number of selected dates to 3.

In this first example, we're just preventing the user from being able to select another date if
they've already selected 3. They'll need to deselect one of the dates before they can select
another.

```svelte showLineNumbers {11-17}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		multiple: true,
		onValueChange: ({ curr, next }) => {
			if (next && next.length > 3) {
				alert('You can only select 3 dates!')
				return curr
			} else {
				return next
			}
		}
	})
</script>
```

<Preview code={snippets.limitSelectedA} variant="dark" size="auto">
	<svelte:component this={previews.limitSelectedA} />
</Preview>

An alternative, though not sure about the user experience implications, is to automatically deselect
the oldest date when the user selects a new one after they've already selected 3.

```svelte showLineNumbers {11-17}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		multiple: true,
		onValueChange: ({ next }) => {
			if (next && next.length > 3) {
				next.shift()
				return next
			} else {
				return next
			}
		}
	})
</script>
```

<Preview code={snippets.limitSelectedB} variant="dark" size="auto">
	<svelte:component this={previews.limitSelectedB} />
</Preview>

Using [change functions](/docs/controlled#change-functions) is a powerful way to customize the way
your calendar behaves!

## Validation

Although possible to implement your own validation logic using change functions, the Calendar
provides a few props that make it a bit easier.

### Unavailable Dates

An unavailable date is a date that is not selectable, but is still visible and focusable in the
calendar.

You can pass a `Matcher` function to the `isDateUnavailable` prop, which will be used to determine if a
date is unavailable. The `Matcher` function is called with a `DateValue` object, and should return a
boolean indicating whether the date is unavailable.

```svelte showLineNumbers {3,10-12}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { isWeekend } from '@internationalized/date'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		isDateUnavailable: (date) => {
			return isWeekend(date, 'en')
		}
	})
</script>
```

The unavailable dates will have the `data-unavailable` attribute set, which you can use to style
differently than the other dates.

<Preview code={snippets.unavailable} variant="dark" size="auto">
	<svelte:component this={previews.unavailable} />
</Preview>

### Disabled Dates

Disabled dates are not selectable, nor are they focusable in the calendar. Keyboard navigation will
skip over them entirely, and should be used for dates that have no meaning in the context of the
calendar.

You can pass a `Matcher` function to the `isDateDisabled` prop, which will be used to determine if a
date is disabled. The `Matcher` function is called with a `DateValue` object, and should return a
boolean indicating whether the date is disabled.

```svelte showLineNumbers {9-11}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		isDateDisabled: (date) => {
			return date.day <= 10
		}
	})
</script>
```

In this example, we're disabling the first 10 days of each month.

<Preview code={snippets.disabled} variant="dark" size="auto">
	<svelte:component this={previews.disabled} />
</Preview>

### Minimum & Maximum Values

While the `isDateDisabled` prop is useful for more complex logic, the Calendar also provides the
`minValue` and `maxValue` props, which are used to set the min and max selectable dates, which is nice if you're just trying to limit the range of dates that can be selected.

If a date is before the `minValue`, or after the `maxValue`, it will be disabled.

```svelte showLineNumbers {11-12}
<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		defaultPlaceholder: new CalendarDate(2023, 1, 25),
		minValue: new CalendarDate(2023, 1, 15),
		maxValue: new CalendarDate(2023, 2, 15)
	})
</script>
```

<Preview code={snippets.minMax} variant="dark" size="auto">
	<svelte:component this={previews.minMax} />
</Preview>