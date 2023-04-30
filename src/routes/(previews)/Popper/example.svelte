<script lang="ts">
	import { Popper } from '$lib/internal/components';
	import type { ResolvedProps } from '$lib/internal/helpers';

	export let propsObj: ResolvedProps<typeof Popper>;

	let open = false;
</script>

<div class="grid place-items-center">
	<Popper.Root {...propsObj.Root}>
		<Popper.Anchor
			class="rounded-md bg-white px-4
			py-2 font-medium leading-none text-vermilion-800 shadow-lg hover:bg-vermilion-100"
			on:click={() => (open = true)}
			{...propsObj.Anchor}>Open</Popper.Anchor
		>
		{#if open}
			<Popper.Content sideOffset={10} class="rounded-lg bg-black/20 p-4" {...propsObj.Content}>
				<button on:click={() => (open = false)}>close</button>
				<Popper.Arrow width={20} height={10} class="fill-black/20" {...propsObj.Arrow} />
			</Popper.Content>
		{/if}
	</Popper.Root>
</div>
