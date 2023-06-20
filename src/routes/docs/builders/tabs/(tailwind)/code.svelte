<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';
	const { root, list, content, trigger } = createTabs({ value: 'tab1' });
</script>

<div
	{...$root}
	class="flex flex-col overflow-hidden rounded-md shadow-lg data-[orientation=vertical]:flex-row"
>
	<div
		{...list}
		class="flex shrink-0 border-b border-magnum-100 bg-white
		data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
		aria-label="Manage your account"
	>
		<button {...$trigger('tab1')} class="trigger">Account</button>
		<button {...$trigger('tab2')} class="trigger">Password</button>
		<button {...$trigger({ value: 'tab3', disabled: true })} class="trigger">Disabled</button>
		<button {...$trigger('tab4')} class="trigger">Settings</button>
	</div>
	<div
		{...$content('tab1')}
		class="grow bg-white p-5 outline-none focus:ring focus:ring-magnum-400"
	>
		<p class="description">Make changes to your account here. Click save when you're done.</p>
		<fieldset>
			<label for="name"> Name </label>
			<input id="name" value="Thomas G. Lopes" />
		</fieldset>

		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div
		{...$content('tab2')}
		class="grow bg-white p-5 outline-none focus:ring focus:ring-magnum-400"
	>
		<p class="description">Change your password here. Click save when you're done.</p>
		<fieldset>
			<label for="new"> New password </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div
		{...$content('tab4')}
		class="grow bg-white p-5 outline-none focus:ring focus:ring-magnum-400"
	>
		<p class="mb-5 leading-normal text-magnum-950">
			Change your settings here. Click save when you're done.
		</p>

		<fieldset>
			<label for="new"> New email </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.trigger {
		@apply flex h-11 flex-1 cursor-default select-none items-center
      justify-center rounded-none bg-white px-5 leading-none text-magnum-900
			outline-none focus:relative focus:ring focus:ring-magnum-400;
	}

	.trigger[data-orientation='vertical'] {
		@apply w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent border-b-magnum-100 py-4  last:border-b-0;
	}

	.trigger[data-state='active'] {
		@apply text-magnum-700 focus:relative;
	}

	.trigger[data-state='active'][data-orientation='horizontal'] {
		@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative focus:ring focus:ring-magnum-400;
	}

	.trigger[data-state='active'][data-orientation='vertical'] {
		@apply border-r-magnum-500;
	}

	/* Content Elements */

	fieldset {
		@apply mb-4 flex w-full flex-col justify-start;
	}

	label {
		@apply mb-2.5 block text-sm leading-none text-magnum-950;
	}

	input {
		@apply h-8 shrink-0 grow rounded border px-2.5 leading-none text-magnum-900 outline-none focus:ring focus:ring-magnum-800;
	}

	.actions {
		@apply mt-5 flex justify-end;
	}

	button {
		@apply inline-flex h-8 cursor-default items-center justify-center rounded bg-green-100 px-[15px] font-medium leading-none text-green-900 outline-none focus:ring focus:ring-magnum-400;
	}
</style>
