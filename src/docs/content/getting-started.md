---
title: Getting Started
description:
  It only takes a few lines of code to get started building components with Melt UI.
---

<script>
    import { Callout, InstallTabs } from '$docs/components';
</script>

## Installation

Install Melt UI with your package manager of choice.

<InstallTabs>
<span slot="npm">

```bash /@melt-ui/#melt /svelte/#melt
npm install @melt-ui/svelte
```

</span>

<span slot="yarn">

```bash /@melt-ui/#melt /svelte/#melt
yarn add @melt-ui/svelte
```

</span>

<span slot="pnpm">

```bash /@melt-ui/#melt /svelte/#melt
pnpm install @melt-ui/svelte
```

</span>

</InstallTabs>

<Callout>
P.S. These tabs were built using Melt! Try using them with the arrow keys.
</Callout>

## Usage

Melt UI exposes a number of component builders. Let's say you want a Collapsible
component:

```svelte
<script>
  import { createCollapsible } from '@melt-ui/svelte'
  const { open, root, content, trigger } = createCollapsible()
</script>

<div {...$root}>
  <button {...$trigger} use:trigger.action>{$open ? 'Close' : 'Open'}</button>
  <div {...$content}>Obi-Wan says: Hello there!</div>
</div>
```

You'll see that `createCollapsible` returns an object with a couple of properties. Some of
these are stores, and others are stores that return functions. The stores are used to
manage the state of the component, and the functions are used to pass arguments to the
element.

Each component is different, so be sure to check out the documentation before attempting
to use one.

### Styling

Melt UI leaves the styling up to you. Whether you prefer scoped or global CSS, a utility
framework like [TailwindCSS](https://tailwindcss.com), or third-party components, as long
as you can pass in Melt's props, it's all good.

```svelte
<script>
  import { createCollapsible } from '@melt-ui/svelte';
  import Button from '$components/button.svelte';
  const { open, root, content, trigger } = createCollapsible();
</script>

<!-- Using Svelte Scoped Styles -->
<div class="root" {...$root}>
<!-- Using an external component -->
<Button on:click={() => console.log('clicked')} {...$trigger} action={trigger}>
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

<!-- Button.svelte -->
<script>
  import type { Action } from 'svelte/action';
  export let action: Action
</script>

<button use:action>
  <slot />
</button>
```

### Animations

By passing the builder returned props to an element, certain data and aria attributes will
automatically be added/and or altered for you. These changes can then be used for
animation purposes, should you desire to do so.

```svelte
<script>
  import { createCollapsible } from '@melt-ui/svelte'
  const { root, content, trigger } = createCollapsible()
</script>

<div {...$root}>
  <button {...$trigger} use:trigger> Toggle </button>
  <div class="content" {...$content}>
    <p>sveltejs/svelte</p>
    <p>sveltejs/kit</p>
  </div>
</div>

<style>
  .content {
    display: block !important; /* Ignore the hidden attribute */
    transition: opacity 200ms ease;
  }
  .content[data-state='closed'] {
    opacity: 0;
  }
</style>
```

<Callout>
Svelte transitions can also be utilized. However, it is important to note that this may interfere with default functionality in particular components, such as focus management, so proceed with caution.
</Callout>

## Need help?

If you run into any bugs, or would like to request a feature, please feel free to
[open an issue](https://github.com/melt-ui/melt-ui/issues/new) on GitHub.

You can also reach out to us on [Discord](https://discord.gg/cee8gHrznd) if you have any
questions or just want to chat.
