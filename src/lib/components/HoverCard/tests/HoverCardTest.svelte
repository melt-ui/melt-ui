<script lang="ts">
	import { HoverCard, type HoverCardRootProps } from '$lib';

	export let open: HoverCardRootProps['open'] = false;
</script>

<HoverCard.Root data-testid="hovercard-root" {open}>
	<HoverCard.Trigger>
		<a data-testid="hovercard-trigger" href="https://github.com/TGlide/radix-svelte">
			<img class="h-8 w-8" src="/radix-svelte.svg" alt="Radix and Svelte logos" />
		</a>
	</HoverCard.Trigger>
	<HoverCard.Portal>
		<HoverCard.Content
			data-testid="hovercard-content"
			class="w-80 rounded-sm bg-white p-5 shadow-sm"
		>
			<HoverCard.Arrow width={20} height={10} class="fill-white" />
			<div class="flex flex-col gap-2">
				<img
					src="/radix-svelte.svg"
					class="block h-10 w-10 rounded-[100%] bg-black"
					alt="Radix and Svelte logos"
				/>
				<div class="flex flex-col gap-4">
					<div>
						<div class="font-bold text-black">Radix Svelte</div>
						<div class="text-slate-400">TGlide/radix-svelte</div>
					</div>
				</div>
				<div class="m-0 text-vermilion-500">
					A set of unstyled, accessible components for building high-quality design systems and web
					apps
				</div>
				<div class="flex gap-4">
					<div class="flex gap-1">
						<div class="font-bold text-black">229</div>
						<div class="text-slate-400">Stars</div>
					</div>
					<div class="flex gap-1">
						<div class="font-bold text-black">23</div>
						<div class="text-slate-400">Forks</div>
					</div>
				</div>
			</div>
		</HoverCard.Content>
	</HoverCard.Portal>
</HoverCard.Root>
