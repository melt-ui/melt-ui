<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';
  import { snippets } from './(snippets)';

	export let data;

	const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];
</script>

<Docs.H1>Toggle</Docs.H1>
<Docs.Description>A two-state button that can be either on or off.</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Toggle:</b> The toggle component</Docs.Li>
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

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.toggle} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
		>Button WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
