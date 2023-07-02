<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h3 class={cn('mt-9 scroll-m-20 text-xl font-semibold', className)} data-toc {...$$restProps}>
	<slot />
</h3>
