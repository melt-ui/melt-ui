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
	};
</script>

<script lang="ts">
	import TableWrapper from './table-wrapper.svelte';
	import Table from './table.svelte';

	export let schema: APISchema;

	$: empty = !schema.args && !schema.props && !schema.events && !schema.dataAttributes;

	$: htmlDescription = (function parseDescription(description: string) {
		// replace `$1` with <code>$1</code>
		return description.replace(/`([^`]+)`/g, '<code>$1</code>');
	})(schema.description);
</script>

<div class="mb-12">
	<h3 class="text-xl font-bold">{schema.title}</h3>

	<p class="mt-1 opacity-75">
		{@html htmlDescription}
	</p>

	{#if empty}
		<p class="mt-4 text-lg text-zinc-400">
			No props, events or data attributes are explicitly required.
		</p>
	{:else}
		<TableWrapper>
			{#if schema.args}
				<Table head={['Arg', 'Type', 'Default']} headMobile="Args" data={schema.args}>
					<svelte:fragment slot="row" let:datum={d}>
						<div>
							<code class="colored">{d.label}{d.required ? '*' : ''}</code>
						</div>
						<div>
							<code>{d.type}</code>
						</div>
						<div>
							{#if d.default}
								<code>{d.default}</code>
							{:else}
								<span>-</span>
							{/if}
						</div>
					</svelte:fragment>
				</Table>
			{/if}

			{#if schema.props}
				<Table head={['Prop', 'Type', 'Default']} headMobile="Props" data={schema.props}>
					<svelte:fragment slot="row" let:datum={d}>
						<div>
							<code class="colored">{d.label}{d.required ? '*' : ''}</code>
						</div>
						<div>
							<code>{d.type}</code>
						</div>
						<div>
							{#if d.default}
								<code>{d.default}</code>
							{:else}
								<span>-</span>
							{/if}
						</div>
					</svelte:fragment>
				</Table>
			{/if}

			<!-- Events -->
			{#if schema.events}
				{#if schema.props}
					<hr class="col-span-3 h-4 opacity-0" />
				{/if}

				<Table head={['Event', 'Payload']} headMobile="Events" data={schema.events}>
					<div class="contents" slot="row" let:datum={d}>
						<div>
							<code class="colored">{d.label}</code>
						</div>
						<div>
							{#if Array.isArray(d.payload)}
								<code>{d.payload.join(' | ')}</code>
							{:else}
								<span>
									{d.payload}
								</span>
							{/if}
						</div>
						<div class="" />
					</div>
				</Table>
			{/if}

			<!-- Data Attributes -->
			{#if schema.dataAttributes}
				{#if schema.props || schema.events}
					<hr class="col-span-3 h-4 opacity-0" />
				{/if}

				<Table
					head={['Data Attribute', 'Values']}
					headMobile="Data Attributes"
					data={schema.dataAttributes}
				>
					<div class="contents" slot="row" let:datum={d}>
						<div>
							<code class="colored">{d.label}</code>
						</div>
						<div>
							{#if Array.isArray(d.value)}
								<code>{d.value.join(' | ')}</code>
							{:else}
								<span>
									{d.value}
								</span>
							{/if}
						</div>
						<div class="" />
					</div>
				</Table>
			{/if}
		</TableWrapper>
	{/if}
</div>

<style lang="postcss">
	code {
		background-color: theme('colors.zinc.800');
		color: theme('colors.zinc.300');
		padding-inline: theme('spacing.1');
		padding-block: theme('spacing[0.5]');
		border-radius: theme('borderRadius.sm');
		font-family: theme('fontFamily.mono');

		&.colored {
			background-color: theme('colors.magnum.900/0.5');
			color: theme('colors.magnum.300');
		}
	}
</style>
