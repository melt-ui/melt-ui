---
title: Preprocessor
description: Simplifying builders with the PP.
---

## What it does

We provide a custom preprocessor (our PP™) that aims to enhance the DX of Melt just a bit further.
It introduces a new HTML attribute, `melt`, that accepts our builders as values. This helps trim
down on the boilerplate just enough to keep the markup nice and tidy. The PP will then transform our
special attribute into the proper Svelte syntax.

## How it works

In the most simplest form, the preprocessor will take the following code:

```svelte
<script>
  import { createBuilder } from '@melt-ui/svelte'

  const { builder } = createBuilder()
</script>

<div melt={$builder} />
```

and transform it into this:

```svelte
<script>
  import { createBuilder } from '@melt-ui/svelte'

  const { builder } = createBuilder()
</script>

<div {...$builder} use:$builder.action />
```

It can handle more complex scenarios, such as a builder that is a call expression with dependencies:

```svelte
<script>
  import { createBuilder } from '@melt-ui/svelte'

  const { builder } = createBuilder()
</script>

{#each Array(100) as _, i}
  <!-- Just a normal call expression -->
  <div melt={$builder({ arg: i })} />
{/each}
```

## Caveats

There is 1 important caveat to note. Builders that expect arguments for their action are not
supported.

For example, the `checkboxItem` builder from `createDropdownMenu` expects the following:

```svelte
<script>
  import { createBuilder } from '@melt-ui/svelte'

  const { checkboxItem } = createBuilder()
</script>

<!-- Note that the action requires arguments here 👇 -->
<div {...$checkboxItem} use:checkboxItem={{ checked: true }} />
```

As of now, there's no _good_ way to simplify this without degrading the experience of the library
for users that choose to _not_ use the PP. So for now, we'll just have to stick with the above
syntax for these cases, which are rather infrequent.
