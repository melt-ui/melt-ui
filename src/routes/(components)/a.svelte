<script lang="ts">
	import External from '~icons/lucide/external-link';

	export let href: string;
</script>

<a class="inline-flex items-center gap-1 underline hover:opacity-75" {href} target="_blank">
	<slot />
	<External class="h-4 w-4" />
</a>
