<h1 align="center">
 <img align="center" src="https://raw.githubusercontent.com/melt-ui/melt-ui/main/static/banner.png"  />
</h1>

[Melt UI](https://www.melt-ui.com/) is a set of headless, accessible component builders for Svelte.

[![](https://img.shields.io/npm/v/@melt-ui/svelte?style=flat-square)](https://www.npmjs.com/package/@melt-ui/svelte)
[![](https://img.shields.io/github/actions/workflow/status/melt-ui/melt-ui/ci.yaml?style=flat-square)](https://github.com/melt-ui/melt-ui/actions/workflows/ci.yaml)
![](https://img.shields.io/github/license/melt-ui/melt-ui?style=flat-square)
[![](https://dcbadge.vercel.app/api/server/2QDjZkYunf?style=flat-square)](https://discord.gg/2QDjZkYunf)

## About

Melt UI is meant to be used as a base for your own styles and components. It offers:

- Uncoupled builders that can be attached to any element/component
- Typescript and [SvelteKit](https://kit.svelte.dev/) support out-of-the-box
- Strict adherence to [WAI-ARIA guidelines](https://www.w3.org/WAI/ARIA/apg/)
- Easy to use examples and documentation
- A high emphasis on accessibility, extensibility, quality and consistency

## Getting started

Install the `@melt-ui/svelte` package with your package manager of choice:

```sh
npm install @melt-ui/svelte
yarn add @melt-ui/svelte
pnpm install @melt-ui/svelte
bun add @melt-ui/svelte
```

Import the builders to your code and start using them:

```html
<script>
  import { createCollapsible } from '@melt-ui/svelte'
  const { open, root, content, trigger } = createCollapsible()
</script>

<div {...$root}>
  <button {...$trigger}>{$open ? 'Close' : 'Open'}</button>
  <div {...$content}>Obi-Wan says: Hello there!</div>
</div>
```

## Contributing

**Contributions are welcome and encouraged!**

Melt UI is under active development. Currently planned features can be found in the
[roadmap](#roadmap), or in the [issues tab](https://github.com/melt-ui/melt-ui/issues), alongside
bug reports.

We work on this project on a volunteer basis in our free time. If you notice something that hasn't
been implemented yet or could be improved, do consider contributing to the project. The goal is to
enhance the experience of building with Svelte and improve the ecosystem for everyone.

Check out our [Contributing guide](./CONTRIBUTING.md) to learn more.

## Community

Got any questions? Want to talk to the maintainers?

Our [Discord community](https://discord.gg/2QDjZkYunf) is a great place to get in touch with us, and
we'd love to have you there.

<a href="https://discord.gg/2QDjZkYunf" alt="Melt UI Discord community">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://invidget.switchblade.xyz/2QDjZkYunf">
  <img alt="Melt UI Discord community" src="https://invidget.switchblade.xyz/2QDjZkYunf?theme=light">
</picture>
</a>

## Roadmap

| Component name  | Status |
| --------------- | ------ |
| Accordion       | ✅     |
| Avatar          | ✅     |
| Calendar        |        |
| Checkbox        | ✅     |
| Collapsible     | ✅     |
| ComboBox        | ✅     |
| Command Menu    |        |
| Context Menu    | ✅     |
| Dialog          | ✅     |
| Dropdown Menu   | ✅     |
| Dropzone        |        |
| Hover Card      | ✅     |
| Label           | ✅     |
| Menubar         | ✅     |
| Navigation Menu |        |
| Pagination      | ✅     |
| Pin Input       | ✅     |
| Popover         | ✅     |
| Progress        | ✅     |
| Radio Group     | ✅     |
| Scroll Area     |        |
| Select          | ✅     |
| Separator       | ✅     |
| Slider          | ✅     |
| Spin Button     |        |
| Switch          | ✅     |
| Tabs            | ✅     |
| Tags Input      | ✅     |
| Toast           |        |
| Toggle          | ✅     |
| Toggle Group    | ✅     |
| Toolbar         | ✅     |
| Tooltip         | ✅     |
| Tree View       |        |
| ???             |        |

**Progress:** 26/???

## Similar projects

Looking for more? Check out these other projects too:

- [Shadcn Svelte](https://shadcn-svelte.com/)
- [Radix Svelte](https://radix-svelte.com/)
- [Skeleton](https://skeleton.dev/)
- [Svelte Headless UI](https://svelte-headlessui.goss.io/docs)
- [Flowbite Svelte](https://flowbite-svelte.com/)
- [Carbon Components Svelte](https://github.com/carbon-design-system/carbon-components-svelte/)
- [Svelte Material UI](https://sveltematerialui.com/)
- [SvelteStrap](https://github.com/bestguy/sveltestrap)
- [Noir UI](https://github.com/khairulhaaziq/noir-ui)
- [Zag](https://github.com/chakra-ui/zag)
- [Grail UI](https://grail-ui.vercel.app/)

This list is not exhaustive or sorted in any particular order. If you know of any other similar
projects for Svelte, feel free to open a PR to add them here.
