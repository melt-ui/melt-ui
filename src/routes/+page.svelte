<script lang="ts">
	import { Collapsible } from '$lib';
	import { Cross2Icon, RowSpacingIcon } from '$lib/components/Icon';

	export let open = false;
	export let disabled = false;
</script>

<div class="wrapper">
	<div class="comp-preview">
		<h2 class="title">Collapsible</h2>
		<div class="content">
			<Collapsible.Root bind:open {disabled}>
				<div class="flex items-center justify-between">
					<span class="text-violet11 text-[15px] leading-[25px] text-white">
						@peduarte starred 3 repositories
					</span>
					<Collapsible.Trigger
						class="rounded-full data-[disabled]:opacity-75 data-[disabled]:cursor-not-allowed h-[25px] w-[25px] inline-grid place-items-center text-violet-500 shadow-[0_2px_10px] shadow-gray-600 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet-100 hover:bg-violet-300 focus:ring focus:ring-gray-800"
					>
						{#if open}
							<Cross2Icon />
						{:else}
							<RowSpacingIcon />
						{/if}
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
</div>

<style lang="postcss">
	.wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		padding: theme('spacing.4');
	}

	.comp-preview {
		display: flex;
		flex-direction: column;
		gap: theme('spacing.2');

		.content {
			background-image: linear-gradient(
				330deg,
				theme('colors.purple.500') 0%,
				theme('colors.indigo.800') 100%
			);

			padding: theme('spacing.16');
			border-radius: theme('borderRadius.lg');
		}

		.title {
			color: theme('colors.white');
			font-size: theme('fontSize.2xl');
			font-weight: theme('fontWeight.bold');
		}
	}
</style>
