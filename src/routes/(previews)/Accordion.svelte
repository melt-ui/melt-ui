<script lang="ts">
	import { Accordion } from '$lib';

	export let open = false;
	export let disabled = false;
</script>

<div class="comp-preview">
	<h2 class="title">Accordion</h2>
	<div class="content">
		<Accordion.Root
			class="bg-gray-500 w-[300px] rounded-md shadow-[0_2px_10px] shadow-black/5"
			type="single"
			defaultValue="item-1"
			collapsible
		>
			<Accordion.Item
				class="focus-within:shadow-grey-800 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
				value="item-1"
			>
				<Accordion.Header class="flex">
					<Accordion.Trigger
						class="text-violet-800 shadow-gray-500 hover:bg-gray-200 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'"
						>Is it accessible?</Accordion.Trigger
					>
				</Accordion.Header>
				<Accordion.Content
					class="text-gray-900 bg-gray-100 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]"
				>
					<div class="py-[15px] px-5">Yes. It adheres to the WAI-ARIA design pattern.</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item
				class="focus-within:shadow-grey-800 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
				value="item-2"
			>
				<Accordion.Header class="flex">
					<Accordion.Trigger
						class="text-violet-800 shadow-gray-500 hover:bg-gray-200 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'"
						>Is it accessible?</Accordion.Trigger
					>
				</Accordion.Header>
				<Accordion.Content
					class="text-gray-900 bg-gray-100 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]"
				>
					<div class="py-[15px] px-5">Yes. It adheres to the WAI-ARIA design pattern.</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item
				class="focus-within:shadow-grey-800 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]"
				value="item-3"
			>
				<Accordion.Header class="flex">
					<Accordion.Trigger
						class="text-violet-800 shadow-gray-500 hover:bg-gray-200 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none'"
						>Is it accessible?</Accordion.Trigger
					>
				</Accordion.Header>
				<Accordion.Content
					class="text-gray-900 bg-gray-100 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]"
				>
					<div class="py-[15px] px-5">Yes. It adheres to the WAI-ARIA design pattern.</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</div>
