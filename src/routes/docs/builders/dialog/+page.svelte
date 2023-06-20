<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import drawerCode from './drawer-code.ignore-svelte?raw';
	import Preview from './preview.svelte';
	import DrawerPreview from './drawer-preview.svelte';
</script>

<Docs.H1>Dialog</Docs.H1>
<Docs.Description>
	A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<div class="my-16" />

<Docs.Description>
	This overlay window can be used to display a variety of content, including dialogs, drawers,
	sidebars, and more. As an example, here's a drawer component that slides in from the left.
</Docs.Description>

<DrawerPreview />

<Docs.CodeBlock code={drawerCode} />

<Docs.Construction />
