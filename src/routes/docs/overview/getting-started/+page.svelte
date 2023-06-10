<script>
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
</script>

<Docs.H1>Getting Started</Docs.H1>

<Docs.Hr />

<Docs.H2>Installing</Docs.H2>
<Docs.P>
	First off, install Melt UI into your project by running the following command in your terminal:
</Docs.P>
<Docs.Tabs tabs={['npm', 'yarn', 'pnpm']} let:tab>
	{#if tab === 'npm'}
		<Docs.CodeBlock inline code={'npm install @melt-ui/svelte'} collapsible={false} />
	{:else if tab === 'yarn'}
		<Docs.CodeBlock inline code={'yarn install @melt-ui/svelte'} collapsible={false} />
	{:else if tab === 'pnpm'}
		<Docs.CodeBlock inline code={'pnpm install @melt-ui/svelte'} collapsible={false} />
	{/if}
</Docs.Tabs>
<Docs.P sidenote>P.S. These tabs were built using Melt! Try using them with Arrow keys.</Docs.P>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	Melt UI exposes a number of component builders. Say you want a Collapsible component:
</Docs.P>

<Docs.CodeBlock code={snippets.builder} collapsible={false} />

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
<Docs.CodeBlock code={snippets.extensible} collapsible={false} />

<Docs.H3>Animating</Docs.H3>
<Docs.P>
	When you pass in props returned from a builder to an element, it will automatically change some
	data and aria attributes. You can then use them for animation, if you wish.
</Docs.P>

<Docs.CodeBlock code={snippets.animation} collapsible={false} />

<Docs.P>
	You can also use Svelte transitions if you wish. But beware, this may break some default behaviour
	in certain components, such as focus management.
</Docs.P>

<Docs.CodeBlock code={snippets.svelteTransitions} collapsible={false} />
