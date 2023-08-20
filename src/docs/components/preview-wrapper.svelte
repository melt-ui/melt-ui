<script lang="ts">
	import { cn } from '$docs/utils/index.js';
</script>

<div class="comp-preview h-[20rem] overflow-x-auto lg:h-[28rem] lg:overflow-x-hidden">
	<div class={cn('relative z-10 mx-auto inline-block px-4')}>
		<slot />
	</div>
</div>

<style lang="postcss">
	.comp-preview {
		display: flex;
		align-items: center;

		background-color: theme('colors.magnum.400');
		border-radius: theme('borderRadius.xl');
		position: relative;

		@media screen('md') {
			padding: theme('spacing.12');
		}

		&::before {
			position: absolute;
			content: '';
			inset: 0;
			background-image: radial-gradient(
				circle at 1px 1px,
				theme('colors.magnum.900/0.25') 1px,
				transparent 0
			);
			background-size: 1rem 1rem;
			background-repeat: repeat;
			background-position: 0.5rem center;
		}
	}
</style>
