<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<td class={cn('py-4 pr-4', className)} {...$$restProps}>
	<slot />
</td>
