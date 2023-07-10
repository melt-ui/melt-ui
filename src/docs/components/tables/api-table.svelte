<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { h3 as H3, p as P } from '$docs/components/markdown';
	import { transformAPIString } from '$docs/utils';
	import { DataAttrTable, PropsTable, ReturnedPropsTable, APITableHeading } from '.';

	export let data: APISchema;
</script>

<div class="relative -mx-2 rounded-md border border-neutral-600/80 px-3 pt-8">
	<APITableHeading description={transformAPIString(data.description, true)} title={data.title} />
	<!-- 
	<H3 class="mt-4 text-magnum-400">{data.title}</H3>
	<P>{@html transformAPIString(data.description, true)}</P> -->

	{#if data.props}
		<PropsTable data={data.props} />
	{/if}

	{#if data.returnedProps}
		<ReturnedPropsTable data={data.returnedProps} />
	{/if}

	{#if data.dataAttributes}
		<DataAttrTable data={data.dataAttributes} />
	{/if}
</div>
