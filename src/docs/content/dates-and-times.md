---
title: Dates & Times
description: How to work with dates and times in Melt's date-related builders.
---

Each of the date-related builders we offer depend on the
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html)
package. There are countless jokes about how painful it is to work with dates in JavaScript, and
this package solves a lot of those problems.

We highly recommend reading through the documentation for the package to get a solid feel for how it
works, but we'll cover enough here to get you started.

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
