<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';

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
<Docs.API
	schema={{
		title: 'CreateAccordionArgs',
		description: 'The object you pass into createAccordion. Optional.',
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

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
		>Accordion WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API
	schema={{
		title: 'Keyboard Interactions',
		description: '',
		keyboardInteractions: [
			{
				key: 'Space',
				description: 'When focus is on a trigger of a collapsed section, expands the section.',
			},
			{
				key: 'Enter',
				description: 'When focus is on a trigger of a collapsed section, expands the section.',
			},
			{
				key: 'Tab',
				description:
					'Moves focus to the next focusable element; all focusable elements in the accordion are included in the page Tab sequence.',
			},
			{
				key: 'Shift + Tab',
				description:
					'Moves focus to the previous focusable element; all focusable elements in the accordion are included in the page Tab sequence.',
			},
			{
				key: 'ArrowDown',
				description:
					'If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header.',
			},
			{
				key: 'ArrowUp',
				description:
					'If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.',
			},
			{
				key: 'Home',
				description:
					'When focus is on an accordion header, moves focus to the first accordion header.',
			},
			{
				key: 'End',
				description:
					'When focus is on an accordion header, moves focus to the last accordion header.',
			},
		],
	}}
/>
