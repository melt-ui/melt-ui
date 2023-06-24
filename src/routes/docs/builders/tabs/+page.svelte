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

<Docs.H1>Tabs</Docs.H1>
<Docs.Description>
	A set of layered sections of content—known as tab panels—that are displayed one at a time.
</Docs.Description>

<Docs.Preview component={data.preview.component} code={data.preview.code} />
<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Root:</b> The root container for the tab component</Docs.Li>
	<Docs.Li>
		<b>List:</b> The container for the tab triggers
	</Docs.Li>
	<Docs.Li>
		<b>Trigger:</b> The button(s) that open/close the tab panels
	</Docs.Li>
	<Docs.Li>
		<b>Content:</b> The container for the tab panels
	</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.root} />
<Docs.API schema={schemas.list} />
<Docs.API schema={schemas.trigger} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/"
		>Tabs WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />

<Docs.Construction />
