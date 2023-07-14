---
title: Installation
description: Install Melt UI, a headless UI library for Svelte.
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
pnpm add @melt-ui/svelte
```

</span>

</InstallTabs>

<Callout>
P.S. These tabs were built using Melt! Try using them with the arrow keys.
</Callout>

## Preprocessor Installation

Melt UI also provides a custom preprocessor that aims to enhance the DX of Melt UI. You can read
more about it [here](/docs/preprocessor).

Install our preprocessor, [@melt-ui/pp](https://github.com/melt-ui/preprocessor), along with
[svelte-sequential-preprocessor](https://www.npmjs.com/package/svelte-sequential-preprocessor).

<InstallTabs>
<span slot="npm">

```bash
npm install -D @melt-ui/pp svelte-sequential-preprocessor
```

</span>

<span slot="yarn">

```bash
yarn add -D @melt-ui/pp svelte-sequential-preprocessor
```

</span>

<span slot="pnpm">

```bash
pnpm add -D @melt-ui/pp svelte-sequential-preprocessor
```

</span>

</InstallTabs>

Next, import both packages and add them to your `preprocess` array in `svelte.config.js`.

```js
// svelte.config.js

import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'

const config = {
  // ... other svelte config options
  preprocess: sequence([
    // ... other preprocessors
    preprocessMeltUI() // add to the end!
  ])
}
```
