<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';
	export let data;

	const features = [
		'Full keyboard navigation',
		'Can be controlled or uncontrolled',
		'Supports horizontal and vertical orientation',
	];
</script>

<Docs.H1>Radio Group</Docs.H1>
<Docs.Description
	>A set of checkable buttons — known as radio buttons — where no more than one of the buttons can
	be checked at a time.</Docs.Description
>

<Docs.Preview {...data.preview} />
<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root / <code>root</code>:</b> The root container for the radio group</Docs.Li>
	<Docs.Li>
		<b>Item / <code>item</code>:</b> The individual radio button items
	</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.item} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
		>Radio Group WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
