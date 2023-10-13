---
title: Date Field
description: An enhanced alternative to a native date input.
---

<script>
	import { Preview, Callout } from '$docs/components'
	import { C } from '$docs/components/markdown'
	export let snippets
	export let previews
</script>

## Overview

The **Date Field** is an enhanced alternative to the rather limited native date input. It provides a
more user-friendly interface for selecting dates and times, is fully accessible, and works in all
modern browsers & devices.

It's _very_ heavily inspired by the research and work done by the
[React Aria](https://react-spectrum.adobe.com/react-aria/) team at Adobe, who we believe have
created the most robust date components in terms of accessibility, user experience, and flexibility.

<Callout type="warning">
Before jumping into the docs for this builder, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <a href="/docs/dates-and-times" target="_blank" class="underline">here</a>.
</Callout>

## Anatomy

```svelte
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label },
		states: { value, segmentContents }
	} = createDateField()
</script>

<span use:melt={$label}>Due Date</span>
<div use:melt={$dateField}>
	{#each $segmentContents.arr as seg, i (i)}
		<div use:melt={$segment(seg.part)}>
			{seg.value}
		</div>
	{/each}
</div>
```

- **dateField**: The element which contains the date segments
- **segment**: An individual segment of the date (day, month, year, etc.)
- **label**: The label for the date field

## Tutorial

Learn how to use the Date Field in just a few minutes. We'll start off by creating a simple date
field, and work our way up to building a more complex one, while learning about the different
features and concepts along the way.

### Build a Simple Date Field

Let's initialize a new Date Field using the `createDateField` function, which returns an object
consisting of the stores & methods needed to construct the field.

To start off, we'll destructure the `dateField`, `segment`, and `label`, and `segmentContents`.

```svelte
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label },
		states: { segmentContents }
	} = createDateField()
</script>
```

The `dateField` is responsible for containing the date segments. The `label` for the date field is
not an actual `<label>` element, due to the way we interact with the field, but is still accessible
to screen readers in the same way.

```svelte
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label },
		states: { segmentContents }
	} = createDateField()
</script>

<span use:melt={$label}>Appointment Date</span>
<div use:melt={$dateField}>
	<!-- ... -->
</div>
```

Unlike the other _elements_, `segment` is a function which takes a `SegmentPart` as an argument,
which is used to determine which segment this element represents.

While it's possible to use the `segment` function to render each segment individually like so:

```svelte
<span use:melt={$label}>Appointment Date</span>
<div use:melt={$dateField}>
	<div use:melt={$segment('day')}>
		<!-- ... -->
	</div>
	<div use:melt={$segment('month')}>
		<!-- ... -->
	</div>
	<div use:melt={$segment('year')}>
		<!-- ... -->
	</div>
	<!-- ...rest -->
</div>
```

It's not recommended, as the formatting doesn't adapt to the locale and type of date being
represented, which is one of the more powerful features this builder provides.

Instead, you can use the `segmentContents` state, which is an array of objects necessary to form the
date. Each object has a <C>part</C> property, which is the `SegmentPart` of the segment, and a
<C>value</C> property, which is the locale-aware string representation of the segment.

```svelte {11-15}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label },
		states: { segmentContents }
	} = createDateField()
</script>

<span use:melt={$label}>Appointment Date</span>
<div use:melt={$dateField}>
	{#each $segmentContents as seg, i (i)}
		<div use:melt={$segment(seg.part)}>
			{seg.value}
		</div>
	{/each}
</div>
```

To actually use the value of the form, you can either use the `value` state directly, or if you're
using it within a form, the `hiddenInput` element, which is a hidden input element containing an ISO
8601 formatted string of the `value`.

If you plan on using the `hiddenInput`, you'll need to pass the `name` prop to the `dateField`
element, which will be used as the name of the input.

```svelte {4-5,7,19,23-25}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
	})
</script>

<form method="POST">
	<span use:melt={$label}>Appointment Date</span>
	<div use:melt={$dateField}>
		{#each $segmentContents as seg, i (i)}
			<div use:melt={$segment(seg.part)}>
				{seg.value}
			</div>
		{/each}
		<input use:melt={$hiddenInput} />
	</div>
	<p>
		You selected:
		{#if $value}
			{$value}
		{/if}
	</p>
</form>
```

And that, along with some additional structure and styles, is all you need to get a fully functional
Date Field!

<Preview code={snippets.tut1}>
	<svelte:component this={previews.tut1} />
</Preview>

### The Power of Placeholder

In the previous example, we didn't pass any props to the `createDateField` function, which means it
defaulted to a `CalendarDate` object with the current date. What if we wanted to start off with a
different type of date, such as a `CalendarDateTime` or a `ZonedDateTime`, but keep the initial
value empty?

That's where the placeholder props come in, which consist of the uncontrolled `defaultPlaceholder`
prop, and the [controlled](/docs/controlled) `placeholder` prop.

In the absense of a `value` or `defaultValue` prop (which we'll cover soon), the placeholder holds
all the power in determining what type of date the field represents, and how it should be
rendered/formatted.

Let's convert our previous example into a Date & Time field, by passing a `CalendarDateTime` object
as the `defaultPlaceholder` prop.

```svelte {3,9}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	import { CalendarDateTime } from '@internationalized/date';
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
		defaultPlaceholder: new CalendarDateTime(2023, 10, 11, 12, 30)
	})
</script>

<!-- ... -->
```

<Preview code={snippets.tut2}>
	<svelte:component this={previews.tut2} />
</Preview>

As you can see above, by making that one change, the field now represents a date and time, and the
segments have been updated to reflect that.

If your placeholder value is coming from a database or elsewhere, you can use one of the parser
functions provided by
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html) to
convert it into a `CalendarDateTime` object.

```ts
import { CalendarDateTime, parseDateTime } from '@internationalized/date'

// Constructor with a time
const date = new CalendarDateTime(2023, 10, 11, 12, 30)

// Constructor without a time (defaults to 00:00:00)
const date = new CalendarDateTime(2023, 10, 11)

// Parser function to convert an ISO 8601 formatted string
const date = parseDateTime('2023-10-11T12:30:00')
```

We can also just as easily convert the field into a Zoned Date & Time field, by passing a
`ZonedDateTime` object as the `defaultPlaceholder` prop.

```svelte {3,9}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	import { now, getLocalTimeZone } from '@internationalized/date';
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
		defaultPlaceholder: now(getLocalTimeZone())
	})
</script>

<!-- ... -->
```

We're using the `now` parser function to create a `ZonedDateTime` object with the current date and
time, and we're getting the user's local timezone using the `getLocalTimeZone` function.

<Preview code={snippets.tut3}>
	<svelte:component this={previews.tut3} />
</Preview>

Alternatively, we can hardcode the timezone to something like `America/Los_Angeles` by passing it as
the argument to the `now` function.

```svelte {9}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	import { now } from '@internationalized/date';
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
		defaultPlaceholder: now('America/Los_Angeles')
	})
</script>

<!-- ... -->
```

<Preview code={snippets.tut4}>
	<svelte:component this={previews.tut4} />
</Preview>

How you represent and store dates with timezones will depend entirely on your use case, but there
are a number of parser functions available to help you out, which you can read more about
[here](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html#introduction).

### Working with Values

Now that we've covered the basics of the Date Field, as well as the power of the placeholder, let's
look at how we can use the `defaultValue` to set the value of the field.

Remember, the placeholder props are only relevant in the absense of a `value` or `defaultValue`
prop, as they take precedence over the placeholder. When a `value` or `defaultValue` prop is passed,
the placeholder is set to that value, and the field will represent that type of date.

We can demonstrate this by keeping the `defaultPlaceholder` prop as a `CalendarDateTime` object, and
passing a `CalendarDate` (without time) object as the `defaultValue` prop. It's not recommended that
you ever set them to different types, but it's useful to understand how the placeholder & value
props interact.

```svelte {3,10}
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	import { CalendarDateTime, CalendarDate } from '@internationalized/date';
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
		defaultPlaceholder: new CalendarDateTime(2023, 10, 11, 12, 30),
		defaultValue: new CalendarDate(2023, 10, 11)
	})
</script>
```

<Preview code={snippets.tut5}>
	<svelte:component this={previews.tut5} />
</Preview>

As you can see, the field represents a `CalendarDate` object, and even if you clear the field, it
will retain that shape.

A really useful scenario for using the `defaultValue` prop and the `defaultPlaceholder` prop in
conjunction with one another is when a `defaultValue` may or may not be present, and you want to
ensure the field always represents a certain type of date.

For example, let's say this field is for a user's birthday, which is optional, but you want to
ensure that if they do enter a birthday, it's represented as a `CalendarDate` object. The code to accomplishing that may look something like this: 

```svelte {3,12-13}
<script lang="ts">
	import { createDateField, melt } from '$lib';
	import { CalendarDate, parseDate } from '@internationalized/date';

	export let data

	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { value, segmentContents },
	} = createDateField({
		name: 'birthday',
		defaultPlaceholder: new CalendarDate(2023, 10, 11),
		defaultValue: data?.userBirthday ? parseDate(data?.userBirthday) : undefined,
	});
</script>
```

If the user has a birthday, we parse the ISO 8601 formatted string into a `CalendarDate` object, and if not, we pass `undefined` as the `defaultValue` prop, which will cause the field to default to the `defaultPlaceholder` prop, which we've set to a `CalendarDate` object.

The following example demonstrates how it would work in both scenarios (with and without a birthday).

<Preview code={snippets.tut6}>
	<svelte:component this={previews.tut6} />
</Preview>


### Validating Dates

