<script lang="ts">
	import External from '~icons/lucide/external-link';

	export let href: string;

	$: internal = href.startsWith('/');

	$: rel = !internal ? 'noopener noreferrer' : undefined;
	$: target = !internal ? '_blank' : undefined;
</script>

<a
	class="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-neutral-100/80"
	{href}
	{target}
	{rel}
>
	<slot />
	{#if !internal}
		<External class="h-4 w-4" />
	{/if}
</a>
