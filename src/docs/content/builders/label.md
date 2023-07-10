---
title: Label
description: A control that adds a label to an input element.
---

<script>
    import { APIReference } from "$docs/components"
    export let schemas
</script>

## Anatomy

- **Root**: The root container for the label

## Usage

To create a label, use the `createLabel` builder function and apply the root action to the label
element.

```svelte
<script lang="ts">
  import { createLabel } from '@melt-ui/svelte'

  const label = createLabel()
</script>

<label for="name" use:label>Name</label>
<input type="text" id="name" />
```

## API Reference

<APIReference {schemas} />
