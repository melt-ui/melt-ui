<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Toggle</Docs.H1>
<Docs.Description>A two-state button that can be either on or off.</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Full keyboard navigation</Docs.Li>
	<Docs.Li>Can be controlled or uncontrolled</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Toggle:</b> The trigger for the toggle</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a toggle, use the <Docs.Code>createToggle</Docs.Code> builder function. Follow the anatomy
	or the example above to create your toggle.
</Docs.P>

<Docs.H3>Disabling the toggle</Docs.H3>
<Docs.P>
	To disable a the toggle,, set the <Docs.Code>disabled</Docs.Code> argument as
	<Docs.Code>true</Docs.Code>.
</Docs.P>
<Docs.CodeBlock collapsible={false} code={snippets.disable} />

<Docs.H3>Controlled access</Docs.H3>
<Docs.P>
	To programmatically control the Toggle, you can directly set the <Docs.Code>pressed</Docs.Code> store.
	you can also directly set the <Docs.Code>disabled</Docs.Code> store.
</Docs.P>
<Docs.CodeBlock collapsible={false} code={snippets.controlled} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/button/">WAI-ARIA pattern</Docs.A>

<Docs.H3>Keyboard Interactions</Docs.H3>

<Docs.P>
	When the toggle has focus, pressing <Docs.Kbd>Enter</Docs.Kbd> or <Docs.Kbd>Space</Docs.Kbd> key changes
	the state of the toggle.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'createToggle',
		description: 'The object you pass into createToggle. Optional.',
		args: [
			{
				label: 'pressed',
				type: 'boolean',
				default: false,
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
		],
	}}
/>
