<script lang="ts">
	import { Tabs } from '$lib/components/Tabs';
</script>

<div class="contents">
	<Tabs.Root class="flex w-[300px] flex-col shadow-[0_2px_10px] shadow-black/50" value="tab1">
		<Tabs.List class="border-purple-600 flex shrink-0 border-b" aria-label="Manage your account">
			<Tabs.Trigger class="trigger" value="tab1">Account</Tabs.Trigger>
			<Tabs.Trigger class="trigger" value="tab2">Password</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content
			class="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab1"
		>
			<p class="text-violet-950 mb-5 text-[15px] leading-normal">
				Make changes to your account here. Click save when you're done.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="text-violet-950 mb-2.5 block text-[13px] leading-none" for="name">
					Name
				</label>
				<input
					class="text-violet-900 shadow-violet-700 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="name"
					value="Thomas G. Lopes"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="text-violet-950 mb-2.5 block text-[13px] leading-none" for="username">
					Username
				</label>
				<input
					class="text-violet-900 shadow-violet-700 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="username"
					value="@thomasglopes"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="bg-green-400 text-green-900 hover:bg-green-500 focus:shadow-green-700 inline-flex h-[35px] cursor-default items-center justify-center rounded px-[15px] text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
				>
					Save changes
				</button>
			</div>
		</Tabs.Content>
		<Tabs.Content
			class="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
			value="tab2"
		>
			<p class="text-violet-950 mb-5 text-[15px] leading-normal">
				Change your password here. After saving, you'll be logged out.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="text-violet-950 mb-2.5 block text-[13px] leading-none" for="currentPassword">
					Current password
				</label>
				<input
					class="text-violet-900 shadow-violet-700 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="currentPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="text-violet-950 mb-2.5 block text-[13px] leading-none" for="newPassword">
					New password
				</label>
				<input
					class="text-violet-900 shadow-violet-700 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="newPassword"
					type="password"
				/>
			</fieldset>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="text-violet-950 mb-2.5 block text-[13px] leading-none" for="confirmPassword">
					Confirm password
				</label>
				<input
					class="text-violet-900 shadow-violet-700 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
					id="confirmPassword"
					type="password"
				/>
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button
					class="bg-green-400 text-green-900 hover:bg-green-500 focus:shadow-green-700 inline-flex h-[35px] cursor-default items-center justify-center rounded px-[15px] text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
				>
					Change password
				</button>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>

<style lang="postcss">
	.contents :global(.trigger) {
		@apply flex h-[45px] flex-1 grow cursor-default select-none items-center
      justify-center bg-white px-5 text-[15px] leading-none text-purple-900 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet-900
			focus:relative focus:shadow-[0_0_0_2px] focus:shadow-black;
	}

	.contents :global(.trigger[data-state='active']) {
		@apply text-violet-900 shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative focus:shadow-[0_0_0_2px] focus:shadow-black;
	}
</style>
