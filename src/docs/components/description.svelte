<script lang="ts">
	import { cn } from '$docs/utils/index.js';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mb-4 mt-2 text-balance text-xl text-neutral-400', className)}>
	<slot />
</p>
