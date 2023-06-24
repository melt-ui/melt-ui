<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Svelte transition support',
		'Can be controlled or uncontrolled',
	];
</script>

<Docs.H1>Collapsible</Docs.H1>
<Docs.Description>An interactive component which expands/collapses a panel.</Docs.Description>

<Docs.Preview {...data.preview} fullwidth />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the collapsible</Docs.Li>
	<Docs.Li>
		<b>Trigger:</b> The trigger for the collapsible
	</Docs.Li>
	<Docs.Li>
		<b>Content:</b> The content area that is revealed when the trigger is clicked
	</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
		>Disclosure WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
