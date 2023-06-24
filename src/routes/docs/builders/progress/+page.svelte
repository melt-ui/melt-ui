<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';
	export let data;

	const features = ['Assistive reading technology support for progress bar'];
</script>

<Docs.H1>Progress</Docs.H1>
<Docs.Description>
	Displays an indicator showing the completion progress of a task, typically displayed as a progress
	bar.
</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Progress / <code>progress</code>:</b> The progress component.</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create an progress bar component, use the <Docs.Code>createProgress</Docs.Code> builder function.
	Follow the anatomy or the example above to create your progress bar.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/meter/"
		>Meter WAI-ARIA design pattern</Docs.A
	>
</Docs.P>
