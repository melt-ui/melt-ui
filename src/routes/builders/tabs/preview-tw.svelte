<script lang="ts">
	import { createTabs } from '$lib/builders/tabs';

	const { root, list, content, trigger } = createTabs({ value: 'tab1', orientation: 'vertical' });
</script>

<div class="comp-preview comp-preview-colored mx-auto mt-16 h-96 w-screen max-w-xl">
	<div
		{...root}
		class="flex flex-col overflow-hidden rounded-md shadow-lg
		data-[orientation=vertical]:flex-row"
	>
		<div
			{...list}
			class="flex shrink-0 border-b border-magnum-100 bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r"
			aria-label="Manage your account"
		>
			<div {...$trigger({ value: 'tab1' })} class="trigger">Account</div>
			<div {...$trigger({ value: 'tab2' })} class="trigger">Password</div>
			<div {...$trigger({ value: 'tab3' })} class="trigger">Settings</div>
		</div>
		<div {...$content('tab1')} class="grow bg-white p-5 outline-none focus:ring-2 focus:ring-black">
			<p class="mb-5 leading-normal text-magnum-950">
				Make changes to your account here. Click save when you're done.
			</p>
			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-magnum-950" for="name"> Name </label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
					leading-none text-magnum-900 outline-none focus:ring-2 focus:ring-magnum-800"
					id="name"
					value="Thomas G. Lopes"
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
		</div>
		<div {...$content('tab2')} class="grow bg-white p-5 outline-none focus:ring-2 focus:ring-black">
			<p class="mb-5 leading-normal text-magnum-950">
				Change your password here. Click save when you're done.
			</p>
			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-magnum-950" for="new">
					New password
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
				leading-none text-magnum-900 outline-none focus:ring-2 focus:ring-magnum-800"
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
		</div>
		<div {...$content('tab3')} class="grow bg-white p-5 outline-none focus:ring-2 focus:ring-black">
			<p class="mb-5 leading-normal text-magnum-950">
				Change your settings here. Click save when you're done.
			</p>

			<fieldset class="mb-[15px] flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-magnum-950" for="new">
					New email
				</label>
				<input
					class="h-8 shrink-0 grow rounded border px-2.5
			leading-none text-magnum-900 outline-none focus:ring-2 focus:ring-magnum-800"
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
		</div>
		<div {...$content('tab4')} class="grow bg-white p-5 outline-none focus:ring-2 focus:ring-black">
			<p class="mb-5 leading-normal text-magnum-950">Hush hush</p>
		</div>
	</div>
</div>

<style lang="postcss">
	.trigger {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center bg-white px-5 leading-none text-magnum-900 outline-none
			focus:relative focus:ring-2 focus:ring-black;
	}

	.trigger[data-orientation='vertical'] {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent border-b-magnum-100 py-4  last:border-b-0;
	}

	.trigger[data-state='active'] {
		@apply text-magnum-700 focus:relative;
	}

	.trigger[data-state='active'][data-orientation='horizontal'] {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative focus:ring-2 focus:ring-black;
	}

	.trigger[data-state='active'][data-orientation='vertical'] {
		@apply border-r-magnum-500;
	}
</style>
