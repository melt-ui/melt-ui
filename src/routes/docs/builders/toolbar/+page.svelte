<script lang="ts">
	import { Docs } from '$routes/(components)';
	import Preview from './preview.svelte';
	import previewCode from './code.ignore-svelte?raw';
</script>

<Docs.H1>Toolbar</Docs.H1>
<Docs.Description>
	A container for grouping a set of controls, such as buttons, toggle groups or dropdown menus.
</Docs.Description>

<Preview />

<Docs.CodeBlock code={previewCode} />

<Docs.Construction />
