<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Opens when the trigger is focused or hovered',
		'Closes when the trigger is activated or with escape',
		'Custom delay for opening and closing',
		'Supports custom positioning',
	];
</script>

<Docs.H1>Hover Card</Docs.H1>
<Docs.Description>
	Displays additional information or options when the cursor hovers over a particular element.
</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The element that triggers the tooltip popover</Docs.Li>
	<Docs.Li><b>Content:</b> The tooltip's content container</Docs.Li>
	<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
</Docs.Ul>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.arrow} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
		>Tooltip WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
