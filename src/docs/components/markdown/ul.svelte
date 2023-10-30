<script lang="ts">
	import { cn } from '$docs/utils/index.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<ul class={cn(className)} {...$$restProps}>
	<slot />
</ul>

<style lang="postcss">
	ul {
		list-style-type: disc;
		/*		margin-block: _Theme('spacing.6');*/
		/*		margin-left: _Theme('spacing.6');*/

		:global(ul) {
			list-style-type: circle;

			/*			margin-block: _Theme('spacing.2');*/
			/*			margin-left: _Theme('spacing.6');*/
		}
	}
</style>
