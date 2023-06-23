<script>
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
</script>

<Docs.H1>Getting Started</Docs.H1>
<Docs.Description>A few steps to start using MeltUI in your projects</Docs.Description>

<Docs.H2>Installation</Docs.H2>
<Docs.P>
	First off, install Melt UI into your project by running the following command in your terminal:
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
<Docs.P sidenote>P.S. These tabs were built using Melt! Try using them with Arrow keys.</Docs.P>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	Melt UI exposes a number of component builders. Say you want a Collapsible component:
</Docs.P>

<Docs.CodeBlock code={snippets.builder} />

<Docs.P>
	You'll see that createCollapsible exposes a number of stores. Be careful! That is not always the
	case. Also, sometimes stores return functions, which may or may not expect an attribute. One such
	example is the <Docs.A href="/docs/builders/accordion" internal>Accordion</Docs.A> builder.
</Docs.P>

<Docs.H3>Styling</Docs.H3>
<Docs.P>
	Melt UI can be styled using any styling solution of your choice. Be it scoped/global CSS, an
	utility framework such as Tailwind, or even outside components (as long as you can pass in Melt's
	props to it).
</Docs.P>
<Docs.CodeBlock code={snippets.extensible} />

<Docs.H3>Animating</Docs.H3>
<Docs.P>
	When you pass in props returned from a builder to an element, it will automatically change some
	data and aria attributes. You can then use them for animation, if you wish.
</Docs.P>

<Docs.CodeBlock code={snippets.animation} />

<Docs.P>
	You can also use Svelte transitions if you wish. But beware, this may break some default behaviour
	in certain components, such as focus management.
</Docs.P>

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
