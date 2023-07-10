<script lang="ts">
	import type { APISchema } from '$docs/types';
	import { APITable, APIWrapper } from '$docs/components';

	export let schemas: APISchema[];
</script>

<APIWrapper>
	{#each schemas as schema}
		<APITable data={schema} />
	{/each}
</APIWrapper>
