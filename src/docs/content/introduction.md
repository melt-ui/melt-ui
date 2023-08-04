---
title: Introduction
description:
  An open-source collection of accessible & customizable component builders for creating user
  interfaces with Svelte.
---

<script>
    import { Construction } from '$docs/components/index.js'
</script>

Melt UI empowers developers to create accessible UIs that embody their unique style. With a strong
focus on accessibility, limitless customization options, and an overall delightful developer
experience, Melt UI strives to be the de-facto headless UI library for Svelte.

<Construction>
    Melt UI is in its early stages. Expect breaking changes! And lots of new stuff! 🚀
</Construction>

## Features

### Builder API

Unlike a traditional component library, Melt UI provides access to builders instead of components.
Builders are just functions that generate a collection of properties that can be assigned to any
element or component.

```svelte {3-6} /$root/#hi /$content/#hi /$trigger/#hi
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'
	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible()
</script>

<div use:melt={$root}>
	<button use:melt={$trigger}>{$open ? 'Close' : 'Open'}</button>
	<div use:melt={$content}>Obi-Wan says: Hello there!</div>
</div>
```

This is all you need to have a working Collapsible component in your application. The builders
automatically apply the necessary attributes and event handlers to your element or component.

### Accessible by Design

Melt UI puts accessibility front and center, making sure your UI components are inclusive and
user-friendly. We follow [WAI-ARIA design patterns](https://www.w3.org/WAI/ARIA/apg/) and take care
of all the nitty-gritty details like aria attributes, role management, focus handling, and keyboard
navigation. Each builder's page includes a section on accessibility, with references to relevant
WAI-ARIA guidelines & instructions for using the builder in an accessible manner.

### Bring Your Own Styles

The builders ship with zero predefined styles, allowing you to customize them to seamlessly
integrate with your application's design system. Whether you prefer vanilla CSS, CSS preprocessors,
or CSS-in-JS libraries, our components work harmoniously with your preferred styling solution.

### Open & Extensible

Melt UI embraces your desire for customization. The builder architecture is open and flexible,
allowing you to tinker with every aspect of the components. Wrap them, extend their functionality,
or add event listener and props to tailor them to your exact needs.

### Simplified DX

We want to simplify your development workflow. By default, Melt UI components are uncontrolled,
freeing you from the burden of managing local states. However, if you prefer greater control, you
can switch to controlled components. We handle the behind-the-scenes complexity, ensuring a smooth
developer experience.

### TypeScript & SvelteKit Support

Melt UI offers a fully-typed API, safeguarding your code while providing autocompletion superpowers
in your preferred code editor. All our components share a consistent API, promoting familiarity and
minimizing surprises. The components are also build with SSR in mind, making them a perfect fit for
SvelteKit.

## Inspiration & Credits

We're big fans of open source and love working collaboratively. Over time, we've taken cues &
inspiration from some really amazing projects and people that have motivated us to continuously
improve our ideas.

Some of the project's we've been inspired by in no particular order:

- Zag - [https://zagjs.com](https://zagjs.com)
- Radix UI - [https://radix-ui.com](https://radix-ui.com)
- Grail UI - [https://grail-ui.vercel.app](https://grail-ui.vercel.app)
- Skeleton - [https://skeleton.dev](https://skeleton.dev)
