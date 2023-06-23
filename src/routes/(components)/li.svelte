<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<li class={cn('mt-2', className)} {...$$restProps}>
	<slot />
</li>
