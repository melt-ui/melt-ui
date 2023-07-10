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

<div class="relative overflow-x-visible rounded-md border border-neutral-600/80 px-3 pt-16">
	<APISectionHeading description={transformAPIString(data.description, true)} title={data.title} />
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
