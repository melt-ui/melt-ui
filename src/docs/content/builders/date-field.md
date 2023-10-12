---
title: Date Field
description: An enhanced alternative to a native date input.
---

<script>
	import { Preview } from '$docs/components'
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

## Working with Dates & Times

The Date Field, along with the other date-related builders, uses, and expects you to use the
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
package. There are countless jokes about how painful it is to work with dates in JavaScript, and
this package solves a lot of those problems.

We highly recommend reading through the documentation for the package to get a better feel for how
it works, but we'll be covering the basics throughout the rest of this page.

### DateValue Objects

The Date Field uses `DateValue` objects to represent dates. These objects are immutable, and provide
information about the type of date they represent:

- `CalendarDate`: A date with no time component, such as <code class="neutral">2023-10-11</code>.
- `CalendarDateTime`: A date with a time component, but without a timezone, such as
  <code class="neutral">2023-10-11T12:30:00</code>.
- `ZonedDateTime`: A date with a time component and a timezone, such as
  <code class="neutral">2023-10-11T21:00:00:00-04:00[America/New_York]</code>.

The benefit of using these objects is that we can be very specific about the type of date we want,
and the field will render the appropriate UI for that type of date.

### Parser Functions

The [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
package provides a number of parser functions that can be used to:

- convert an ISO 8601 formatted string into a `DateValue` object
- convert one type of `DateValue` object into another type
- convert a `DateValue` object into an ISO 8601 formatted string
- convert a `DateValue` object into a JavaScript `Date` object
- and many more...

We'll be using some of these functions throughout the rest of the page, but we can't cover them all,
so be sure to check out the docs for a full list.

## Placeholder Value

The placeholder value is responsible for determining the type of date the field represents when no
value is present, which determines how the field is rendered and formatted. It also sets the
starting point for the stepper buttons, so that when empty, the user doesn't have to start from
scratch.

You can set the placeholder value using the `defaultPlaceholderValue` prop, or using the
[controlled](/docs/controlled) `placeholderValue` store, however, if a `defaultValue` or `value` is
provided, those will take precedence, and the `placeholderValue` will be set to their value.

### Default Behavior

By default, if no placeholder or value props are passed to the field, it will default to represent
the `CalendarDate` type, which you can see an example of below.

```svelte
<script lang="ts">
	const field = createDateField()
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

	const field = createDateField({
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

TODO: Add a separate docs page to further break down the different parser functions and when it
makes sense to use each one.

```svelte {4,7}
<script lang="ts">
	import { now, getLocalTimeZone } from '@internationalized/date'

	const defaultPlaceholderValue = now(getLocalTimeZone())

	const field = createDateField({
		defaultPlaceholderValue
	})
</script>
```

<Preview code={snippets.zdtPlaceholder}>
	<svelte:component this={previews.zdtPlaceholder} />
</Preview>
