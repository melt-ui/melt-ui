<script>
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
</script>

<Docs.H1>Getting Started</Docs.H1>
<Docs.Description>Just a few steps to start using MeltUI in your projects</Docs.Description>

<Docs.H2>Installation</Docs.H2>
<Docs.P class="mb-2">
	Alright, let's get started! To install Melt UI into your project, simply run this command in your
	terminal:
</Docs.P>
<Docs.Tabs tabs={['npm', 'yarn', 'pnpm']} let:tab>
	{#if tab === 'npm'}
		<Docs.CodeBlock code={'npm install @melt-ui/svelte'} />
	{:else if tab === 'yarn'}
		<Docs.CodeBlock code={'yarn add @melt-ui/svelte'} />
	{:else if tab === 'pnpm'}
		<Docs.CodeBlock code={'pnpm install @melt-ui/svelte'} />
	{/if}
</Docs.Tabs>
<Docs.Callout>P.S. These tabs were built using Melt! Try using them with Arrow keys.</Docs.Callout>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	Melt UI exposes a number of component builders. Say you want a Collapsible component:
</Docs.P>

<Docs.CodeBlock code={snippets.builder} />

<Docs.P>
	You'll see that <Docs.Code>createCollapsible</Docs.Code>
	exposes a number of stores.

	<Docs.Callout type="danger">
		Be careful! That is not always the case. Sometimes stores also return functions, which may or
		may not expect an attribute. One such example is the <Docs.A
			href="/docs/builders/accordion"
			internal>Accordion</Docs.A
		> builder.
	</Docs.Callout>
</Docs.P>

<Docs.H3>Styling</Docs.H3>
<Docs.P>
	Melt UI leaves the styles up to you. Whether you prefer scoped or global CSS, a utility framework
	like Tailwind, or third-party components (as long as you can pass in Melt's props), it's all good.
</Docs.P>
<Docs.CodeBlock code={snippets.extensible} />

<Docs.H3>Animating</Docs.H3>
<Docs.P>
	By passing builder returned props to an element, certain data and aria attributes will
	automatically be altered for you. These changes can then be utilized for animation purposes,
	should you desire to do so.
</Docs.P>

<Docs.CodeBlock code={snippets.animation} />

<Docs.Callout>
	Svelte transitions can also be utilized. However, it is important to note that this may interfere
	with default functionality in particular components, such as focus management, so proceed with
	caution.
</Docs.Callout>

<Docs.CodeBlock code={snippets.svelteTransitions} />

<Docs.H2>Need help?</Docs.H2>
<Docs.P>
	In case you've run into a bug, an unexpected behaviour, or would like to request new features,
	feel free to <Docs.A href="https://github.com/melt-ui/melt-ui/issues/new/choose">
		open an issue up on GitHub
	</Docs.A>.
</Docs.P>
<Docs.P>
	You can also reach out to us over on <Docs.A href="https://discord.com/invite/2QDjZkYunf">
		Discord
	</Docs.A>.
</Docs.P>
