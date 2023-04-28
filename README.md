<p align="center">
 <img align="center" src="https://raw.githubusercontent.com/TGlide/radix-svelte/main/static/logo.svg" height="96" />
 <h1 align="center">
  Radix Svelte
 </h1>
</p>

[Radix Svelte](https://www.radix-svelte.com/) is an unofficial community-led [Svelte](https://svelte.dev) port of [Radix UI Primitives](https://www.radix-ui.com/), a set of unstyled, accessible components for building high‑quality design systems and web apps.

[![](https://img.shields.io/npm/v/radix-svelte?style=flat-square)](https://www.npmjs.com/package/radix-svelte)
[![](https://img.shields.io/github/actions/workflow/status/TGlide/radix-svelte/ci.yaml?style=flat-square)](https://github.com/TGlide/radix-svelte/actions/workflows/ci.yaml)
![](https://img.shields.io/github/license/TGlide/radix-svelte?style=flat-square)
[![](https://dcbadge.vercel.app/api/server/gQrpPs34xH?style=flat-square)](https://discord.gg/gQrpPs34xH)

> **Note** <br> **We are not affiliated with or endorsed by Radix UI/WorkOS.** <br> This is a volunteer driven project born out of the need for a similar component library for the Svelte ecosystem.

## About

Radix Svelte is meant to be used as a base for your own styles and components. It offers:

- Treeshakable components with individual parts that can be styled separately
- Typescript and [SvelteKit](https://kit.svelte.dev/) support out-of-the-box
- Strict adherence to [WAI-ARIA guidelines](https://www.w3.org/WAI/ARIA/apg/)
- Easy to use examples and documentation
- A high emphasis on accessibility, extensibility, quality and consistency

While Radix Svelte is not a 1:1 reimplementation of [Radix UI Primitives](https://www.radix-ui.com/), we follow the same principles, patterns, and goals outlined by them on their site. Any changes that may be introduced as a part of porting it to Svelte will be documented and mentioned accordingly.

## Getting started

Install the `radix-svelte` package with your package manager of choice:

```sh
npm install radix-svelte
yarn add radix-svelte
pnpm add radix-svelte
bun add radix-svelte
```

Import the components to your code and start using them:

```html
<script>
	import { Toggle } from 'radix-svelte';
	let pressed = false;
</script>

<Toggle.Root bind:pressed> {pressed ? 'Pressed' : 'Not pressed'} </Toggle.Root>
```

## Contributing

**Contributions are welcome and encouraged!**

Radix Svelte is under active development, and currently planned features and bugs are in the [issues tab](https://github.com/TGlide/radix-svelte/issues).

We work on this project on a volunteer basis in our free time. If you notice something that hasn't been implemented yet or could be improved, do consider contributing to the project. The goal is to enhance the experience of building with Svelte and improve the ecosystem for everyone.

Check out our [Contributing guide](./CONTRIBUTING.md) to learn more.

## Community

Got any questions? Want to talk to the maintainers?

Our [Discord community](https://discord.gg/gQrpPs34xH) is a great place to get in touch with us, and we'd love to have you there.

<a href="https://discord.gg/gQrpPs34xH" alt="Radix Svelte Discord community">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://invidget.switchblade.xyz/gQrpPs34xH">
  <img alt="Radix Svelte Discord community" src="https://invidget.switchblade.xyz/gQrpPs34xH?theme=light">
</picture>
</a>

## Similar projects

Looking for more? Check out these other projects too:

- [Svelte Material UI](https://sveltematerialui.com/)
- [Svelte Headless UI](https://svelte-headlessui.goss.io/docs)
- [Skeleton UI](https://skeleton.dev/)
- [SvelteStrap](https://github.com/bestguy/sveltestrap)
- [Flowbite Svelte](https://flowbite-svelte.com/)
- [Carbon Components Svelte](https://github.com/carbon-design-system/carbon-components-svelte/)
- [Noir UI](https://github.com/khairulhaaziq/noir-ui)
- [Grail UI](https://grail-ui.vercel.app/)

This list is not exhaustive or sorted in any particular order. If you know of any other similar projects for Svelte, feel free to open a PR to add them here.
These projects are not affiliated with Radix Svelte in any way.
