<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { h3 as H3, p as P } from '$docs/components/markdown';
	import { transformAPIString } from '$docs/utils';
	import { DataAttrTable, PropsTable } from '.';

	export let data: APISchema;
</script>

<H3>{data.title}</H3>
<P>{@html transformAPIString(data.description, true)}</P>

{#if data.props}
	<PropsTable data={data.props} />
{/if}

{#if data.dataAttributes}
	<DataAttrTable data={data.dataAttributes} />
{/if}
