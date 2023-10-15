---
title: Dates & Times
description: How to work with dates and times in Melt's date-related builders.
---

<script>
  import { Callout } from '$docs/components';
  import A from '$docs/components/markdown/a.svelte';
</script>

<Callout>
The inner-workings of our date-related builders are heavily inspired by the research and work done
by the <A href="https://react-spectrum.adobe.com/react-aria/">React Aria</A> team at Adobe, who have created
robust date components that excel in terms of accessibility, user experience, and flexibility.
</Callout>

The builders we offer depend on the
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
package, which solves a lot of the problems that come with working with dates and times in
JavaScript.

We highly recommend reading through the documentation for the package to get a solid feel for how it
works, but we hope to cover enough here to get you started.

## Date Objects

We use the `DateValue` objects provided by <code class="neutral">@internationlized/date</code> to
represent dates in the various builders. These objects are immutable, and provide information about
the type of date they represent:

- `CalendarDate`: A date with no time component, such as <code class="neutral">2023-10-11</code>.
- `CalendarDateTime`: A date with a time component, but without a timezone, such as
  <code class="neutral">2023-10-11T12:30:00</code>.
- `ZonedDateTime`: A date with a time component and a timezone, such as
  <code class="neutral">2023-10-11T21:00:00:00-04:00[America/New_York]</code>.

The benefit of using these objects is that we can be very specific about the type of date we want,
and the behavior of the builder will adapt to that type.

## Parser Functions

The [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
package provides a number of parser functions that can be used to:

- convert an ISO 8601 formatted string into a `DateValue` object
- convert one type of `DateValue` object into another type
- convert a `DateValue` object into an ISO 8601 formatted string
- convert a `DateValue` object into a JavaScript `Date` object
- and many more...
