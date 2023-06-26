<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas';
	export let data;

	const features = [
		'Supports horizontal and vertical orientation',
		'Supports decorative and non-decorative separators',
	];
</script>

<Docs.H1>Separator</Docs.H1>
<Docs.Description>Displays a horizontal or vertical line to separate content.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li>
		<b>Root:</b> The root container for the separator
	</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/TR/wai-aria-1.2/#separator">Separator WAI-ARIA role</Docs.A>
</Docs.P>
