<script lang="ts">
	import Preview from './preview.svelte';
	import code from './code.svelte?raw';
	import { Docs, type APISchema } from '../(components)';

	const schemas: APISchema[] = [
		{
			title: 'Root',
			description: 'Contains all the parts of an accordion.',
			props: [
				{
					label: 'value',
					type: 'string | string[]',
				},
				{
					label: 'type',
					type: 'single | multiple',
					default: 'single',
				},
				{
					label: 'disabled',
					type: 'boolean',
					default: false,
				},
			],
		},

		{
			title: 'Item',
			description: 'Contains all the parts of a collapsible section.',
			props: [
				{
					label: 'value',
					type: 'string',
				},
			],
			dataAttributes: [
				{
					label: 'data-disabled',
					value: 'Present when disabled',
				},
				{
					label: 'data-state',
					value: ['open', 'closed'],
				},
			],
		},
		{
			title: 'Header',
			description: 'Wraps an `Accordion.Trigger`.',
			dataAttributes: [
				{
					label: 'data-disabled',
					value: 'Present when disabled',
				},
				{
					label: 'data-state',
					value: ['open', 'closed'],
				},
			],
		},
		{
			title: 'Trigger',
			description: `Toggles the collapsed state of its associated item. It should be nested inside of an \`Accordion.Header\`.`,
			dataAttributes: [
				{
					label: 'data-disabled',
					value: 'Present when disabled',
				},
				{
					label: 'data-state',
					value: ['open', 'closed'],
				},
			],
		},
		{
			title: 'Content',
			description: 'Contains the collapsible content for an item.',
			props: [
				{
					label: 'transition',
					type: 'boolean',
					default: false,
				},
			],
			dataAttributes: [
				{
					label: 'data-disabled',
					value: 'Present when disabled',
				},
				{
					label: 'data-state',
					value: ['open', 'closed'],
				},
			],
		},
	];
</script>

<Docs.H1>Accordion</Docs.H1>

<Docs.Description>
	A vertically stacked set of interactive headings that each reveal an associated section of
	content.
</Docs.Description>

<Preview />

<Docs.CodeBlock {code} />

<Docs.H2>API Reference</Docs.H2>

{#each schemas as schema}
	<Docs.API {schema} />
{/each}
