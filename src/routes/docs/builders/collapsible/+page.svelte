<script lang="ts">
	import { Docs } from '$routes/(components)';

	export let data;
</script>

<Docs.H1>Collapsible</Docs.H1>
<Docs.Description>An interactive component which expands/collapses a panel.</Docs.Description>

<Docs.Preview {...data.preview} fullwidth />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Full keyboard navigation</Docs.Li>
	<Docs.Li>Svelte transition support</Docs.Li>
	<Docs.Li>Can be controlled or uncontrolled</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the collapsible</Docs.Li>
	<Docs.Li>
		<b>Trigger:</b> The trigger for the collapsible
	</Docs.Li>
	<Docs.Li>
		<b>Content:</b> The content area that is revealed when the trigger is clicked
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Accessibility</Docs.H2>
<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/">WAI-ARIA pattern</Docs.A>

<Docs.H3>Keyboard Interactions</Docs.H3>
<Docs.P>When the trigger has focus</Docs.P>
<Docs.Ul>
	<Docs.Li
		><Docs.Kbd>Enter</Docs.Kbd>: activates the trigger and toggles the visibility of the collapsible
		content</Docs.Li
	>
	<Docs.Li
		><Docs.Kbd>Space</Docs.Kbd>: activates the trigger and toggles the visibility of the collapsible
		content</Docs.Li
	>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API
	schema={{
		title: 'CreateCollapsibleArgs',
		description: 'The object you pass into createCollapsible. Optional.',
		args: [
			{
				label: 'open',
				type: 'boolean',
				default: 'false',
			},
			{
				label: 'disabled',
				type: 'boolean',
				default: false,
			},
		],
	}}
/>

<Docs.Construction />
