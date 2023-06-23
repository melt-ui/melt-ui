<script lang="ts">
	import { Docs } from '$routes/(components)';

	export let data;
</script>

<Docs.H1>Dialog</Docs.H1>
<Docs.Description>
	A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.
</Docs.Description>

<Docs.Preview {...data.dialog} />

<Docs.H2>Example Components</Docs.H2>
<Docs.H3>Drawer</Docs.H3>

<Docs.Description class="text-base">
	This overlay window can be used to display a variety of content, including dialogs, drawers,
	sidebars, and more. As an example, here's a drawer component that slides in from the left.
</Docs.Description>

<Docs.Preview {...data.drawer} />

<Docs.Construction />
