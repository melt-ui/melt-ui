<script lang="ts">
	import { cn } from '$docs/utils';
	import { balancer } from 'svelte-action-balancer';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-4 mt-2 text-xl text-neutral-400', className)} use:balancer>
	<slot />
</p>
