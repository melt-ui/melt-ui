<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Dialog</Docs.H1>
<Docs.Description>
	A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
