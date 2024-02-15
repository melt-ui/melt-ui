---
title: Stepper
description: An input that restricts its value to a set or range of discrete values.
---

<script>
    import { APIReference, KbdTable, Preview } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Usage

To create a stepper, use the `createStepper` builder function. Follow the anatomy or the example
above to create your stepper.

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Spinbutton WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)

<KbdTable {keyboard} />
