<p align="center">
 <img align="center" src="https://raw.githubusercontent.com/TGlide/radix-svelte/main/static/logo.svg" height="96" />
 <h1 align="center">
  Radix Svelte
 </h1>
</p>

Unofficial community-led Svelte port of Radix UI Primitives, a set of unstyled, accessible components for building high‑quality design systems and web apps.

[![](https://img.shields.io/npm/v/radix-svelte?style=flat-square)](https://www.npmjs.com/package/radix-svelte)
[![](https://img.shields.io/github/actions/workflow/status/TGlide/radix-svelte/ci.yaml?style=flat-square)](https://github.com/TGlide/radix-svelte/actions/workflows/ci.yaml)
![](https://img.shields.io/github/license/TGlide/radix-svelte?style=flat-square)
[![](https://dcbadge.vercel.app/api/server/gQrpPs34xH?style=flat-square)](https://discord.gg/gQrpPs34xH)

> **Note**
> We are not affiliated with or endorsed by Radix UI/WorkOS. This is a volunteer driven project born out of the need for a similar component library for the Svelte ecosystem.

## About

Radix Svelte is meant to be used as a base for your own styles and components. It offers:

- Treeshakable components with individual parts that can be styled separately
- Typescript and SvelteKit support out-of-the-box
- Strict adherence to WAI-ARIA guidelines
- Easy to use examples and documentation
- A high emphasis on accessibility, extensibility, quality and consistency

While Radix Svelte is not a 1:1 reimplementation of Radix UI Primitives, we follow the same principles, patterns, and goals outlined by them on their site. Any changes that may be introduced as a part of porting it to Svelte will be documented and mentioned accordingly.

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

<Toggle.Root bind:pressed>
    {pressed ? 'Pressed' : 'Not pressed'}
</Toggle.Root>
```

## Roadmap

You can check the planned features and bugs in the [issues tab](https://github.com/TGlide/radix-svelte/issues)

## Contributing

Check out our [contributing guide](./CONTRIBUTING.md)

## Community

- [Discord](https://discord.gg/gQrpPs34xH)
