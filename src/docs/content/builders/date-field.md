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

## Quick Start

<Callout type="warning">
Before jumping into the quick start, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <a href="/docs/dates-and-times" target="_blank">here</a>.
</Callout>

You can initialize a new Date Field using the `createDateField` function, which returns an object
consisting of the stores & methods needed to construct the field.

Let's start off simple by just destructuring the `dateField`, `segment`, and `label`, and
`segmentContents`.

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

Instead, we can use the `segmentContents` state, which is an array of objects necessary to form the
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

```svelte {4-5,18,20-22} 
<script lang="ts">
	import { createDateField, melt } from '@melt-ui/svelte'
	const {
		elements: { dateField, segment, label, hiddenInput },
		states: { segmentContents, value }
	} = createDateField({
		name: 'appointmentDate'
	})
</script>

<span use:melt={$label}>Appointment Date</span>
<div use:melt={$dateField}>
	{#each $segmentContents as seg, i (i)}
		<div use:melt={$segment(seg.part)}>
			{seg.value}
		</div>
	{/each}
	<input use:melt={$hiddenInput} />
</div>
{#if $value}
	<span>You selected: {$value}</span>
{/if}
```

And that, along with some styling, which you can learn about in the [Styling](/#styling) section, is all you need to get a fully functional Date Field that looks
like this:

<Preview code={snippets.quickStart}>
	<svelte:component this={previews.quickStart} />
</Preview>

## Values

The Date Field along with the other date-related builders, have two value-related props,
**Placeholder Values** and **Values**.

The value props are used to set the value of the field, and are used to determine what type of date
the field represents. The placeholder value props are used to set the value of the field when it's
empty, but is overwritten by the value props when they're set.

The value can be set using the `defaultValue` or the [controlled](/docs/controlled) `value` prop.
The placeholder can be set using the `defaultPlaceholderValue` prop, or the
[controlled](/docs/controlled) `placeholderValue` prop.

### Date

By default, if no placeholder or value props are passed to the field, it will default to represent
the `CalendarDate` type, which you can see an example of below.

```svelte
<script lang="ts">
	const {
		/* ... */
	} = createDateField()
</script>
```

<Preview code={snippets.main}>
	<svelte:component this={previews.main} />
</Preview>

### Date & Time

If we instead wanted to use a `CalendarDateTime` as the placeholder value, we can pass in an object
with that type to the `defaultPlaceholderValue` prop. You can either create a new `CalendarDateTime`
object, or use one of the parser functions to convert an ISO 8601 formatted string into that type.

```ts title="A few ways to create a CalendarDateTime"
import { CalendarDateTime, parseDateTime } from '@internationalized/date'

// Constructor with a time
const defaultPlaceholderValue = new CalendarDateTime(2023, 10, 11, 12, 30)

// Constructor without a time (defaults to 00:00:00)
const defaultPlaceholderValue = new CalendarDateTime(2023, 10, 11)

// Parser function to convert an ISO 8601 formatted string
const defaultPlaceholderValue = parseDateTime('2023-10-11T12:30:00')
```

```svelte {4,7}
<script lang="ts">
	import { CalendarDateTime, parseDateTime } from '@internationalized/date'

	const defaultPlaceholderValue = new CalendarDateTime(2023, 10, 11, 12, 30)

	const {
		/* ... */
	} = createDateField({
		defaultPlaceholderValue
	})
</script>
```

<Preview code={snippets.dtPlaceholder}>
	<svelte:component this={previews.dtPlaceholder} />
</Preview>

### Zoned Date & Time

If you want the dates you're working with to be timezone aware, you can use a `ZonedDateTime`
object.
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
provides a number of parser functions to convert other `DateValue` objects into a `ZonedDateTime`
object, as well as multiple string parsing functions depending on what information you need to
collect from the user.

```svelte {4,7}
<script lang="ts">
	import { now, getLocalTimeZone } from '@internationalized/date'

	const defaultPlaceholderValue = now(getLocalTimeZone())

	const {
		/* ... */
	} = createDateField({
		defaultPlaceholderValue
	})
</script>
```

In the first field below, we're using the `now` parser function to create a `ZonedDateTime` object
with the current date and time, and we're getting the user's local timezone using the
`getLocalTimeZone` function.

In the second, we're harcoding the timezone to `America/Los_Angeles` by passing it as the argument
to the `now` function.

<Preview code={snippets.zdtPlaceholder}>
	<svelte:component this={previews.zdtPlaceholder} />
</Preview>

## Value

As mentioned in the [Placeholder Value](#placeholder-value) section, the `value` and `defaultValue`
props take precedence over the placeholder props, and will set the `placeholderValue` to their
value.

### CalendarDate

```svelte




```
