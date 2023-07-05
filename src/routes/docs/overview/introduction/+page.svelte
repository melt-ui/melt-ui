<script>
	import { Docs } from '$routes/(components)';

	import { snippets } from './(snippets)';
</script>

<Docs.H1>Introduction</Docs.H1>
<Docs.Description>
	An open-source collection of accessible, reusable, and composable component builders and utilities
	for crafting delightful user interfaces with
	<Docs.A href="https://svelte.dev/">Svelte</Docs.A>
</Docs.Description>

<Docs.P
	>Melt UI empowers developers to create accessible UI components that embody their unique style.
	With a strong focus on accessibility, complete styling control, limitless customization options,
	simplified development, and an overall delightful developer experience, Melt UI strives to be the
	ultimate toolkit for crafting exceptional user interfaces.</Docs.P
>

<Docs.Construction
	>Melt UI is in its early stages. Expect breaking changes! And lots of new features! 🔥</Docs.Construction
>

<Docs.H2>Features</Docs.H2>

<Docs.H3>Builder API</Docs.H3>
<Docs.P>
	Unlike a traditional component library, Melt UI provides access to builders instead of components.
	Builders are just functions that generate a collection of properties that can be assigned to any
	element or component.
</Docs.P>
<Docs.CodeBlock code={snippets.builder} />
<Docs.P>
	This is all you need to have a working Collapsible component in your application. The builders
	automatically apply the necessary attributes and event handlers to your element or component.
</Docs.P>

<Docs.H3>Accessible by Design</Docs.H3>
<Docs.P>
	Melt UI puts accessibility front and center, making sure your UI components are inclusive and
	user-friendly. We follow <Docs.A href="https://www.w3.org/WAI/ARIA/apg/"
		>WAI-ARIA design patterns</Docs.A
	> and take care of all the nitty-gritty details like aria attributes, role management, focus handling,
	and keyboard navigation. Each builder's page includes a section on accessibility, with references to
	relevant WAI-ARIA guidelines & instructions for using the builder in an accessible manner.
</Docs.P>

<Docs.H3>Bring Your Own Styles</Docs.H3>
<Docs.P>
	The builders ship with zero predefined styles, allowing you to customize them to seamlessly
	integrate with your application's design system. Whether you prefer vanilla CSS, CSS
	preprocessors, or CSS-in-JS libraries, our components work harmoniously with your preferred
	styling solution.
</Docs.P>

<Docs.H3>Open & Extensible</Docs.H3>
<Docs.P>
	Melt UI embraces your desire for customization. The builder architecture is open and flexible,
	allowing you to tinker with every aspect of the components. Wrap them, extend their functionality,
	or add event listener and props to tailor them to your exact needs. Consider it your personal UI
	workshop, empowering you to bring your unique vision to life.
</Docs.P>

<Docs.H3>Simplified DX</Docs.H3>
<Docs.P>
	We're here to simplify your development journey. By default, Melt UI components are uncontrolled,
	freeing you from the burden of managing local states. However, if you prefer greater control, you
	can seamlessly switch to controlled components. We handle the behind-the-scenes complexity,
	ensuring a smooth and hassle-free setup. Enjoy a frictionless experience from the get-go.
</Docs.P>

<Docs.H3>
	Typescript & <Docs.A href="https://kit.svelte.dev/">SvelteKit</Docs.A> Support
</Docs.H3>
<Docs.P>
	Melt UI offers a fully-typed API, safeguarding your code while providing autocompletion
	superpowers in your preferred code editor. All our components share a consistent API, promoting
	familiarity and minimizing surprises. The components are also build with SSR in mind, making them
	a perfect fit for SvelteKit.
</Docs.P>

<Docs.H2>Inspiration & Credits</Docs.H2>
<Docs.P>
	We're big fans of open source and love working collaboratively. Over time, we've taken cues &
	inspiration from some really amazing projects and people that have motivated us to continuously
	improve our ideas.
</Docs.P>
<Docs.P>Some of the project's we've been inspired by in no particular order:</Docs.P>
<Docs.Ul>
	<Docs.Li>
		Radix UI - <Docs.A href="https://radix-ui.com/">Radix UI</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Skeleton - <Docs.A href="https://skeleton.dev">https://skeleton.dev</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Zag - <Docs.A href="https://zagjs.com/">https://zagjs.com</Docs.A>
	</Docs.Li>
	<Docs.Li>
		Grail UI - <Docs.A href="https://grail-ui.vercel.app/">https://grail-ui.vercel.app</Docs.A>
	</Docs.Li>
</Docs.Ul>
