<script lang="ts">
	import { cn } from '$routes/helpers';
	import Balancer from 'svelte-wrap-balancer';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-4 mt-2 text-xl text-neutral-400', className)}>
	<Balancer>
		<slot />
	</Balancer>
</p>
