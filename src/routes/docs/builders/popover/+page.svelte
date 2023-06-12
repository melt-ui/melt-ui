<script lang="ts">
	import { Docs } from '$routes/(components)';
	import Preview from './preview.svelte';
	import previewCode from './preview.svelte?raw';
</script>

<Docs.H1>Popover</Docs.H1>
<Docs.Description>Displays rich content in a portal (soon), triggered by a button.</Docs.Description
>

<Preview />

<Docs.CodeBlock code={previewCode} />
