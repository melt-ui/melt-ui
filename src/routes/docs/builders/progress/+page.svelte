<script lang="ts">
	import { Docs } from '$routes/(components)';
	export let data;

	const features = ['Assistive reading technology support for progress bar'];
</script>

<Docs.H1>Progress</Docs.H1>
<Docs.Description>
	Displays an indicator showing the completion progress of a task, typically displayed as a progress
	bar.
</Docs.Description>

<Docs.Preview {...data.preview} />

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

<Docs.Construction />
