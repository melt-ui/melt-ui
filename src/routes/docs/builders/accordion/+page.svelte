<script lang="ts">
	import { Docs } from '$routes/(components)';
	import List from '$routes/(components)/api-reference/list.svelte';
	import { snippets } from './(snippets)';
	import { schemas } from './schemas';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Can expand one or multiple items',
		'Can be controlled or uncontrolled',
	];
</script>

<Docs.H1>Accordion</Docs.H1>
<Docs.Description>
	A vertically stacked set of interactive headings that each reveal an associated section of
	content.
</Docs.Description>

<Docs.Preview {...data.preview} fullwidth />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the accordion</Docs.Li>
	<Docs.Li>
		<b>Item:</b> The container for each accordion item
		<Docs.Ul>
			<Docs.Li><b>Trigger:</b> The trigger for the accordion item</Docs.Li>
			<Docs.Li>
				<b>Content:</b> The content area that is revealed when the trigger is clicked
			</Docs.Li>
		</Docs.Ul>
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create an accordion, use the <Docs.Code>createAccordion</Docs.Code> builder function. Follow the
	anatomy or the example above to create your accordion.
</Docs.P>

<Docs.H3>Disabling a single item</Docs.H3>
<Docs.P>
	To disable a single item, you can pass in an object instead of a string to the function.
</Docs.P>
<Docs.CodeBlock code={snippets.disable} />

<Docs.H3>Opening multiple items at once</Docs.H3>
<Docs.P>
	Pass in the <Docs.Code>type</Docs.Code> arg to <Docs.Code>createAccordion</Docs.Code> with a value
	of <Docs.Code>'multiple'</Docs.Code>.
</Docs.P>

<Docs.H3>Controlled access</Docs.H3>
<Docs.P>
	To programatically control the Accordion, you can directly set the <Docs.Code>value</Docs.Code> store.
	You can also update the <Docs.Code>options</Docs.Code> store with new arguments.
</Docs.P>
<Docs.CodeBlock code={snippets.controlled} />

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.item} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.content} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
		>Accordion WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<List />
