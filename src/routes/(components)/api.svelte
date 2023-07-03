<script lang="ts" context="module">
	export type Props = Array<{
		label: string;
		type: string | string[];
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
	import APITable from './api-table.svelte';
	import KBDTable from './kbd-table.svelte';
	import { Table } from './table';
	import P from './p.svelte';
	import H3 from './h3.svelte';

	export let schema: APISchema;

	function parseContent(content: string, codeClass = '') {
		// replace `$1` with <code>$1</code>
		return content.replace(/`([^`]+)`/g, `<code class="${codeClass}">$1</code>`);
	}

	$: empty =
		!schema.args &&
		!schema.props &&
		!schema.events &&
		!schema.dataAttributes &&
		!schema.keyboardInteractions;

	$: htmlDescription = parseContent(schema.description);
</script>

<div class="mb-12">
	<H3 class="text-xl font-bold">{schema.title}</H3>

	<P class="mt-1.5 text-neutral-300/95">
		{@html htmlDescription}
	</P>

	{#if empty}
		<p class="mt-4 text-lg text-zinc-400">
			No props, events or data attributes are explicitly required.
		</p>
	{:else}
		{#if schema.args}
			<APITable head={['Arg', 'Type', 'Default']} data={schema.args}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0">
						<code class="colored">{d.label}{d.required ? '*' : ''}</code>
					</Table.Cell>
					<Table.Cell class="">
						{#if Array.isArray(d.type)}
							<code>{d.type.join(' | ').replaceAll('"', "'")}</code>
						{:else}
							<code>
								{d.type.replaceAll('"', "'")}
							</code>
						{/if}
					</Table.Cell>
					<Table.Cell class="">
						{#if d.default !== undefined}
							<code>{d.default}</code>
						{:else}
							<span>-</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</APITable>
		{/if}

		{#if schema.props}
			<APITable head={['Prop', 'Type', 'Default']} data={schema.props}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0">
						<code class="colored">{d.label}{d.required ? '*' : ''}</code>
					</Table.Cell>
					<Table.Cell>
						{#if Array.isArray(d.type)}
							<code>{d.type.join(' | ').replaceAll('"', "'")}</code>
						{:else}
							<code>
								{d.type.replaceAll('"', "'")}
							</code>
						{/if}
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
			</APITable>
		{/if}

		<!-- Events -->
		{#if schema.events}
			{#if schema.props}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<APITable head={['Event', 'Payload']} data={schema.events}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0">
						<code class="colored">{d.label}</code>
					</Table.Cell>
					<Table.Cell>
						{#if Array.isArray(d.payload)}
							<code>{d.payload.join(' | ').replaceAll('"', "'")}</code>
						{:else}
							<span>
								{d.payload}
							</span>
						{/if}
					</Table.Cell>
				</svelte:fragment>
			</APITable>
		{/if}

		<!-- Data Attributes -->
		{#if schema.dataAttributes}
			{#if schema.props || schema.events}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<APITable head={['Data Attribute', 'Values']} data={schema.dataAttributes}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0">
						<code class="colored">{d.label}</code>
					</Table.Cell>
					<Table.Cell>
						{#if Array.isArray(d.value)}
							<code>{d.value.join(' | ').replaceAll('"', "'")}</code>
						{:else}
							<P class="mb-0">
								{@html parseContent(d.value, 'neutral')}
							</P>
						{/if}
					</Table.Cell>
					<Table.Cell />
				</svelte:fragment>
			</APITable>
		{/if}

		{#if schema.keyboardInteractions}
			{#if schema.props || schema.events}
				<hr class="col-span-3 h-4 opacity-0" />
			{/if}

			<KBDTable head={['Key', 'Description']} data={schema.keyboardInteractions}>
				<svelte:fragment slot="row" let:datum={d}>
					<Table.Cell class="pl-0">
						<Kbd>{d.key}</Kbd>
					</Table.Cell>
					<Table.Cell>
						<P class="mb-0">
							{@html parseContent(d.description)}
						</P>
					</Table.Cell>
				</svelte:fragment>
			</KBDTable>
		{/if}
	{/if}
</div>

<style lang="postcss">
	code {
		background-color: theme('colors.zinc.800');
		color: theme('colors.zinc.300');
		&.colored {
			background-color: theme('colors.magnum.900/0.5');
			color: theme('colors.magnum.300');
		}
	}
</style>
