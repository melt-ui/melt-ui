<script lang="ts">
	import { cn } from '$routes/helpers';
	import { Table } from './table';

	type Datum = $$Generic;

	export let head: string[];
	export let data: Datum[];
</script>

<Table.Wrapper>
	<Table.Header class="table-header-group">
		<Table.Row>
			{#each head as h, i}
				<Table.Head
					class={cn(i === 0 && 'w-[35%] pl-0', i === 1 && 'w-[45%]', i === 2 && 'w-[20%]')}
				>
					{h}
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as datum}
			<Table.Row>
				<slot name="row" {datum} />
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Wrapper>
