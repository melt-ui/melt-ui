<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { preview } from './(examples)/(preview)';
	import { snippets } from './(snippets)/index';
	import { schemas } from './schemas';

	const features = [
		'Controlled or uncontrolled',
		'Ignored by screen readers',
		'Custom open and close delay support',
		'Positioning and alignment customization',
	];
</script>

<Docs.H1>Hover Card</Docs.H1>
<Docs.Description>
	Displays additional information or options when the cursor hovers over a particular element.
</Docs.Description>

<Docs.Preview {...preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The element that opens the hovercard on hover.</Docs.Li>
	<Docs.Li><b>Content:</b> The element containing the content for the hovercard.</Docs.Li>
	<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P class="mt-4"
	>Create a hovercard using the <Docs.Code>createHoverCard</Docs.Code> builder function.</Docs.P
>
<Docs.CodeBlock code={snippets.usage1} />

<Docs.P class="mt-4">
	Then you can use the <Docs.Code>trigger</Docs.Code>, <Docs.Code>content</Docs.Code>, and <Docs.Code
		>arrow</Docs.Code
	> to construct a hovercard. A high level example of how to structure the hovercard is shown below.
</Docs.P>
<Docs.CodeBlock code={snippets.usage2} />

<Docs.P>
	It's also possible to use Svelte Transitions, as demonstrated in the example at the top of this
	page.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.arrow} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	The hover card is only intended to be used with a mouse or other pointing device and doesn't
	respond to keyboard events.
</Docs.P>
