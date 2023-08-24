<script lang="ts">
	import Logo from '$docs/components/logo.svelte';
	import { Check, Copy } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import Accordion from './(landing-ui)/accordion.svelte';
	import Switch from './(landing-ui)/switch.svelte';
	import Popover from './(landing-ui)/popover.svelte';
	import Slider from './(landing-ui)/slider.svelte';
	import TagsInput from './(landing-ui)/tags-input.svelte';
	import Tabs from './(landing-ui)/tabs.svelte';
	import ToggleGroup from './(landing-ui)/toggle-group.svelte';
	import PinInput from './(landing-ui)/pin-input.svelte';
	import Toolbar from './(landing-ui)/toolbar.svelte';

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyInstallCommand() {
		navigator.clipboard.writeText(`npm install @melt-ui/svelte`);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<svelte:head>
	<title>Melt UI</title>
</svelte:head>

<div class="relative flex min-h-[1080px] w-full flex-col items-center">
	<div class="flex flex-col items-center px-2">
		<h1
			class="z-10 mt-12 max-w-2xl text-center font-display text-5xl sm:text-6xl
		md:max-w-3xl md:text-7xl lg:max-w-5xl lg:text-[6rem] lg:leading-none"
		>
			<Logo class="inline-block h-12 md:-my-2 md:h-20 lg:-my-4 lg:h-32" /> <b>melt</b> away complexity
		</h1>

		<p
			class="mt-6 max-w-sm text-center text-neutral-400 md:max-w-md lg:mt-12 lg:max-w-xl lg:text-xl"
		>
			An open-source Svelte library for building high-quality, accessible design systems and web
			apps.
		</p>
		<button
			on:click={copyInstallCommand}
			class="text-md group mt-8 flex items-center justify-between gap-4 break-keep rounded-xl
				bg-zinc-800 px-4 py-3 text-left font-mono text-sm transition hover:bg-zinc-800/75
				active:translate-y-0.5 sm:shrink"
			aria-label="Copy install command"
		>
			<span>npm install <span class="whitespace-nowrap">@melt-ui/svelte</span></span>
			{#if copied}
				<div in:fly={{ y: -4 }}>
					<Check class="inline-block text-magnum-500 transition square-4" />
				</div>
			{:else}
				<div in:fly={{ y: 4 }}>
					<Copy class="inline-block transition square-4" />
				</div>
			{/if}
		</button>
		<a
			href="/docs"
			class="mt-4 rounded-xl bg-magnum-400 px-4 py-2 font-semibold text-magnum-900 transition
		hover:opacity-75 active:translate-y-0.5"
		>
			Get started
		</a>
	</div>

	<div class="dotted-bg mt-1 grid w-full grow overflow-hidden">
		<div class="absolute left-1/2 top-0 z-10 h-[50rem] w-[90rem] -translate-x-1/2 md:block">
			<Accordion class="absolute left-1/2 top-[10rem] -translate-x-1/2" />
			<Slider class="absolute left-1/2 top-[30rem] translate-x-[calc(-50%+30px)]" />
			<Switch class="absolute left-[57%] top-[5rem] sm:left-[70%] sm:top-[8rem]" />
			<TagsInput class="absolute left-[70%] top-[16rem]" />
			<PinInput class="absolute left-[62%] top-[22rem] sm:left-[67.5%] lg:left-[75%]" />
			<Popover
				class="absolute left-[25%] top-[35%] hidden md:flex lg:left-[20%] "
				contentClass="hidden md:block"
			/>
			<Tabs class="absolute bottom-[10%] left-[10%] sm:left-0" />
			<ToggleGroup
				class="absolute left-[36%] top-[12%] sm:left-[22%] sm:top-[30%] md:left-[-5%] md:top-[45%]"
			/>
			<Toolbar class="absolute bottom-[10rem] left-[50%] md:bottom-[17rem] md:left-[72.5%]" />
		</div>
	</div>
</div>

<style lang="postcss">
	.dotted-bg {
		background-image: radial-gradient(
			circle at 1px 1px,
			theme('colors.magnum.200/0.25') 2px,
			transparent 0
		);
		background-size: 1.5rem 1.5rem;
		background-repeat: repeat;
		background-position: 0.5rem center;

		position: relative;

		&::after {
			position: absolute;
			content: '';
			inset: 0;
			background: linear-gradient(to bottom, theme('colors.neutral.900') 0%, transparent 50%);
		}
	}
</style>
