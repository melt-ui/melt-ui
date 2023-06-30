<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { Section } from './(sections)/index.js';
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
		'Set a maximum number of tags',
		'Support for allowed list and denied list',
		'Pass in a custom validator',
		'Pass in an add function to run before adding a tag',
	];
</script>

<Docs.H1>Tags Input</Docs.H1>
<Docs.Description>Render tags inside an input, followed by an actual text input.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Section.Anatomy />

<Section.Usage />

<Section.Description />

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.tag} />
<Docs.API schema={schemas.deleteTrigger} />
<Docs.API schema={schemas.keyboard} />
