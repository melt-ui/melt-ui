<script lang="ts">
	import { cn } from '$routes/helpers';
	import Balancer from 'svelte-wrap-balancer';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<Balancer>
	<p class={cn('mt-2 text-xl text-neutral-400', className)}><slot /></p>
</Balancer>
