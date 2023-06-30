<script lang="ts">
	import { Docs } from '$routes/(components)';
	import Deconstruction from './(sections)/Deconstruction.svelte';
	import { Section } from './(sections)/index.js';
	import { snippets } from './(snippets)/index.js';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Type in the input and press enter to add tags',
		'Delete tags',
		'Disable everything or disable specific tags',
		'Keyboard navigation',
		'On blur do nothing, add tag or clear input',
		'Only allow unique tags',
		'Allow adding a tag on paste',
		'Support for allowed list and denied list',
		'Pass in a custom validator',
	];
</script>

<Docs.H1>Tags Input</Docs.H1>
<Docs.Description>Render tags inside an input, followed by an actual text input.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Section.Anatomy />

<Docs.H2>Usage</Docs.H2>
<Docs.P class="mt-4">
	Use the <Docs.Code>createTagsInput</Docs.Code> builder function.
	<Docs.Callout type="info">
		See <Docs.Code>API Reference</Docs.Code> &#8250; <Docs.Code>CreateTagsInputArgs</Docs.Code> for available
		arguments
	</Docs.Callout>
	<Docs.CodeBlock code={snippets.usage1} />
</Docs.P>

<Docs.P class="mt-4">
	Use the return values to construct a <Docs.Code>tags-input</Docs.Code>.
</Docs.P>
<Docs.CodeBlock code={snippets.usage2} />

<Section.Deconstruction />

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.tag} />
<Docs.API schema={schemas.deleteTrigger} />
<Docs.API schema={schemas.keyboard} />
