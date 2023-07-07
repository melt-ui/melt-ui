<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;

	const features = [
		'Full keyboard navigation',
		'Customize positioning of popover',
		'Can be controlled or uncontrolled',
		'Focus is fully managed',
		'Supports an optional arrow component',
	];
</script>

<Docs.H1>Datepicker</Docs.H1>
<Docs.Description>Displays rich content in a portal, triggered by a button.</Docs.Description>

<Docs.Preview {...data.preview} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The button(s) which open/close the popover.</Docs.Li>
	<Docs.Li><b>Content:</b> The content area viewed when the trigger is clicked.</Docs.Li>
	<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
	<Docs.Li><b>Close:</b> A button which closes the popover</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a popover, use the <Docs.Code>createPopover</Docs.Code> builder function. Follow the anatomy
	or the example above to create your popover.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />
<Docs.API schema={schemas.trigger} />
<Docs.API schema={schemas.arrow} />

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
		>Accordion WAI-ARIA design pattern</Docs.A
	>
</Docs.P>

<Docs.API schema={schemas.keyboard} />
