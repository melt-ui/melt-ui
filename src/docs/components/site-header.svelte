<script lang="ts">
	import { Discord, GitHub, MobileNav } from '$docs/components';
	import { navConfig, siteConfig } from '$docs/config';
</script>

<header
	class="sticky top-0 z-40 w-full border-b border-b-neutral-100/[0.06] bg-neutral-900 px-2 pt-2"
>
	<div class="container flex h-14 items-center rounded-md bg-neutral-800">
		<div class="flex">
			<a href="/" class="mr-6 flex items-center">
				<img src="/logo.svg" alt="Melt UI Logo" class="h-9 w-auto" />
			</a>
		</div>

		<div class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
			<div class="w-full flex-1 md:w-auto md:flex-none">
				<!-- Search/CMDK here eventually -->
			</div>
		</div>
		<nav class="flex items-center text-sm font-semibold leading-6">
			<!-- Top Navbar -->
			<ul class="hidden space-x-8 md:flex">
				{#each navConfig.mainNav as navItem}
					<li>
						<a href={navItem.href} class="transition-colors hover:text-magnum-500">
							{navItem.title}
						</a>
					</li>
				{/each}
			</ul>
			<div class="ml-6 flex items-center border-neutral-700 pl-6 md:border-l">
				<a
					href={siteConfig.links.discord}
					target="_blank"
					rel="noreferrer"
					class=" text-neutral-400 transition-colors hover:text-neutral-50"
				>
					<Discord class="h-5 w-5" />
					<span class="sr-only">Join the Melt UI Discord</span>
				</a>
				<a
					href={siteConfig.links.github}
					target="_blank"
					rel="noreferrer"
					class="ml-6 text-neutral-400 transition-colors hover:text-neutral-50"
				>
					<GitHub class="h-5 w-5" />
					<span class="sr-only">View the Melt UI GitHub Repository</span>
				</a>
				<MobileNav />
			</div>
		</nav>
	</div>
</header>
