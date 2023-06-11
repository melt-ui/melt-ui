<script lang="ts">
	import { Docs } from '$routes/(components)';
	import Preview from './preview.svelte';
	import previewCode from './preview.svelte?raw';
</script>

<Docs.H1>Popover</Docs.H1>
<Docs.Description>A popover component.</Docs.Description>

<Preview />

<Docs.CodeBlock code={previewCode} />
