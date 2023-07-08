<script lang="ts">
	import '../app.postcss';
	import { dev } from '$app/environment';
	import { SiteHeader, TailwindIndicator } from '$docs/components';
</script>

<div class="relative flex min-h-screen flex-col" id="page">
	<SiteHeader />
	<div class="flex flex-1">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
