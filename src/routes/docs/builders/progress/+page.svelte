<script lang="ts">
	import { Docs } from '$routes/(components)';
	import code from './code.ignore-svelte?raw';
	import Preview from './preview.svelte';
</script>

<Docs.H1>Progress</Docs.H1>
<Docs.Description>
	Displays an indicator showing the completion progress of a task, typically displayed as a progress
	bar.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.Construction />
