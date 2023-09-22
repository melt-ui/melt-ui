---
title: Spinbutton
description: A widget that restricts its value to a set or range of discrete values.
---

<script>
    import { APIReference, KbdTable } from '$docs/components';
    export let schemas;
    export let keyboard;
</script>

## Anatomy

- **Root**: The root container for the spinutton
- **Label**: The label of the spinbutton
- **Spinbutton**: The actual spinbutton that will display the value
- **Trigger**:
  - **Increase**: The increase trigger
  - **Decrease**: The increase trigger

## API Reference

<APIReference {schemas} />

## Accessibility

Adheres to the
[Spinbutton WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)

<KbdTable {keyboard} />
