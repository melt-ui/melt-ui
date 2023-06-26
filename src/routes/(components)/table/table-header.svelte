<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<thead class={cn('w-full border-b-neutral-600 [&_tr]:border-b', className)} {...$$restProps}>
	<slot />
</thead>
