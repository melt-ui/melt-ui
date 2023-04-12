<script lang="ts">
	import { Popper } from '..';

	let open = false;
</script>

<div>
	<Popper.Root>
		<Popper.Anchor data-testid="anchor" on:click={() => (open = true)}>open</Popper.Anchor>
		{#if open}
			<Popper.Content sideOffset={10} data-testid="content">
				<button on:click={() => (open = false)}>close</button>
				<Popper.Arrow width={20} height={10} />
			</Popper.Content>
		{/if}
	</Popper.Root>
</div>
