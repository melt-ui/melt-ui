<script lang="ts" context="module">
	export type Props = Array<{
		label: string;
		type: string;
		default?: unknown;
		required?: boolean;
	}>;

	export type Events = Array<{
		label: string;
		payload?: unknown;
	}>;

	export type KeyboardInteractions = Array<{
		key: string;
		description: string;
	}>;

	export type DataAttributes = Array<{
		label: string;
		value: string | string[];
	}>;

	type BaseAPISchema = {
		title: string;
		description: string;
	};

	export type APISchema = BaseAPISchema & {
		args?: Props;
		props?: Props;
		events?: Events;
		dataAttributes?: DataAttributes;
		keyboardInteractions?: KeyboardInteractions;
	};
</script>

<script lang="ts">
	import Kbd from './kbd.svelte';
	import TableWrapper from './table.svelte';
	import { Table } from './table';
	import P from './p.svelte';
	import H3 from './h3.svelte';
	import Balancer from 'svelte-wrap-balancer';

	export let schema: APISchema;

    function parseContent(content: string) {
        // replace `$1` with <code>$1</code>
		return content.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

	$: empty =
		!schema.args &&
		!schema.props &&
		!schema.events &&
		!schema.dataAttributes &&
		!schema.keyboardInteractions;

	$: htmlDescription = parseContent(schema.description)
</script>

<div class="mb-12">
	<H3 class="mt-8 text-xl font-bold">{schema.title}</H3>

	<P>
		{@html htmlDescription}
	</P>

	{#if empty}
		<p class="mt-4 text-lg text-zinc-400">
			No props, events or data attributes are explicitly required.
		</p>
	{:else}
		{#if schema.args}
			<TableWrapper head={['Arg', 'Type', 'Default']} data={schema.args}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0 pr-4">
						<code class="colored">{d.label}{d.required ? '*' : ''}</code>
					</Table.Cell>
					<Table.Cell>
						<code>{d.type}</code>
					</Table.Cell>
					<Table.Cell>
						{#if d.default !== undefined}
							<code>{d.default}</code>
						{:else}
							<span>-</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</TableWrapper>
		{/if}

		{#if schema.props}
			<TableWrapper head={['Prop', 'Type', 'Default']} data={schema.props}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0 pr-4">
						<code class="colored">{d.label}{d.required ? '*' : ''}</code>
					</Table.Cell>
					<Table.Cell>
						<code>{d.type}</code>
					</Table.Cell>
					<Table.Cell>
						{#if d.default !== undefined}
							<code>{d.default}</code>
						{:else}
							<span>-</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</TableWrapper>
		{/if}

		<!-- Events -->
		{#if schema.events}
			{#if schema.props}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<TableWrapper head={['Event', 'Payload']} data={schema.events}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0 pr-4">
						<code class="colored">{d.label}</code>
					</Table.Cell>
					<Table.Cell>
						{#if Array.isArray(d.payload)}
							<code>{d.payload.join(' | ')}</code>
						{:else}
							<span>
								{d.payload}
							</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</TableWrapper>
		{/if}

		<!-- Data Attributes -->
		{#if schema.dataAttributes}
			{#if schema.props || schema.events}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<TableWrapper head={['Data Attribute', 'Values']} data={schema.dataAttributes}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0 pr-4">
						<code class="colored">{d.label}</code>
					</Table.Cell>
					<Table.Cell>
						{#if Array.isArray(d.value)}
							<code>{d.value.join(' | ')}</code>
						{:else}
							<span>
								{d.value}
							</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</TableWrapper>
		{/if}

		{#if schema.keyboardInteractions}
			{#if schema.props || schema.events}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<TableWrapper head={['Key', 'Description']} data={schema.keyboardInteractions}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0 pr-4">
						<Kbd>{d.key}</Kbd>
					</Table.Cell>
					<Table.Cell>
						<Balancer>
							<P>
								{@html parseContent(d.description)}
							</P>
						</Balancer>
					</Table.Cell>
				</svelte:fragment>
			</TableWrapper>
		{/if}
	{/if}
</div>

<style lang="postcss">
	code {
		background-color: theme('colors.zinc.800');
		color: theme('colors.zinc.300');
		padding-inline: 3.2px 4.8px;
		padding-block: theme('spacing[0.5]');
		border-radius: theme('borderRadius.sm');
		font-family: theme('fontFamily.mono');

		&.colored {
			background-color: theme('colors.magnum.900/0.5');
			color: theme('colors.magnum.300');
		}
	}
</style>
