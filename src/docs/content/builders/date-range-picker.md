---
title: Date Range Picker
description: Select a range of dates in a calendar.
---

<script>
	import { APIReference, Preview, Callout } from '$docs/components'
	import { A } from '$docs/components/markdown';
	export let snippets
	export let previews
	export let schemas
</script>

## Overview

The **Date Range Picker** is a combination of the
[Date Range Field](/docs/builders/date-range-field),
[Range Calendar](/docs/builders/range-calendar), and [Popover](/docs/builders/popover). It's fully
accessible, and works with all modern browsers & devices.

<Callout type="warning">
Before jumping into the docs for this builder, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <A href="/docs/dates">here</A>. Additionally, since this builder simply combines other builders, it's recommended that you read the docs for those builders as well.
</Callout>

## Anatomy

- **Field**: The element which contains the date segments
- **Start Segment**: An individual segment of the start date (day, month, year, etc.)
- **End Segment**: An individual segment of the end date (day, month, year, etc.)
- **Label**: The label for the date field
- **Start Hidden Input**: A hidden input element containing the ISO 8601 formatted string of the
  start date
- **End Hidden Input**: A hidden input element containing the ISO 8601 formatted string of the end
  date
- **Validation**: The container for the validation message
- **Calendar**: The container of the months and days of the calendar
- **Cell**: A single date in the calendar
- **Grid**: A month in the calendar
- **Previous Button**: A button for navigating to the previous page of the calendar
- **Next Button**: A button for navigating to the next page of the calendar
- **Heading**: A visual heading for the calendar
- **Trigger**: The button which opens/closes the popover.
- **Content**: Contains the content within the popover
- **Arrow**: An optional arrow component

## Scaffold a Date Range Picker

This section is designed to help you get started with the correct markup for a Date Range Picker.
Since it's a combination of three other builders, there are a lot of working parts. This section
will help you understand how to bring them all together, though it's highly recommended you read the
docs for the [Date Field](/docs/builders/date-field), [Calendar](/docs/builders/calendar), and
[Popover](/docs/builders/popover) builders as well.

Let's start by initializing our Date Range Picker using the `createDateRangePicker` function and
destructuring the pieces we need:

```svelte showLineNumbers
<script lang="ts">
	import { createDateRangePicker } from '@melt-ui/svelte'
	const {
		elements: {
			calendar,
			cell,
			content,
			field,
			grid,
			heading,
			label,
			nextButton,
			prevButton,
			startSegment,
			endSegment,
			trigger
		},
		states: { months, headingValue, weekdays, segmentContents },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createDateRangePicker()
</script>
```

Next, we can setup our field. Notice that in addition to the segments that we normally add to a
[Date Range Field](/docs/builders/date-range-field), we also add a trigger button for the
[Popover](/docs/builders/popover).

```svelte showLineNumbers
<span use:melt={$label}>Hotel Nights</span>
<div use:melt={$field}>
	{#each $segmentContents.start as seg}
		<div use:melt={$startSegment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<div aria-hidden="true">-</div>
	{#each $segmentContents.end as seg}
		<div use:melt={$endSegment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<div>
		<button use:melt={$trigger}>
			<span>Open Calendar</span>
		</button>
	</div>
</div>
```

Once that's in place, we can setup our calendar, which will be contained within the
[Popover](/docs/builders/popover)'s `content`.

```svelte showLineNumbers
<span use:melt={$label}>Hotel Nights</span>
<div use:melt={$field}>
	{#each $segmentContents.start as seg}
		<div use:melt={$startSegment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<div aria-hidden="true">-</div>
	{#each $segmentContents.end as seg}
		<div use:melt={$endSegment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<div>
		<button use:melt={$trigger}>
			<span>Open Calendar</span>
		</button>
	</div>
</div>
<div use:melt={$content}>
	<div use:melt={$calendar}>
		<header>
			<button use:melt={$prevButton}>
				<span>Previous Month</span>
			</button>
			<div use:melt={$heading}>
				{$headingValue}
			</div>
			<button use:melt={$nextButton}>
				<span>Next Month</span>
			</button>
		</header>
		{#each $months as month}
			<table use:melt={$grid}>
				<thead aria-hidden="true">
					<tr>
						{#each $weekdays as day}
							<th>
								{$day}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each month.weeks as days}
						<tr>
							{#each days as date}
								<td
									role="gridcell"
									aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}>
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
```

And with those pieces in place, we just need to add some styles and we have a fully functional date
range picker.

## Placeholder

In this section, we'll learn about the placeholder props, which are used to change what type of
value the field represents, and what day the calendar displays when no date is selected.

<Callout>
	To learn more about how the placeholder affects the different parts of the Date Range Picker, checkout the placeholders docs for the <A href="/docs/builders/date-range-field">Date Range Field</A> & <A href="/docs/builders/range-calendar">Range Calendar</A> builders.
</Callout>

### Set the Placeholder Date

The Date Range Picker has two placeholder props, `placeholder` (controlled), and
`defaultPlaceholder` (uncontrolled), which are used to change how the field segments are rendered,
and what is first displayed in the calendar when no date is selected.

By default, the placeholder will be set to a `CalendarDate` object with current date (and no time),
but you can override this by passing any `DateValue` object to the `defaultPlaceholder` prop.

Below, we'll set the placeholder to a `CalendarDateTime` object representing February 1st, 2021.

```svelte showLineNumbers {8}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'
	import { CalendarDateTime } from '@internationalized/date'

	const {
		/* ... */
	} = createDateRangePicker({
		defaultPlaceholder: new CalendarDateTime(2021, 2, 1)
	})
</script>
```

Although we didn't include a time when instantiating the `CalendarDateTime` object, the builder is
smart enough to know that the Date Range Picker should represent a date and a time, and will render
the appropriate segments.

When a time isn't included with a `CalendarDateTime` object, the time will default to `00:00:00.000`
on that date.

<Preview code={snippets.defaultPh} variant="dark" size="sm">
	<svelte:component this={previews.defaultPh} />
</Preview>

## Values

The Date Range Picker has two value props, `value` (controlled), and `defaultValue` (uncontrolled),
which are used to determine what date the field is populated with, and what day is selected in the
calendar popover.

### Setting a Default Value

To have a date selected by default, we can use the `value` (controlled), or `defaultValue`
(uncontrolled) props. If provided, the placeholder props will be set to this value.

The `value` is a `DateRange` object, which consists of a `start` and `end` property, each of which
can be a `DateValue` object.

```ts showLineNumbers
type DateRange = {
	start: DateValue
	end: DateValue
}
```

```svelte showLineNumbers {8-11}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
	} = createDateRangePicker({
		defaultValue: {
			start: new CalendarDate(2024, 1, 11),
			end: new CalendarDate(2024, 1, 15)
		}
	})
</script>
```

<Preview code={snippets.defaultValue} variant="dark" size="sm">
	<svelte:component this={previews.defaultValue} />
</Preview>

### Using the Value Store

The `value` store returned from the `createDateRangePicker` function is a writable store containing
a `DateRange` object with a `start` and `end` value of whatever type of date was passed via the
placeholder or value props.

You can use this value to display the selected date in your markup somewhere, or to perform some
action when the value changes.

```svelte showLineNumbers {7,9-12}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
		states: { value /* ... */ }
	} = createDateRangePicker({
		defaultValue: {
			start: new CalendarDate(2024, 1, 11),
			end: new CalendarDate(2024, 1, 15)
		}
	})
</script>

<span>You Selected: {$value.start} - {$value.end}</span>
```

<Preview code={snippets.usingValue} variant="dark" size="sm">
	<svelte:component this={previews.usingValue} />
</Preview>

## Usage with Forms

It's likely that you'll want to use the Date Range Picker in an HTML form, and to do that, you'll
want to use the `startHiddenInput` & `endHiddenInput` elements that are returned from the
`createDateRangePicker` function.

These elements contain an ISO 8601 string of the value of the field, and is updated whenever the
value changes.

If you do plan on using the the hidden inputs, ensure that you set the `startName` and `endName`
props, as they will be used as the name of the input elements.

```svelte showLineNumbers {6,8-9,13-14}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
		elements: { startHiddenInput, endHiddenInput /* ... */ }
	} = createDateRangePicker({
		startName: 'checkIn',
		endName: 'checkOut'
	})
</script>

<input use:melt={$startHiddenInput} />
<input use:melt={$endHiddenInput} />
```

## Appearance & Behavior

### Fixed Weeks

By default, the calendar will render as many weeks as it needs to display all of the days in that
month. However, if you want the calendar to always render the maximum number of weeks (6), you can
set the `fixedWeeks` prop to `true`.

```svelte showLineNumbers {7}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDateRangePicker({
		fixedWeeks: true
	})
</script>
```

Now, regardless of the month, the calendar will always render 6 weeks, so there isn't a jump in the
UI when navigating between different sized months.

<Preview code={snippets.fixedWeeks} variant="dark" size="sm">
	<svelte:component this={previews.fixedWeeks} />
</Preview>

### Multiple Months

By default, the calendar will display one month, but you can change this by setting the
`numberOfMonths` prop.

```svelte showLineNumbers {7}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDateRangePicker({
		numberOfMonths: 2
	})
</script>
```

<Preview code={snippets.multipleMonths} variant="dark" size="sm">
	<svelte:component this={previews.multipleMonths} />
</Preview>

### Paged Navigation

By default, when the calendar has more than one month, the previous and next buttons will shift the
calendar forward or backward by one month. However, you can change this behavior by setting the
`pagedNavigation` prop to `true`, which will shift the calendar forward or backward by the number of
months being displayed.

```svelte showLineNumbers {8}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDateRangePicker({
		numberOfMonths: 2,
		pagedNavigation: true
	})
</script>
```

<Preview code={snippets.pagedNav} variant="dark" size="sm">
	<svelte:component this={previews.pagedNav} />
</Preview>

### Localization

The Date Range Picker will automatically format the content of the field & calendar according to the
`locale` prop, which defaults to 'en-US', but can be changed to any locale supported by the
[Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
constructor.

```svelte showLineNumbers {7}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDateRangePicker({
		locale: 'es'
	})
</script>
```

<Preview code={snippets.locale} variant="dark" size="sm">
	<svelte:component this={previews.locale} />
</Preview>

## Validation

Although possible to implement your own logic using
[change functions](/docs/controlled#change-functions), the Date Range Picker provides a few props
that make it a bit easier.

### Unavailable Dates

An unavailable date is a date that is not selectable, but is still visible and focusable in the
calendar.

You can pass a `Matcher` function to the `isDateUnavailable` prop, which will be used to determine
if a date is unavailable. The `Matcher` function is called with a `DateValue` object, and should
return a boolean indicating whether the date is unavailable.

```svelte showLineNumbers {8-10}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'
	import { isWeekend } from '@internationalized/date'

	const {
		/* ... */
	} = createDateRangePicker({
		isDateUnavailable: (date) => {
			return isWeekend(date, 'en')
		}
	})
</script>
```

The unavailable dates will have the `data-unavailable` attribute set, which you can use to style
differently than the other dates.

<Preview code={snippets.unavailable} variant="dark" size="sm">
	<svelte:component this={previews.unavailable} />
</Preview>

### Disabled Dates

Disabled dates are not selectable, nor are they focusable in the calendar. Keyboard navigation will
skip over them entirely, and should be used for dates that have no meaning in the context of the
calendar.

You can pass a `Matcher` function to the `isDateDisabled` prop, which will be used to determine if a
date is disabled. The `Matcher` function is called with a `DateValue` object, and should return a
boolean indicating whether the date is disabled.

```svelte showLineNumbers {8-10}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDateRangePicker({
		isDateDisabled: (date) => {
			return date.day <= 10
		}
	})
</script>
```

In this example, we're disabling the first 10 days of each month.

<Preview code={snippets.disabled} variant="dark" size="sm">
	<svelte:component this={previews.disabled} />
</Preview>

### Minimum & Maximum Values

While the `isDateDisabled` prop is useful for more complex logic, the Date Range Picker also
provides the `minValue` and `maxValue` props, which are used to set the min and max selectable
dates, which is nice if you're just trying to limit the range of dates that can be selected.

If a date is before the `minValue`, or after the `maxValue`, it will be disabled.

```svelte showLineNumbers {8-9}
<script lang="ts">
	import { createDateRangePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
	} = createDateRangePicker({
		minValue: new CalendarDate(2023, 1, 15),
		maxValue: new CalendarDate(2023, 2, 15)
	})
</script>
```

<Preview code={snippets.minMax} variant="dark" size="sm">
	<svelte:component this={previews.minMax} />
</Preview>

## API Reference

<APIReference {schemas} />
