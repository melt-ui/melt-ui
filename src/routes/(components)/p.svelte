<script lang="ts">
	import { cn } from '$routes/helpers';

	export let sidenote = false;
</script>

<p class={cn('py-1 text-lg', sidenote && 'text-base italic opacity-50')}><slot /></p>
