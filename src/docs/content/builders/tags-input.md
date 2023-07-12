---
title: Tags Input
description: Render tags inside an input, followed by an actual text input.
---

<script>
    import { APIReference, Callout, KbdTable } from '$docs/components'
    export let schemas
    export let keyboard
</script>

## Anatomy

- **Root**: The root container for the tags input
- **Tag**: The tag container for an individual tag
- **Delete Trigger**: The button container, to delete an individual tag
- **Edit**: An edit container, to edit an individual tag
- **Input**: The input textbox for adding new tags

## Usage

Use the `createTagsInput` builder function.

<Callout type="info">
    See <strong>API Reference > createTagsInput</strong> for all available props.
</Callout>

```svelte
<script lang="ts">
  import { createTagsInput } from '@melt-ui/svelte'
  const {
    root,
    input,
    tag,
    deleteTrigger,
    edit,
    options,
    tags,
    selected,
    inputValue,
    inputInvalid,
    isSelected
  } = createTagsInput()
</script>
```

Use the return values to construct a tags-input.

```svelte
<script lang="ts">
  import { createTagsInput } from '@melt-ui/svelte'

  // This is a subset of return values
  const { root, input, tags, tag, deleteTrigger, edit } = createTagsInput()
</script>

<div melt={$root}>
  {#each $tags as t}
    <div melt={$tag(t)}>
      <span>{t.value}</span>
      <button melt={$deleteTrigger(t)}>x</button>
    </div>
    <div melt={$edit(t)}>{t.value}</div>
  {/each}
  <input melt={$input} type="text" />
</div>
```

### Adding a tag

An asynchronous `add` function may be passed into the builder. It is called prior to adding the tag
to the `$tags` store.

It provides you the ability to validate the input value, set a custom id, for example from a backend
or 3rd-party API, or update the value to always be uppercase, lowercase, etc.

The function definition is:

```ts
fn: (tag: string) => Promise<Tag | undefined>
```

whereby `tag` is the input value.

<Callout type="info">
A <code>tag</code> is an object that consists of an <code>id</code> and <code>value</code>
</Callout>

On `resolve`, if a `string` is returned, an id will be internally generated. The same happens when a
`Tag` without an id is returned.

On `reject` or `error`, the input is invalidated and not added to the store.

The following example sets the id via a third-party API call and forces the tag to always be
uppercase.

```svelte
<script lang="ts">
  import { createTagsInput } from '@melt-ui/svelte'

  const { root, input, tag, deleteTrigger } = createTagsInput({
    add: async (v: string) => {
      const response = await fetch('https://www.uuidtools.com/api/generate/v1')

      if (!response.ok) throw new Error('HTTP error ' + response.status)

      const data = await response.json()
      if (!Array.isArray(data) || data.length < 1) {
        throw new Error('Failed to get id')
      }

      return { id: data[0], value: v.toUpperCase() }
    }
  })
</script>
```

### Updating a tag

An asynchronous update function may be passed into the builder. It is called prior to updating a tag
in $tags store, following an edit.

It provides the ability do something before a tag is updated, such as updating the value in a
backend database, setting a new id, or simply manipulating the value to be added.

The function definition is:

```ts
fn: (tag: Tag) => Promise<Tag>.
```

<Callout type="info">
A <code>tag</code> is an object that consists of an <code>id</code> and <code>value</code>
</Callout>

`tag.value` will be the new (edited) value, while `tag.id` will be the existing id.

On `reject` or `error` the tag is not updated.

The following example uses the existing id and sets the value to uppercase

```svelte
<script lang="ts">
  import { createTagsInput, type Tag } from '@melt-ui/svelte'

  const { root, input, tag, deleteTrigger, edit } = createTagsInput({
    update: async (tag: Tag) => {
      return { id: tag.id, value: tag.value.toUpperCase() }
    }
  })
</script>
```

### Removing a tag

An asynchronous remove function may be passed into the builder. It is called prior to removing the
tag from the $tags store.

It provides the ability do something before the tag is removed from $tags store, such as deleting
the tag from a backend database.

The function definition is:

```ts
fn: (tag: Tag) => Promise<boolean>
```

whereby tag is the tag to be removed from the $tags store.

<Callout type="info">
A <code>tag</code> is an object that consists of an <code>id</code> and <code>value</code>
</Callout>

On `reject`, `error` or `false`, the tag is not removed from the store.

The following example disallows a tag with the value `one` to be deleted.

```svelte
<script lang="ts">
  import { createTagsInput, type Tag } from '@melt-ui/svelte'

  const { root, input, tag, deleteTrigger } = createTagsInput({
    tags: ['one', 'two'],
    remove: async (t: Tag) => {
      if (t.value === 'one') return false
      return true
    }
  })
</script>
```

### API Reference

<APIReference {schemas} />

### Accessibility

<KbdTable {keyboard} />
