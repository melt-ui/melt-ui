<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { preview } from './(examples)/(preview)';
	import { schemas } from './schemas';

	const features = [
		'Fully managed focus',
		'Can be controlled or uncontrolled',
		'Esc closes the component automaticlaly',
	];
</script>

<Docs.H1>Pin Input</Docs.H1>
<Docs.Description>A sequence of one-character alphanumeric inputs.</Docs.Description>

<Docs.Preview {...preview} />
<Docs.Construction />
<Docs.Features {features} />

<Docs.API schema={schemas.keyboard} />
