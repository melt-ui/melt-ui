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
<Docs.P>
	To programatically control the Accordion, you can directly set the <Docs.Code>value</Docs.Code> store.
	You can also update the <Docs.Code>options</Docs.Code> store with new arguments.
</Docs.P>
<Docs.CodeBlock code={snippets.controlled} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/">WAI-ARIA pattern</Docs.A>

<Docs.H3>Keyboard Navigation</Docs.H3>

<Docs.Ul>
	<Docs.Li>
		<Docs.Kbd>Enter</Docs.Kbd> or <Docs.Kbd>Space</Docs.Kbd>:
		<Docs.Ul>
			<Docs.Li>
				When focus is on the accordion header for a collapsed panel, expands the associated panel.
				If the implementation allows only one panel to be expanded, and if another panel is
				expanded, collapses that panel.
			</Docs.Li>

			<Docs.Li>
				When focus is on the accordion header for an expanded panel, collapses the panel if the
				implementation supports collapsing. Some implementations require one panel to be expanded at
				all times and allow only one panel to be expanded; so, they do not support a collapse
				function.
			</Docs.Li>
		</Docs.Ul>
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>Tab</Docs.Kbd>: Moves focus to the next focusable element; all focusable elements in
		the accordion are included in the page Tab sequence.
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>Shift</Docs.Kbd> + <Docs.Kbd>Tab</Docs.Kbd>: Moves focus to the previous focusable
		element; all focusable elements in the accordion are included in the page Tab sequence.
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>Down Arrow</Docs.Kbd>: If focus is on an accordion header, moves focus to the next
		accordion header. If focus is on the last accordion header, either does nothing or moves focus
		to the first accordion header.
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>Up Arrow</Docs.Kbd>: If focus is on an accordion header, moves focus to the previous
		accordion header. If focus is on the first accordion header, either does nothing or moves focus
		to the last accordion header.
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>Home</Docs.Kbd>: When focus is on an accordion header, moves focus to the first
		accordion header.
	</Docs.Li>
	<Docs.Li>
		<Docs.Kbd>End</Docs.Kbd>: When focus is on an accordion header, moves focus to the last
		accordion header.
	</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'createAccordion Config',
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
				label: 'value',
				type: 'string | string[] | undefined',
			},
		],
	}}
/>
