<script lang="ts">
	import { cn } from '$docs/utils';
	import { isSafari } from '$lib/internal/helpers';
	import Balancer from 'svelte-wrap-balancer';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-4 mt-2 text-xl text-neutral-400', className)}>
	<!-- Safari throws crypto.randomUUID is not a function error -->
	{#if isSafari()}
		<slot />
	{:else}
		<Balancer>
			<slot />
		</Balancer>
	{/if}
</p>
