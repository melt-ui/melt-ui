<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { transformAPIString } from '$docs/utils';
	import {
		APISectionHeading,
		DataAttrTable,
		PropsTable,
		ReturnedPropsTable,
	} from '$docs/components';

	export let data: APISchema;
</script>

<div class="relative rounded-md border border-neutral-600/80 px-3 pt-8">
	<APISectionHeading description={transformAPIString(data.description, true)} title={data.title} />
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
