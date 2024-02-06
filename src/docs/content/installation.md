---
title: Installation
description: Install Melt UI, a headless UI library for Svelte.
---

<script>
    import { Callout, InstallTabs } from '$docs/components';
</script>

## Automatic Installation

Melt UI provides a CLI to help you get started quickly. To use it, run the following command in your
terminal.

```bash
npx @melt-ui/cli@latest init
```

It will automatically add `@melt-ui/svelte` to your dependencies. You may optionally choose to
install our [preprocessor](/docs/preprocessor) as well.

## Manual Installation

Install Melt UI with your package manager of choice.

<InstallTabs>
<span slot="npm">

```bash
npm install -D @melt-ui/svelte
```

</span>

<span slot="yarn">

```bash
yarn add -D @melt-ui/svelte
```

</span>

<span slot="pnpm">

```bash
pnpm add -D @melt-ui/svelte
```

</span>
</InstallTabs>

<Callout>
P.S. These tabs were built using Melt! Try using them with the arrow keys.
</Callout>

## Preprocessor Installation

Melt UI also provides a custom preprocessor that aims to enhance the DX of Melt UI. You can read
more about it [here](/docs/preprocessor).

Install our preprocessor, [@melt-ui/pp](https://github.com/melt-ui/preprocessor).

<InstallTabs>
<span slot="npm">

```bash
npm install -D @melt-ui/pp
```

</span>

<span slot="yarn">

```bash
yarn add -D @melt-ui/pp
```

</span>

<span slot="pnpm">

```bash
pnpm add -D @melt-ui/pp
```

</span>

</InstallTabs>

Next, import both preprocessors and add them to your `preprocess` array in `svelte.config.js`.

```js
// svelte.config.js

import { preprocessMeltUI, sequence } from '@melt-ui/pp'

const config = {
	// ... other svelte config options
	preprocess: sequence([
		// ... other preprocessors
		preprocessMeltUI() // add to the end!
	])
}

export default config
```
