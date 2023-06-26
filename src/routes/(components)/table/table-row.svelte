<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<tr class={cn('w-full border-b border-b-neutral-600', className)} {...$$restProps}>
	<slot />
</tr>
