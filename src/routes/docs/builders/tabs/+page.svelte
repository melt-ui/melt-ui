<script lang="ts">
	import { Docs } from '$routes/(components)';

	export let data;
</script>

<Docs.H1>Tabs</Docs.H1>
<Docs.Description>
	A set of layered sections of content—known as tab panels—that are displayed one at a time.
</Docs.Description>

<Docs.Preview component={data.preview.component} code={data.preview.code} />

<Docs.Construction />
