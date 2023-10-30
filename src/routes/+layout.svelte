<script lang="ts">
	import '@fontsource/inter/100.css';
	import '@fontsource/inter/200.css';
	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';
	import '../fonts.css';
	import '@unocss/reset/tailwind.css';
	import '../app.scss';
	import 'virtual:uno.css';

	import { browser, dev } from '$app/environment';
	import { JsIndicator, SiteHeader, TailwindIndicator } from '$docs/components/index.js';
	import * as Fathom from 'fathom-client';
	import { page } from '$app/stores';
	import { cn } from '$docs/utils';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	onMount(() => {
		if (!env.PUBLIC_FATHOM_ID || !env.PUBLIC_FATHOM_URL) return;
		Fathom.load(env.PUBLIC_FATHOM_ID, {
			url: env.PUBLIC_FATHOM_URL,
		});
	});

	$: $page.url.pathname, browser && Fathom.trackPageview();
	$: isRoot = $page.url.pathname === '/';
</script>

<div class="relative flex min-h-screen flex-col md:flex-col-reverse" id="page">
	<div class="flex flex-1">
		<slot />
	</div>
	<header
		class={cn(
			'sticky bottom-0 z-40 w-full px-2 pb-2 md:bottom-[none] md:top-0 md:pb-0 md:pt-2',
			!isRoot && 'bg-neutral-900'
		)}
	>
		<SiteHeader />
	</header>

	{#if dev}
		<TailwindIndicator />
		<JsIndicator />
	{/if}
</div>

<style global>
	html {
		color-scheme: dark;
	}

	body {
		@apply min-h-screen font-sans antialiased;
		background-color: theme('colors.neutral.900');
		color: theme('colors.white');

		min-height: 100vh;
	}

	.link {
		text-decoration-line: underline;
		-webkit-text-decoration-color: rgb(255 255 255 / 0.5);
		text-decoration-color: rgb(255 255 255 / 0.5);
		text-underline-offset: 4px;
		opacity: 0.75;

		&:active {
			--un-translate-y: 1px;
			transform: translateX(var(--un-translate-x)) translateY(var(--un-translate-y))
				translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x))
				rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x))
				skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))
				scaleZ(var(--un-scale-z));
		}

		&:is(:hover, :focus) {
			text-decoration: theme('colors.magnum.500');
			opacity: 1;
		}
	}

	*:not(body) {
		outline: none !important;
		&:focus-visible {
			@apply ring ring-magnum-400;
		}
	}

	.inline-code {
		@apply relative rounded-md bg-magnum-900/50 px-[0.25rem] py-[0.15rem] font-mono
			text-[0.75rem] text-xs font-semibold leading-7 text-magnum-300;
	}

	.inline-code.neutral {
		@apply bg-neutral-800 text-neutral-100;
	}

	@media (max-width: 640px) {
		.container {
			padding-inline: 1rem;
		}
	}
</style>
