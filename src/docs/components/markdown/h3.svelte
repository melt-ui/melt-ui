<script lang="ts">
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h3
	class={cn('mb-2 mt-11 scroll-m-20 text-xl font-semibold tracking-tight', className)}
	data-toc
	{...$$restProps}
>
	<slot />
</h3>
