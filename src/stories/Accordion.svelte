<script lang="ts">
	import { Accordion } from '$lib';

	let value = 'item-2';
</script>

<div class="grid place-items-center max-w-xl p-4 mx-auto">
	<div class="comp-preview w-full">
		<div class="content h-96">
			<Accordion.Root
				class=" rounded-md bg-[--line-color] shadow-[0_2px_10px] shadow-black/5"
				type="single"
				bind:value
				defaultValue="item-1"
				collapsible
			>
				<Accordion.Item class="accordion-item" value="item-1">
					<Accordion.Header class="flex">
						<Accordion.Trigger class="accordion-trigger">Is it accessible?</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content class="accordion-content" transition>
						<div class="px-5 py-4">Yes. It adheres to the WAI-ARIA design pattern.</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item class="accordion-item" value="item-2">
					<Accordion.Header class="flex">
						<Accordion.Trigger class="accordion-trigger">Is it unstyled?</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content class="accordion-content" transition>
						<div class="px-5 py-4">
							Yes. It's unstyled by default, giving you freedom over the look and feel.
						</div>
					</Accordion.Content>
				</Accordion.Item>

				<Accordion.Item class="accordion-item" value="item-3">
					<Accordion.Header class="flex">
						<Accordion.Trigger class="accordion-trigger">Can it be animated?</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content class="accordion-content" transition>
						<div class="px-5 py-4">
							Yes! You can use the transition prop to configure the animation.
						</div>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	</div>
</div>

<style lang="postcss">
	.content {
		--line-color: theme('colors.gray.300');

		:global(.accordion-item) {
			@apply mt-px overflow-hidden  first:mt-0 first:rounded-t last:rounded-b 
			focus-within:relative focus-within:z-10 focus-within:ring focus-within:ring-black;
		}

		:global(.accordion-trigger) {
			@apply flex h-12 flex-1  cursor-pointer items-center
			justify-between bg-white px-5 text-base leading-none text-violet-800 shadow-[0_1px_0] 
			shadow-[--line-color] outline-none hover:bg-gray-200;
		}

		:global(.accordion-content) {
			@apply overflow-hidden bg-gray-100 text-sm text-gray-900;
		}
	}
</style>
