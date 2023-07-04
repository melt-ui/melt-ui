<script lang="ts">
	import { formatStr } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/atom-one-dark';
	import { page } from '$app/stores';

	$: pageTitle = formatStr($page.url.pathname.split('/').pop() ?? '');
</script>

<svelte:head>
	<title>{pageTitle} - Melt UI</title>

	{@html theme}
</svelte:head>
