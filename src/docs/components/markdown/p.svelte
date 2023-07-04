<script lang="ts">
	import { cn } from '$docs/utils';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-4 leading-7', className)} {...$$restProps}>
	<slot />
</p>
