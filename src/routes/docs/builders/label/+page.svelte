<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { snippets } from './(snippets)';

	export let data;

	const features = [
		'Supports nested controls',
		'Disables text selection when double clicking the label',
	];
</script>

<Docs.H1>Label</Docs.H1>
<Docs.Description>A control that adds a label to an input element.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li>
		<b>Root:</b> The root container for the label
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P class="mt-4">
	To create a label, use the <Docs.Code>createLabel</Docs.Code> builder function and apply the <Docs.Code
		>root</Docs.Code
	> action to the label element.
</Docs.P>

<Docs.CodeBlock code={snippets.usage} />
