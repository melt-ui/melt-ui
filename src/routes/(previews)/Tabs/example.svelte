<script lang="ts">
	import { Tabs } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';

	export let propsObj: ResolvedProps<typeof Tabs>;
</script>

<div class="contents">
	<Tabs.Root
		class="flex flex-col overflow-hidden rounded-md shadow-lg
		data-[orientation=vertical]:flex-row"
		value="tab1"
		activateOn={propsObj.Root.activateOn}
		orientation={propsObj.Root.orientation}
		dir={propsObj.Root.dir}
	>
		<Tabs.List
			class="flex shrink-0 border-b border-vermilion-100 bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r"
			aria-label="Manage your account"
		>
			<Tabs.Trigger class="trigger" value="tab1">Account</Tabs.Trigger>
			<Tabs.Trigger class="trigger" value="tab2">Password</Tabs.Trigger>
			<Tabs.Trigger class="trigger" value="tab3">Settings</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content
			class="w-[350px] grow bg-white p-5 outline-none focus:ring-2 focus:ring-black"
			value="tab1"
		>
			<p class="mb-5 leading-normal text-vermilion-950">
				Make changes to your account here. Click save when you're done.
			</p>
			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="name">
					Name
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
					leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="username">
					Username
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
				leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-8 cursor-default items-center justify-center rounded
					 bg-green-100 px-[15px] font-medium leading-none text-green-900 outline-none focus:ring-2 focus:ring-black"
				>
					Save changes
				</button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			class="w-[350px] grow bg-white p-5 outline-none focus:ring-2 focus:ring-black"
			value="tab2"
		>
			<p class="mb-5 leading-normal text-vermilion-950">
				Change your password here. Click save when you're done.
			</p>
			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="current">
					Current password
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
					leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="current"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="new">
					New password
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
				leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="new"
					type="password"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-8 cursor-default items-center justify-center rounded
					 bg-green-100 px-[15px] font-medium leading-none text-green-900 outline-none focus:ring-2 focus:ring-black"
				>
					Save changes
				</button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			class="w-[350px] grow bg-white p-5 outline-none focus:ring-2 focus:ring-black"
			value="tab3"
		>
			<p class="mb-5 leading-normal text-vermilion-950">
				Change your password here. Click save when you're done.
			</p>
			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="current">
					Current password
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
				leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="current"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-vermilion-950" for="new">
					New password
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
			leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
					id="new"
					type="password"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-8 cursor-default items-center justify-center rounded
				 bg-green-100 px-[15px] font-medium leading-none text-green-900 outline-none focus:ring-2 focus:ring-black"
				>
					Save changes
				</button>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="postcss">
	.contents :global(.trigger) {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center bg-white px-5 leading-none text-vermilion-900 outline-none
			focus:relative focus:ring-2 focus:ring-black;
	}

	.contents :global(.trigger[data-orientation='vertical']) {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent border-b-vermilion-100 py-4  last:border-b-0;
	}

	.contents :global(.trigger[data-state='active']) {
		@apply text-vermilion-700 focus:relative;
	}

	.contents :global(.trigger[data-state='active'][data-orientation='horizontal']) {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative focus:ring-2 focus:ring-black;
	}

	.contents :global(.trigger[data-state='active'][data-orientation='vertical']) {
		@apply border-r-vermilion-500;
	}
</style>
