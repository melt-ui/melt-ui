<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { preview } from './(examples)/(preview)';
	import { schemas } from './schemas';

	const features = [
		'Fully managed focus',
		'Supports pasting from clipboard',
		'Keyboard navigation',
	];
</script>

<Docs.H1>Pin Input</Docs.H1>
<Docs.Description>A sequence of one-character alphanumeric inputs.</Docs.Description>

<Docs.Preview {...preview} />
<Docs.Construction />
<Docs.Features {features} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.API schema={schemas.keyboard} />
