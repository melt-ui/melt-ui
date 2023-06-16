<script lang="ts">
	import { cn } from '$routes/helpers';

	export let fullwidth = false;
</script>

<div class="comp-preview comp-preview-colored mt-8 h-96">
	<div
		class={cn('flex w-full max-w-md grow items-center justify-center', fullwidth && 'max-w-none')}
	>
		<slot />
	</div>
</div>
