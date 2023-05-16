<script lang='ts' context='module'>
    export type HoverCardContentProps = Exclude<ComponentProps<InstanceType<typeof Popper.Content>>, Required<PopperContentEventProps>>;
</script>

<script lang='ts'>
    import {Popper} from '$lib/internal/components';
	import type { PopperContentEventProps } from '$lib/internal/components/Popper/content.svelte';
    import {getRootContext} from './root.svelte';

    import type {ComponentProps} from 'svelte';

    type $$Props = HoverCardContentProps;

    const ctx = getRootContext();

    export let side: NonNullable<$$Props['side']> = 'bottom';
	export let sideOffset: NonNullable<$$Props['sideOffset']> = 0;
	export let align: NonNullable<$$Props['align']> = 'center';
	export let alignOffset: NonNullable<$$Props['alignOffset']> = 0;
	export let arrowPadding: NonNullable<$$Props['arrowPadding']> = 0;
	export let collisionBoundary: $$Props['collisionBoundary'] = [];
	export let collisionPadding: NonNullable<$$Props['collisionPadding']> = 0;
	export let sticky: NonNullable<$$Props['sticky']> = 'partial';
	export let hideWhenDetached: NonNullable<$$Props['hideWhenDetached']> = false;
	export let avoidCollisions: NonNullable<$$Props['avoidCollisions']> = true;

    function active() {
        clearTimeout($ctx.closeTimer);
        $ctx.closeTimer = undefined;
    }

    function inactive() {
        $ctx.closeTimer = setTimeout(() => $ctx.open = false, $ctx.closeDelay);
    }
</script>

<Popper.Content onPointerEnter={active} onPointerLeave={inactive} onFocus={active} onBlur={inactive} {side} {sideOffset} {align} {alignOffset} {arrowPadding} {collisionBoundary} {collisionPadding} {sticky} {hideWhenDetached} {avoidCollisions} {...$$restProps}>
    <slot></slot>
</Popper.Content>