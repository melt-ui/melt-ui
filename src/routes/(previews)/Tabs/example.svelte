<script lang="ts">
	import { Tabs } from '$lib/components/Tabs';
	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof Tabs>;
</script>

<div class="contents">
	<Tabs.Root
		class="flex flex-col overflow-hidden rounded-md shadow-[0_2px_10px] shadow-black/50
		data-[orientation=vertical]:flex-row"
		value="tab1"
		activateOn={propsObj.Root.activateOn}
		orientation={propsObj.Root.orientation}
		dir={propsObj.Root.dir}
	>
		<Tabs.List
			class="flex shrink-0 border-b border-purple-600 bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r"
			aria-label="Manage your account"
		>
			<Tabs.Trigger class="trigger" value="tab1">Account</Tabs.Trigger>
			<Tabs.Trigger class="trigger" value="tab2">Password</Tabs.Trigger>
			<Tabs.Trigger class="trigger" value="tab3">Settings</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content
			class="w-[350px] grow  bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab1"
		>
			<p class="mb-5 text-[15px] leading-normal text-violet-950">
				Make changes to your account here. Click save when you're done.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="name">
					Name
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="username">
					Username
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-[35px] cursor-default items-center justify-center rounded bg-green-400 px-[15px] text-[15px] font-medium leading-none text-green-900 outline-none hover:bg-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-700"
				>
					Save changes
				</button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			class="w-[350px] grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab2"
		>
			<p class="mb-5 text-[15px] leading-normal text-violet-950">
				Change your password here. After saving, you'll be logged out.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="currentPassword">
					Current password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="currentPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="newPassword">
					New password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="newPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="confirmPassword">
					Confirm password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="confirmPassword"
					type="password"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-[35px] cursor-default items-center justify-center rounded bg-green-400 px-[15px] text-[15px] font-medium leading-none text-green-900 outline-none hover:bg-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-700"
				>
					Change password
				</button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			class="w-[350px] grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab3"
		>
			<p class="mb-5 text-[15px] leading-normal text-violet-950">
				Change your password here. After saving, you'll be logged out.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="currentPassword">
					Current password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="currentPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="newPassword">
					New password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="newPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-[13px] leading-none text-violet-950" for="confirmPassword">
					Confirm password
				</label>
				<input
					class="focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none text-violet-900 shadow-[0_0_0_1px] shadow-violet-700 outline-none focus:shadow-[0_0_0_2px]"
					id="confirmPassword"
					type="password"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="inline-flex h-[35px] cursor-default items-center justify-center rounded bg-green-400 px-[15px] text-[15px] font-medium leading-none text-green-900 outline-none hover:bg-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-700"
				>
					Change password
				</button>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="postcss">
	.contents :global(.trigger) {
		@apply flex h-[45px] flex-1 cursor-default select-none items-center
      justify-center bg-white px-5 text-[15px] leading-none text-purple-900 outline-none hover:text-violet-900
			focus:relative focus:shadow-[0_0_0_2px] focus:shadow-black;
	}

	.contents :global(.trigger[data-orientation='vertical']) {
		@apply w-full flex-grow-0 rounded-none border-b border-b-purple-500 py-4  last:border-b-0;
	}

	.contents :global(.trigger[data-state='active']) {
		@apply text-violet-900 focus:relative;
	}

	.contents :global(.trigger[data-state='active'][data-orientation='horizontal']) {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative focus:shadow-[0_0_0_2px] focus:shadow-black;
	}

	.contents :global(.trigger[data-state='active'][data-orientation='vertical']) {
		@apply border-r-2 border-r-purple-500;
	}
</style>
