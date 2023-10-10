[![](https://img.shields.io/npm/v/@melt-ui/svelte?style=flat)](https://www.npmjs.com/package/@melt-ui/svelte)
![npm](https://img.shields.io/npm/dw/%40melt-ui%2Fsvelte?style=flat&color=orange)
[![](https://img.shields.io/github/actions/workflow/status/melt-ui/melt-ui/ci.yaml?style=flat)](https://github.com/melt-ui/melt-ui/actions/workflows/ci.yaml)
![](https://img.shields.io/github/license/melt-ui/melt-ui?style=flat)
[![](https://dcbadge.vercel.app/api/server/2QDjZkYunf?style=flat)](https://discord.gg/2QDjZkYunf)

![](static/banner.png)

[Melt UI](https://www.melt-ui.com/) is a set of headless, accessible component builders for Svelte.

[Bug Report](https://github.com/melt-ui/melt-ui/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%F0%9F%90%9BBug%3A) · [Builder](https://github.com/melt-ui/melt-ui/issues/new?assignees=&labels=builder&projects=&template=component.md&title=%E2%9C%A8+Builder%3A) · [Documentation](https://github.com/melt-ui/melt-ui/issues/new?assignees=&labels=documentation&projects=&template=documentation.md&title=%F0%9F%93%81Docs%3A) · [Feature Request](https://github.com/melt-ui/melt-ui/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%F0%9F%8C%9FFeature+request%3A) · [Tech Debt](https://github.com/melt-ui/melt-ui/issues/new?assignees=&labels=tech+debt&projects=&template=tech-debt.md&title=%E2%9A%99Tech+Debt%3A)

## About

Melt UI is meant to be used as a base for your own styles and components. It offers:

- Uncoupled builders that can be attached to any element/component
- Typescript and [SvelteKit](https://kit.svelte.dev/) support out-of-the-box
- Strict adherence to [WAI-ARIA guidelines](https://www.w3.org/WAI/ARIA/apg/)
- Easy to use examples and documentation
- A high emphasis on accessibility, extensibility, quality and consistency

## Getting started

Run our installer script to get started:

```sh
npx @melt-ui/cli@latest init
```

Import the builders to your code and start using them:

```html
<script>
	import { createCollapsible, melt } from '@melt-ui/svelte'

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible()
</script>

<div use:melt="{$root}">
	<button use:melt="{$trigger}">{$open ? 'Close' : 'Open'}</button>
	<div use:melt="{$content}">Obi-Wan says: Hello there!</div>
</div>
```

## Contributing

**Contributions are welcome and encouraged!**

Melt UI is under active development. Currently planned features can be found in the
[issues tab](https://github.com/melt-ui/melt-ui/issues), alongside bug reports.

We work on this project on a volunteer basis in our free time. If you notice something that hasn't
been implemented yet or could be improved, do consider contributing to the project! The goal is to
enhance the experience of building with Svelte and improve the ecosystem for everyone.

Check out our [Contributing guide](./CONTRIBUTING.md) to learn more.

## Community

Got any questions? Want to talk to the maintainers?

Our [Discord community](https://discord.gg/2QDjZkYunf) is a great place to get in touch with us, and
we'd love to have you there.

[![Melt UI Discord community](https://invidget.switchblade.xyz/2QDjZkYunf?theme=dark)](https://discord.gg/2QDjZkYunf)

## Similar projects

Looking for more? Check out the
[other component library projects available for Svelte](https://sveltesociety.dev/components#design-systems).

## Thanks to all Contributors

Thank you very much for taking your time to help Melt.

[![Contributors](https://contrib.rocks/image?repo=melt-ui/melt-ui)]([https://github.com/codemaniac-sahil/news-webapp-api](https://github.com/melt-ui/melt-ui)https://github.com/melt-ui/melt-ui/graphs/contributors)
