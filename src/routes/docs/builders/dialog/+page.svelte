<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { schemas } from './schemas.js';

	export let data;
	const features = [
		'Fully managed focus',
		'Can be controlled or uncontrolled',
		'Esc closes the component automaticlaly',
	];
</script>

<Docs.H1>Dialog</Docs.H1>
<Docs.Description>
	A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.
</Docs.Description>

<Docs.Preview {...data.dialog} />
<Docs.Construction />

<Docs.Features {features} />

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The button(s) that open the dialog</Docs.Li>
	<Docs.Li><b>Overlay:</b> The dim background that is typically behind a dialog element.</Docs.Li>
	<Docs.Li
		><b>Content:</b> Container for the content within the dialog.
		<Docs.Ul>
			<Docs.Li><b>Title:</b>The title of the dialog</Docs.Li>
			<Docs.Li>
				<b>Description:</b> The description which supports the title
			</Docs.Li>
			<Docs.Li><b>Close:</b> The button(s) that close the dialog</Docs.Li>
		</Docs.Ul>
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a dialog, use the <Docs.Code>createDialog</Docs.Code> builder function. You can then reference
	the anatomy or example above to create your dialog.
</Docs.P>

<Docs.H2>API Reference</Docs.H2>
<Docs.API schema={schemas.builder} />

<Docs.H2>Example Components</Docs.H2>
<Docs.H3>Drawer</Docs.H3>

<Docs.Description class="text-base">
	This overlay window can be used to display a variety of content, including dialogs, drawers,
	sidebars, and more. As an example, here's a drawer component that slides in from the left.
</Docs.Description>

<!-- <Docs.Preview {...data.drawer} /> -->

<Docs.H2>Accessibility</Docs.H2>
<Docs.P>
	Adheres to the
	<Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog/"
		>Dialog WAI-ARIA design pattern</Docs.A
	> & <Docs.A href="https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/"
		>Alert Dialog WAI-ARIA design pattern</Docs.A
	>
</Docs.P>
<Docs.API schema={schemas.keyboard} />
