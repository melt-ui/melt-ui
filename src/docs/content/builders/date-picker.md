---
title: Date Picker
description: A date field with a calendar popover for selecting dates.
---

<script>
	import { Preview, Callout } from '$docs/components'
	import { A } from '$docs/components/markdown';
	export let snippets
	export let previews
</script>

## Overview

The **Date Picker** extends the [Date Field](/docs/builders/date-field) by adding a
[Popover](/docs/builders/popover) containing a calendar for selecting dates. It's fully accessible,
and works with all modern browsers & devices.

<Callout type="warning">
Before jumping into the docs for this builder, it's recommended that you understand how we work with dates &
times in Melt, which you can read about <A href="/docs/dates">here</A>.
</Callout>

## Anatomy

The Date Picker is a combination of the [Date Field](/docs/builders/date-field),
[Calendar](/docs/builders/calendar), and [Popover](/docs/builders/popover) builders.

- **Calendar**: The container of the months and days in the calendar
- **Cell**: A single date in the calendar
- **Content**: The content of the popover
- **Field**: A
- **Grid**:
- **segment**: An individual segment of the date (day, month, year, etc.)
- **label**: The label for the date field
