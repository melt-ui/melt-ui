<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<th class={cn('h-12 pr-4 pl-4 text-left font-medium text-neutral-400', className)} {...$$restProps}>
	<slot />
</th>
