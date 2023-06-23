<script lang="ts">
	import { cn } from '$routes/helpers';
    import { tv, type VariantProps } from 'tailwind-variants';
    
    const ulVariants = tv({
        base: '',
        variants: {
            type: {
                icon: 'my-6 list-none',
                default: 'my-6 ml-6 list-disc'
            }
        },
        defaultVariants: {
            type: 'default'
        }
    })
    
    let className: string | undefined | null = undefined;
    export { className as class };
    export let type: VariantProps<typeof ulVariants>['type'] = "default"

</script>

<ul class={cn(ulVariants({ type, className}))} {...$$restProps}>
	<slot />
</ul>
