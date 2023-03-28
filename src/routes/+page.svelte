<script lang="ts">
	import { Collapsible } from '$lib';

	export let open = false;
</script>

<div class="wrapper">
	<div class="w-[300px]">
		<p>
			Outer open: {open}
		</p>
		<button class="" on:click={() => (open = !open)}>Outer toggle</button>

		<Collapsible.Root bind:open>
			<div class="flex items-center justify-between">
				<span class="text-violet11 text-[15px] leading-[25px] text-white">
					@peduarte starred 3 repositories
				</span>
				<Collapsible.Trigger
					class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet-500 shadow-[0_2px_10px] shadow-gray-600 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet-300 hover:bg-violet-300 focus:shadow-[0_0_0_2px] focus:shadow-gray-600"
				>
					{open ? 'open' : 'closed'}
				</Collapsible.Trigger>
			</div>

			<div class="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-gray-600">
				<span class="text-violet-800 text-[15px] leading-[25px]">@radix-ui/primitives</span>
			</div>

			<Collapsible.Content>
				<div class="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-gray-600">
					<span class="text-violet-800 text-[15px] leading-[25px]">@radix-ui/colors</span>
				</div>
				<div class="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-gray-600">
					<span class="text-violet-800 text-[15px] leading-[25px]">@stitches/react</span>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		background-image: linear-gradient(
			330deg,
			theme('colors.purple.500') 0%,
			theme('colors.indigo.800') 100%
		);

		display: grid;
		place-items: center;
		padding: theme('spacing.16');
	}
</style>
