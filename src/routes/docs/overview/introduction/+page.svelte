<script>
	import { Docs } from '$routes/(components)';
	import CodeBlock from '$routes/(components)/code-block.svelte';
	import { snippets } from './(snippets)';
</script>

<Docs.H1>Introduction</Docs.H1>
<Docs.P>
	Melt UI is a set of headless, accessible component builders for
	<Docs.A href="https://svelte.dev/">Svelte</Docs.A>
</Docs.P>

<Docs.Hr />

<Docs.H2>Features</Docs.H2>

<Docs.H3>Builder API</Docs.H3>
<Docs.P>
	Melt UI exposes builders, not components. A builder is a function that returns a set of props that
	can be passed to elements or components:
</Docs.P>
<Docs.CodeBlock code={snippets.builder} collapsible={false} />
<Docs.P>
	This is all you need to have a working Collapsible component in your Svelte application. The props
	automatically apply the needed attributes and event handlers to the element or component they are
	applied to.
</Docs.P>

<Docs.H3>Fully Extensible</Docs.H3>
<Docs.P>
	Melt UI's builders are headless, meaning they do not provide styles or markup. This allows you to
	extend them however you like, using your preferred styling solution, or adding custom
	functionality:
</Docs.P>
<Docs.CodeBlock code={snippets.extensible} collapsible={false} />

<Docs.H3>
	Strict adherence to <Docs.A href="https://www.w3.org/WAI/ARIA/apg/">WAI-ARIA guidelines</Docs.A>
</Docs.H3>
<Docs.P>
	The builders anatomy were designed to reflect the WAI-ARIA definitions, and the exposed props come
	out-of-the-box with the necessary ARIA attributes. All builders are tested using both automated
	tools and manually created test suites to guarantee that they are accessible.
</Docs.P>

<Docs.H3>
	Typescript and <Docs.A href="https://kit.svelte.dev/">SvelteKit</Docs.A> support out-of-the-box
</Docs.H3>
<Docs.P>
	All builders were made with Typescript and SvelteKit in mind. This very documentation is built
	using SvelteKit, and directly imports the builders from the source code for its examples.
</Docs.P>
