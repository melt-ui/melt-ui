---
title: Date Picker
description: A date field with a calendar popover for selecting dates.
---

<script>
	import { APIReference, Preview, Callout } from '$docs/components'
	import { A } from '$docs/components/markdown';
	export let snippets
	export let previews
	export let schemas
</script>

## Overview

The **Date Picker** is a combination of the [Date Field](/docs/builders/date-field),
[Calendar](/docs/builders/calendar), and [Popover](/docs/builders/popover). It's fully accessible,
and works with all modern browsers & devices.

<Callout type="warning">
Before jumping into the docs for this builder, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <A href="/docs/dates">here</A>. Additionally, since this builder simply combines other builders, it's recommended that you read the docs for those builders as well.
</Callout>

## Anatomy

- **Field**: The element which contains the date segments
- **Segment**: An individual segment of the date (day, month, year, etc.)
- **Label**: The label for the date field
- **Hidden Input**: A hidden input element containing the value of the field
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

## Scaffold a Date Picker

This section is designed to help you get started with the correct markup for a date picker. Since
it's a combination of three other builders, there are a lot of working parts. This section will help
you understand how to bring them all together, though it's highly recommended you read the docs for
the [Date Field](/docs/builders/date-field), [Calendar](/docs/builders/calendar), and
[Popover](/docs/builders/popover) builders as well.

Let's start by initializing our date picker using the `createDatePicker` function and destructuring
the pieces we need:

```svelte showLineNumbers
<script lang="ts">
	import { createDatePicker } from '@melt-ui/svelte'

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
			segment,
			trigger
		},
		states: { months, headingValue, weekdays, segmentContents },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createDatePicker()
</script>
```

Next, we can setup our field. Notice that in addition to the segments that we normally add to a
[Date Field](/docs/builders/date-field), we also add a trigger button for the
[Popover](/docs/builders/popover).

```svelte showLineNumbers
<span use:melt={$label}>Appointment Date</span>
<div use:melt={$field}>
	{#each $segmentContents as seg}
		<div use:melt={$segment(seg.part)}>
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
[Popover](/docs/builders/popover)'s content.

```svelte showLineNumbers
<span use:melt={$label}>Appointment Date</span>
<div use:melt={$field}>
	{#each $segmentContents as seg}
		<div use:melt={$segment(seg.part)}>
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
								{day}
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
picker.

## Placeholder

In this section, we'll learn about the placeholder props, which are used to change what type of
value the field represents, and what day the calendar displays when no date is selected.

<Callout>
	To learn more about how the placeholder affects the different parts of the date picker, checkout the placeholders docs for the <A href="/docs/builders/date-field">Date Field</A> & <A href="/docs/builders/calendar">Calendar</A> builders.
</Callout>

### Set the Placeholder Date

The Date Picker has two placeholder props, `placeholder` (controlled), and `defaultPlaceholder`
(uncontrolled), which are used to change how the field segments are rendered, and what is first
displayed in the calendar when no date is selected.

By default, the placeholder will be set to a `CalendarDate` object with current date (and no time),
but you can override this by passing any `DateValue` object to the `defaultPlaceholder` prop.

Below, we'll set the placeholder to a `CalendarDateTime` object representing February 1st, 2021.

```svelte showLineNumbers {8}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'
	import { CalendarDateTime } from '@internationalized/date'

	const {
		/* ... */
	} = createDatePicker({
		defaultPlaceholder: new CalendarDateTime(2021, 2, 1)
	})
</script>
```

Although we didn't include a time when instantiating the `CalendarDateTime` object, the builder is
smart enough to know that the date picker should represent a date and a time, and will render the
appropriate segments.

When a time isn't included with a `CalendarDateTime` object, the time will default to `00:00:00.000`
on that date.

<Preview code={snippets.defaultPh} variant="dark" size="sm">
	<svelte:component this={previews.defaultPh} />
</Preview>

## Values

The Date Picker has two value props, `value` (controlled), and `defaultValue` (uncontrolled), which
are used to determine what date the field is populated with, and what day is selected in the
calendar popover.

### Setting a Default Value

To have a date selected by default, we can use either value prop. Below, we'll set the
`defaultValue` to a `CalendarDate` of January 11, 2024.

```svelte showLineNumbers {8}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
	} = createDatePicker({
		defaultValue: new CalendarDate(2024, 1, 11)
	})
</script>
```

And as the example below demonstrates, the field is populated with the date, and the calendar has
that date selected.

<Preview code={snippets.defaultValue} variant="dark" size="sm">
	<svelte:component this={previews.defaultValue} />
</Preview>

### Using the Value Store

The `value` store returned from the `createDatePicker` function is a writable store containing a
`DateValue` object with whatever type of date was passed via the placeholder or value props.

You can use this value to display the selected date in your markup somewhere, or to perform some
action when the value changes.

```svelte showLineNumbers {7,13}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
		states: { value /* ... */ }
	} = createDatePicker({
		defaultValue: new CalendarDate(2024, 1, 11)
	})
</script>

<span>You Selected: {$value}</span>
```

<Preview code={snippets.usingValue} variant="dark" size="sm">
	<svelte:component this={previews.usingValue} />
</Preview>

## Usage with Forms

It's likely that you'll want to use the Date Picker in an HTML form, and to do that, you'll want to
use the `hiddenInput` element that's returned from the `createDatePicker` function.

The `hiddenInput` element is a hidden input element that contains an ISO 8601 string of the value of
the field, and is updated whenever the value changes.

If you do plan on using the `hiddenInput`, ensure that you set the `name` prop, as it will be used
as the name of the input element.

```svelte showLineNumbers {6,8,24}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
		elements: { hiddenInput /* ... */ }
	} = createDatePicker({
		name: 'appointmentDate'
	})
</script>

<span use:melt={$label}>Appointment Date</span>
<div use:melt={$field}>
	{#each $segmentContents as seg}
		<div use:melt={$segment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<div>
		<button use:melt={$trigger}>
			<span>Open Calendar</span>
		</button>
	</div>
	<input use:melt={$hiddenInput} />
</div>
```

## Appearance & Behavior

### Fixed Weeks

By default, the calendar will render as many weeks as it needs to display all of the days in that
month. However, if you want the calendar to always render the maximum number of weeks (6), you can
set the `fixedWeeks` prop to `true`.

```svelte showLineNumbers {7}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
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
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
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
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
		numberOfMonths: 2,
		pagedNavigation: true
	})
</script>
```

<Preview code={snippets.pagedNav} variant="dark" size="sm">
	<svelte:component this={previews.pagedNav} />
</Preview>

### Localization

The date picker will automatically format the content of the field & calendar according to the
`locale` prop, which defaults to 'en-US', but can be changed to any locale supported by the
[Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
constructor.

```svelte showLineNumbers {7}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
		locale: 'es'
	})
</script>
```

<Preview code={snippets.locale} variant="dark" size="sm">
	<svelte:component this={previews.locale} />
</Preview>

### Prevent Deselection

By default, users can deselect a selected date without selecting another, by selecting the date
again. This results in the `value` potentially being `undefined`. If you'd like to disable this
behavior, you can set the `preventDeselect` prop to `true`, which will prevent the user from being
able to deselect dates.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
		preventDeselect: true
	})
</script>
```

Now the user is unable to deselect a date without selecting another in the calendar. Note, the user
can still clear the field by deleting the value in the field, this only handles the calendar
behavior.

<Preview code={snippets.preventDeselect} variant="dark" size="sm">
	<svelte:component this={previews.preventDeselect} />
</Preview>

## Validation

Although possible to implement your own logic using
[change functions](/docs/controlled#change-functions), the Date Picker provides a few props that
make it a bit easier.

### Unavailable Dates

An unavailable date is a date that is not selectable, but is still visible and focusable in the
calendar.

You can pass a `Matcher` function to the `isDateUnavailable` prop, which will be used to determine
if a date is unavailable. The `Matcher` function is called with a `DateValue` object, and should
return a boolean indicating whether the date is unavailable.

```svelte showLineNumbers {9}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'
	import { isWeekend } from '@internationalized/date'

	const {
		/* ... */
	} = createDatePicker({
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

```svelte showLineNumbers {9}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'

	const {
		/* ... */
	} = createDatePicker({
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

While the `isDateDisabled` prop is useful for more complex logic, the Date Picker also provides the
`minValue` and `maxValue` props, which are used to set the min and max selectable dates, which is
nice if you're just trying to limit the range of dates that can be selected.

If a date is before the `minValue`, or after the `maxValue`, it will be disabled.

```svelte showLineNumbers {8-9}
<script lang="ts">
	import { createDatePicker, melt } from '@melt-ui/svelte'
	import { CalendarDate } from '@internationalized/date'

	const {
		/* ... */
	} = createDatePicker({
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
