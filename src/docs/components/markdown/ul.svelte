<script lang="ts">
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<ul class={cn(className)} {...$$restProps}>
	<slot />
</ul>

<style lang="postcss">
	ul {
		list-style-type: disc;
		margin-block: theme('spacing.6');
		margin-left: theme('spacing.6');

		:global(ul) {
			list-style-type: circle;

			margin-block: theme('spacing.2');
			margin-left: theme('spacing.6');
		}
	}
</style>
