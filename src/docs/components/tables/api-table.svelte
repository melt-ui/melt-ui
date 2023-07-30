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
	{#if data.elements && data.elements.length}
		<ReturnedPropsTable data={data.elements} title="Elements" tableHeading="Element">
			<svelte:fragment slot="info">
				Element stores are designed to be applied to whatever elements you'd like to use in your
				component to provide it with event listeners, attributes, and overall functionality.
			</svelte:fragment>
		</ReturnedPropsTable>
	{/if}
	{#if data.states && data.states.length}
		<ReturnedPropsTable data={data.states} title="States" tableHeading="State">
			<svelte:fragment slot="info">
				States are simply readable Svelte stores that contain the state of a component. You can use
				them to conditionally render elements, apply classes, or even manage the state of other
				components.
			</svelte:fragment>
		</ReturnedPropsTable>
	{/if}
	{#if data.helpers && data.helpers.length}
		<ReturnedPropsTable data={data.helpers} title="Helpers" tableHeading="Helper">
			<svelte:fragment slot="info">
				Helpers are typically derived stores which are used to simplify the interaction with a
				component. They may take an argument and return a value which you can use to manage the
				state of a particular element or item.
			</svelte:fragment>
		</ReturnedPropsTable>
	{/if}
	{#if data.actions && data.actions.length}
		<ReturnedPropsTable data={data.actions} title="Actions" tableHeading="Action">
			<svelte:fragment slot="info">
				Actions are your standard Svelte actions which are used to interact with the DOM. They are
				used the same way as you would use any other Svelte action, by prefixing it with the <code>
					use:
				</code>
				directive.
			</svelte:fragment>
		</ReturnedPropsTable>
	{/if}
	{#if data.options && data.options.length}
		<ReturnedPropsTable data={data.options} title="Options" tableHeading="Option">
			<svelte:fragment slot="info">
				Options are stores that are used to configure the behavior of the component. They are used
				after the component is initialized to reactively update the component's behavior at any
				time.
			</svelte:fragment>
		</ReturnedPropsTable>
	{/if}
	{#if data.dataAttributes}
		<DataAttrTable data={data.dataAttributes} />
	{/if}
</div>
