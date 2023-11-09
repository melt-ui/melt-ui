<script context="module" lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';

	export type PreviewVariants = VariantProps<typeof previewVariants>;

	export const previewVariants = tv({
		base: 'flex items-center rounded-xl relative md:px-12 overflow-x-auto lg:overflow-x-hidden',
		variants: {
			variant: {
				default: 'bg-magnum-400',
				dark: 'bg-neutral-950/25',
			},
			size: {
				default: 'h-[20rem] lg:h-[28rem]',
				sm: 'h-[12rem] sm:h-[20rem]',
				md: 'h-[16rem] sm:h-[24rem]',
				lg: 'h-[24rem] sm:h-[32rem]',
				auto: 'h-auto py-6 lg:py-12',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	});
</script>

<script lang="ts">
	import { cn } from '$docs/utils/index.js';

	export let variant: PreviewVariants['variant'] = 'default';
	export let size: PreviewVariants['size'] = 'default';
</script>

<div class={cn(previewVariants({ variant, size }))} data-variant={variant}>
	<div class={cn('z-10 mx-auto inline-block px-4')}>
		<slot />
	</div>
</div>

<style lang="postcss">
	[data-variant='default'] {
		&::before {
			position: absolute;
			content: '';
			inset: 0;
			background-image: radial-gradient(
				circle at 1px 1px,
				theme('colors.magnum.700/0.25') 1px,
				transparent 0
			);
			background-size: 1rem 1rem;
			background-repeat: repeat;
			background-position: 0.5rem center;
		}
	}

	[data-variant='dark'] {
		&::before {
			position: absolute;
			content: '';
			inset: 0;
			background-image: radial-gradient(
				circle at 1px 1px,
				theme('colors.neutral.800/0.5') 1px,
				transparent 0
			);
			background-size: 1rem 1rem;
			background-repeat: repeat;
			background-position: 0.5rem center;
		}
	}
</style>
