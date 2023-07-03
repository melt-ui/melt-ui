---
title: Introduction
description:
  An open-source collection of accessible & customizable component builders for
  creating user interfaces with Svelte.
---

<script>
    import { Construction } from '$docs/components'
</script>

Melt UI empowers developers to create accessible UI components that embody their
unique style. With a strong focus on accessibility, complete styling control,
limitless customization options, simplified development, and an overall
delightful developer experience, Melt UI strives to be the ultimate toolkit for
crafting exceptional user interfaces.

<Construction>
    Melt UI is in its early stages. Expect breaking changes! And lots of new stuff coming in quickly 🚀
</Construction>

## Features

### Builder API

Melt UI exposes builders, not components. A builder is a function that returns a
set of props that can be passed to elements or components:

```svelte
<script>
  import { createCollapsible } from '@melt-ui/svelte';
  const { open, root, content, trigger } = createCollapsible();
</script>

<div {...$root}>
  <button {...$trigger}>{$open ? 'Close' : 'Open'}</button>
  <div {...$content}>Obi-Wan says: Hello there!</div>
</div>
```

This is all you need to have a working Collapsible component in your app. The
props automatically apply the needed attributes and event handlers to the
element or component they are applied to.

### Fully Extensible

Melt UI's builders are headless, meaning they do not provide styles or markup.
This allows you to extend them however you like, using your preferred styling
solution or adding custom functionality.

```svelte
<script>
  import { createCollapsible } from '@melt-ui/svelte';
  import Button from '$components/button.svelte';
  const { open, root, content, trigger } = createCollapsible();
</script>

<!-- Using Svelte Scoped Styles -->
<div class="root" {...$root}>
  <!-- Using an external component -->
  <Button
    on:click={() => console.log('clicked')}
    {...$trigger}
    use:trigger.action
  >
    {$open ? 'Close' : 'Open'}
  </Button>
  <!-- Using an utility class library, such as Tailwind -->
  <div class="rounded-md p-4 text-orange-500 shadow-sm" {...$content}>
    Obi-Wan says: Hello there!
  </div>
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
  }
</style>
```

### Strict Adherence to [WAI-ARIA Guidlines](https://www.w3.org/WAI/ARIA/apg/)

The builders anatomy were designed to reflect the WAI-ARIA definitions, and come
out-of-the-box with the necessary ARIA attributes. All builders are tested using
both automated tools and manually created test suites to guarantee that they are
accessible.

### TypeScript & SvelteKit Support

All builders were made with Typescript and SvelteKit in mind. This very
documentation is built using SvelteKit, and directly imports the builders from
the source code for its examples.
