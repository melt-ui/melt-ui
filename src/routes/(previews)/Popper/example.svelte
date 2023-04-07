<script lang="ts">
	import { Popper } from '$lib/components/Popper';

	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof Popper>;

	let open = false;
</script>

<div class="flex h-96 items-center justify-center">
	<Popper.Root {...propsObj.Root}>
		<Popper.Anchor
			class="rounded-lg bg-purple-300 p-4"
			on:click={() => (open = true)}
			{...propsObj.Anchor}>open</Popper.Anchor
		>
		{#if open}
			<Popper.Content sideOffset={10} class="rounded-lg bg-black/20 p-4" {...propsObj.Content}>
				<button on:click={() => (open = false)}>close</button>
				<Popper.Arrow width={20} height={10} class="fill-black/20" {...propsObj.Arrow} />
			</Popper.Content>
		{/if}
	</Popper.Root>
</div>
