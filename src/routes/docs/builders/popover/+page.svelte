<script lang="ts">
	import { Docs } from '$routes/(components)';

	export let data;
</script>

<Docs.H1>Popover</Docs.H1>
<Docs.Description>Displays rich content in a portal, triggered by a button.</Docs.Description>

<Docs.Preview {...data.preview} />

<Docs.H2>Features</Docs.H2>
<Docs.Ul>
	<Docs.Li>Full keyboard navigation.</Docs.Li>
	<Docs.Li>Customize positioning of popover.</Docs.Li>
	<Docs.Li>Can be controlled or uncontrolled.</Docs.Li>
	<Docs.Li>Focused is managed and customizable (soon).</Docs.Li>
</Docs.Ul>

<Docs.H2>Anatomy</Docs.H2>
<Docs.Ul>
	<Docs.Li><b>Trigger:</b> The trigger for the popover</Docs.Li>
	<Docs.Li
		><b>Content:</b> The content area reviewed when the trigger is clicked.

		<Docs.Ul>
			<Docs.Li><b>Arrow:</b> An optional arrow component</Docs.Li>
		</Docs.Ul>
	</Docs.Li>
</Docs.Ul>

<Docs.H2>Usage</Docs.H2>
<Docs.P>
	To create a popover, use the <Docs.Code>createPopover</Docs.Code> builder function. Follow the anatomy
	or the example above to create your popover.
</Docs.P>

<Docs.Construction />
