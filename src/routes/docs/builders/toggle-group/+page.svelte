<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;
	const features = [
		'Horizontal or vertical orientation',
		'Can be controlled or uncontrolled',
		'Full keyboard navigation',
	];
</script>

<Docs.H1>Toggle Group</Docs.H1>
<Docs.Description>A set of two-state buttons that can be toggled on or off.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The toggle group container component</Docs.Li>
	<Docs.Li><b>Item:</b> A toggle group item component</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
		>Button WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />


<Docs.Construction />
