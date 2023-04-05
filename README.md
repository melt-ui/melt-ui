<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/TGlide/radix-svelte/main/static/logo.svg" height="108" />
  
 <h1 align="center">
   Radix Svelte
</h1>
</p>

## Description

This is a port of [Radix UI](https://www.radix-ui.com/) for Svelte.

[![](https://img.shields.io/npm/v/radix-svelte?style=flat-square)](https://www.npmjs.com/package/radix-svelte)
[![](https://img.shields.io/github/actions/workflow/status/TGlide/radix-svelte/ci.yaml?style=flat-square)](https://github.com/TGlide/radix-svelte/actions/workflows/ci.yaml)
![](https://img.shields.io/github/license/TGlide/radix-svelte?style=flat-square)
[![](https://dcbadge.vercel.app/api/server/gQrpPs34xH?style=flat-square)](https://discord.gg/gQrpPs34xH)

### Design Principles

This is not a 1:1 re-implementation of Radix UI. The goal is to provide a similar API and experience, but with a few differences:

- Two-way binding is used instead of event handlers.
- No `asChild` prop (for now).

## Usage

Install the package:

```
npm install radix-svelte
# or yarn, pnpm, etc.
```

Import the components you need:

```svelte
<script>
	import { Toggle } from 'radix-svelte';

	let pressed = false;
</script>

<Toggle bind:pressed>
	{pressed ? 'Pressed' : 'Not pressed'}
</Toggle>
```

## Roadmap

You can check the planned features and bugs in the [issues tab](https://github.com/TGlide/radix-svelte/issues)

## Community

- [Discord](https://discord.gg/gQrpPs34xH)
