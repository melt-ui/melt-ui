<script lang="ts">
	import { Docs } from '$routes/(components)';
	import Preview from './preview.svelte';
	import previewCode from './preview.svelte?raw';
</script>

<Docs.H1>Tooltip</Docs.H1>
<Docs.Description>
	A popup that displays information related to an element when the element receives keyboard focus
	or the mouse hovers over it.
</Docs.Description>

<Preview />

<Docs.CodeBlock code={previewCode} />

<Docs.Construction />
