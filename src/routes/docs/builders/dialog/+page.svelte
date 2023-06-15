<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import code2 from './code2.ignore-svelte?raw';
	import Preview from './preview.svelte';
	import Preview2 from './preview2.svelte';
</script>

<Docs.H1>Dialog</Docs.H1>
<Docs.Description>
	A window overlaid on either the primary window or another dialog window, rendering the content
	underneath inert.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<div class="my-16" />

<Preview2 />

<Docs.CodeBlock code={code2} />

<Docs.Construction />
