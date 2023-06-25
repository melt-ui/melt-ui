<script>
	import { Docs } from '$routes/(components)';

	import { snippets } from './(snippets)';
</script>

<Docs.H1>Introduction</Docs.H1>
<Docs.Description>
	Melt UI is a set of headless, accessible component builders for
	<Docs.A href="https://svelte.dev/">Svelte</Docs.A>
</Docs.Description>

<Docs.Construction
	>Melt UI is in its early stages. Expect breaking changes! And lots of new features! 🔥</Docs.Construction
>

<Docs.H2>Features</Docs.H2>

<Docs.H3>Builder API</Docs.H3>
<Docs.P>
	Melt UI provides access to builders instead of components. Builders are functional units that
	generate a collection of properties that can be assigned to any element or component.
</Docs.P>
<Docs.CodeBlock code={snippets.builder} />
<Docs.P>
	This is all you need to have a working Collapsible component in your application. The builders
	automatically apply the necessary attributes and event handlers to your selected element or
	component, ensuring that everything works seamlessly.
</Docs.P>

<Docs.H3>Fully Extensible</Docs.H3>
<Docs.P>
	Melt UI's builders are 'headless', which means they won't force any particular styles or markup on
	you. You can tweak them as you like, using your preferred styling solution or adding custom
	functionality. It's super flexible, letting you create custom interfaces that look and work just
	the way you want, without being tied down to any pre-defined styles or markup.
</Docs.P>
<Docs.CodeBlock code={snippets.extensible} />

<Docs.H3>
	Strict adherence to <Docs.A href="https://www.w3.org/WAI/ARIA/apg/">WAI-ARIA guidelines</Docs.A>
</Docs.H3>
<Docs.P>
	Melt UI's builders were designed to match the WAI-ARIA definitions closely. This means that the
	anatomy of each builder has been carefully crafted to include all the right attributes and
	properties needed to ensure accessibility. When using the builders, you get all the necessary ARIA
	attributes right out of the box. Plus, you can rest easy knowing that we extensively test each
	builder, both with automated tools and manual testing, to guarantee that they meet accessibility
	standards.
</Docs.P>

<Docs.H3>
	Typescript and <Docs.A href="https://kit.svelte.dev/">SvelteKit</Docs.A> support out-of-the-box
</Docs.H3>
<Docs.P>
	Melt UI's builders were made with Typescript and SvelteKit. This documentation itself was built
	with SvelteKit and draws examples directly from Melt UI's source code, making it simple to follow
	along and get started quickly.
</Docs.P>

<Docs.H2>Inspiration</Docs.H2>
<Docs.P>
	We're big fans of open source and love working collaboratively. Over time, we've taken cues from
	some really amazing projects and people that have motivated us to continuously improve our ideas.
</Docs.P>
<Docs.P>Some of the project's we've been inspired by in no particular order:</Docs.P>
<Docs.Ul>
	<Docs.Li>
		Zag - <Docs.A href="https://zagjs.com/">https://zagjs.com</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Radix UI - <Docs.A href="https://radix-ui.com/">https://radix-ui.com</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Grail UI - <Docs.A href="https://grail-ui.com/">https://grail-ui.com</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Skeleton - <Docs.A href="https://grail-ui.com/">https://skeleton.dev</Docs.A>
	</Docs.Li>
</Docs.Ul>
