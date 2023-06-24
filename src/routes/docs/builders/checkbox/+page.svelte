<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas';
	import { snippets } from './(snippets)';

	export let data;

	const features = [
		'Supports indeterminate state',
		'Full keyboard navigation',
		'Can be controlled or uncontrolled',
	];
</script>

<Docs.H1>Checkbox</Docs.H1>
<Docs.Description
	>A control that allows the user to toggle between checked and not checked.</Docs.Description
>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the checkbox</Docs.Li>
	<Docs.Li><b>Input:</b> The native html input that is visually hidden.</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a checkbox, use the <Docs.Code>createCheckbox</Docs.Code> builder function. Follow the anatomy
	or the example above to create your checkbox.
</Docs.P>

<Docs.H3>Indeterminate state</Docs.H3>
<Docs.P>
	To create an indeterminate checkbox, set the <Docs.Code>checked</Docs.Code> argument as
	<Docs.Code>indeterminate</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.indeterminate} />

<Docs.H3>Disabling the checkbox</Docs.H3>
<Docs.P>
	To disable the checkbox, set the <Docs.Code>disabled</Docs.Code> argument as
	<Docs.Code>true</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.disable} />

<Docs.H3>Controlled access</Docs.H3>
<Docs.P>
	To programatically control the checkbox, you can directly set the <Docs.Code>checked</Docs.Code> store.
	You can also update the <Docs.Code>options</Docs.Code> store with new arguments.
</Docs.P>
<Docs.CodeBlock code={snippets.controlled} />

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/"
		>tri-state Checkbox WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
