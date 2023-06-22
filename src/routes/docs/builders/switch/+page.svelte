<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Switch</Docs.H1>
<Docs.Description>
	A control that allows the user to toggle between checked and not checked.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Full keyboard navigation</Docs.Li>
	<Docs.Li>Can be controlled or uncontrolled</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the switch</Docs.Li>
	<Docs.Li><b>Input:</b> The native html input that is visually hidden.</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a switch, use the <Docs.Code>createSwitch</Docs.Code> builder function. Follow the anatomy
	or the example above to create your switch.
</Docs.P>

<Docs.H3>Disabling the switch</Docs.H3>
<Docs.P>
	To disable a the switch, set the <Docs.Code>disabled</Docs.Code> argument as
	<Docs.Code>true</Docs.Code>.
</Docs.P>
<Docs.CodeBlock collapsible={false} code={snippets.disable} />

<Docs.H3>Controlled access</Docs.H3>
<Docs.P>
	To programmatically control the switch, you can directly set the <Docs.Code>checked</Docs.Code> store.
	You can also update the <Docs.Code>options</Docs.Code> store with new arguments.
</Docs.P>
<Docs.CodeBlock collapsible={false} code={snippets.controlled} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/">WAI-ARIA pattern</Docs.A>

<Docs.H3>Keyboard Interactions</Docs.H3>

<Docs.P>
	When the switch has focus, pressing <Docs.Kbd>Enter</Docs.Kbd> or <Docs.Kbd>Space</Docs.Kbd> key changes
	the state of the switch.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'createSwitch',
		description: 'The object you pass into createSwitch. Optional.',
		args: [
			{
				label: 'checked',
				type: 'boolean',
				default: false,
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
			{
				label: 'required',
				type: 'boolean',
				default: false,
			},
			{
				label: 'name',
				type: 'string',
			},
			{
				label: 'value',
				type: 'string',
			},
		],
	}}
/>
