<script lang='ts' context='module'>
    type PortalProps = ComponentProps<InstanceType<typeof Portal>>;
    export type HoverCardPortalProps = Omit<PortalProps, 'target'> & {
        container?: PortalProps['target'];
    };
</script>

<script lang='ts'>
    import {Portal} from '$lib/internal/components';
    import {getRootContext} from './root.svelte';

    import type {ComponentProps} from 'svelte';

    type $$Props = HoverCardPortalProps;

    export let container: $$Props['container'] = 'body';

    const ctx = getRootContext();
</script>

{#if $ctx.open}
<Portal target={container} {...$$restProps}>
<slot></slot>
</Portal>
{/if}