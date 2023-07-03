<script context="module">
	import { tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center rounded font-semibold transition disabled:opacity-50 disabled:pointer-events-none active:translate-y-0.5',
		variants: {
			variant: {
				default: 'bg-magnum-600 text-white hover:bg-magnum-700/90 ',
				ghost: 'hover:bg-magnum-600/20 hover:text-white ',
				link: 'underline-offset-4 hover:underline text-primary',
				outline: 'border border-magnum-600/60 hover:bg-magnum-600/20 hover:text-white',
			},
			size: {
				default: 'px-5 h-11 py-3',
				sm: 'h-9 px-3 rounded',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	});
</script>

<script lang="ts">
	import type { VariantProps } from 'tailwind-variants';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let href: HTMLAnchorAttributes['href'] = undefined;
	export let type: HTMLButtonAttributes['type'] = undefined;
	export let variant: VariantProps<typeof buttonVariants>['variant'] = 'default';
	export let size: VariantProps<typeof buttonVariants>['size'] = 'default';

	type Props = {
		class?: string | null;
		variant?: VariantProps<typeof buttonVariants>['variant'];
		size?: VariantProps<typeof buttonVariants>['size'];
	};

	interface AnchorElement extends Props, HTMLAnchorAttributes {
		href?: HTMLAnchorAttributes['href'];
		type?: never;
	}

	interface ButtonElement extends Props, HTMLButtonAttributes {
		type?: HTMLButtonAttributes['type'];
		href?: never;
	}

	type $$Props = AnchorElement | ButtonElement;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	type={href ? undefined : type}
	{href}
	class={cn(buttonVariants({ variant, size, className }))}
	{...$$restProps}
	role="button"
	tabindex="0"
	on:click
	on:change
	on:keydown
	on:keyup
	on:mouseenter
	on:mouseleave
>
	<slot />
</svelte:element>
