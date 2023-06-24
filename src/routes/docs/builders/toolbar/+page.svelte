<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Can be controlled or uncontrolled',
		'Horizontal or vertical orientation',
	];
</script>

<Docs.H1>Toolbar</Docs.H1>
<Docs.Description>
	A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.
</Docs.Description>

<Docs.Preview {...data.preview} fullwidth />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>API Reference</Docs.H2>

<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.button} />
<Docs.API schema={schemas.link} />

<Docs.API schema={schemas.groupBuilder} />
<Docs.API schema={schemas.groupRoot} />
<Docs.API schema={schemas.groupItem} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
		>Toolbar WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
