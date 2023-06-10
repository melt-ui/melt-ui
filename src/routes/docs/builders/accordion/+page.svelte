<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Accordion</Docs.H1>
<Docs.Description>
	A vertically stacked set of interactive headings that each reveal an associated section of
	content.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Full keyboard navigation.</Docs.Li>
	<Docs.Li>Supports horizontal/vertical orientation.</Docs.Li>
	<Docs.Li>Supports Right to Left direction.</Docs.Li>
	<Docs.Li>Can expand one or multiple items.</Docs.Li>
	<Docs.Li>Can be controlled or uncontrolled.</Docs.Li>
</Docs.Ul>

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
<Docs.CodeBlock collapsible={false} code={snippets.disable} />

<Docs.H3>Opening multiple items at once</Docs.H3>
<Docs.P>
	Pass in the <Docs.Code>type</Docs.Code> arg to <Docs.Code>createAccordion</Docs.Code> with a value
	of <Docs.Code>'multiple'</Docs.Code>.
</Docs.P>

<Docs.H3>Controlled access</Docs.H3>
<Docs.P>To programatically control the Accordion, you can use a reactive statement.</Docs.P>
<Docs.CodeBlock code={snippets.controlled} />

<Docs.H2>Accessibility</Docs.H2>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'createAccordion',
		description: 'Creates an accordion component.',
		args: [
			{
				label: 'type',
				type: "'single' | 'multiple'",
				default: "'single'",
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
			{
				label: 'onChange',
				type: '(value: string | string[] | undefined) => void;',
			},
			{
				label: 'value',
				type: 'string | string[] | undefined',
			},
		],
	}}
/>
