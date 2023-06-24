<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = ['Full keyboard navigation', 'Can be controlled or uncontrolled'];
</script>

<Docs.H1>Toggle</Docs.H1>
<Docs.Description>A two-state button that can be either on or off.</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Toggle:</b> The toggle component</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.toggle} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
		>Button WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
