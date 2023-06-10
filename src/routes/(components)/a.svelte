<script lang="ts">
	import External from '~icons/lucide/external-link';

	export let href: string;
	export let internal = false;
</script>

<a
	class="inline-flex items-center gap-1 underline hover:opacity-75"
	{href}
	target={internal ? undefined : '_blank'}
>
	<slot />
	{#if !internal}
		<External class="h-4 w-4" />
	{/if}
</a>
