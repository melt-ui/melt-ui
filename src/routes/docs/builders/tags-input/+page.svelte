<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Type in the input and press enter to add tags',
		'Delete tags',
		'Disable everything or disable specific tags',
		'Option to only allow unique tags',
		'Keyboard navigation',
	];
</script>

<Docs.H1>Tags Input</Docs.H1>
<Docs.Description>Render tags inside an input, followed by an actual text input.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li>
		<b>root:</b> The root container for the tags input</Docs.Li
	>
	<Docs.Li><b>input:</b> The input textbox for adding new Tags</Docs.Li>
	<Docs.Li><b>tag:</b> The element that represents a tag</Docs.Li>
	<Docs.Li><b>deleteTrigger:</b> The element that represents the delete button for a tag</Docs.Li>
	<Docs.Li><b>options:</b> The current options</Docs.Li>
	<Docs.Li><b>tags:</b> The current tags</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.input} />
<Docs.API schema={schemas.tag} />
<Docs.API schema={schemas.deleteTrigger} />
<Docs.API schema={schemas.keyboard} />
