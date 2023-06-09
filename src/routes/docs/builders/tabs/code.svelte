<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';
	const { root, list, content, trigger } = createTabs({ value: 'tab1' });
</script>

<div {...root} class="root">
	<div {...list} class="list" aria-label="Manage your account">
		<button {...$trigger('tab1')} class="trigger">Account</button>
		<button {...$trigger('tab2')} class="trigger">Password</button>
		<button {...$trigger({ value: 'tab3', disabled: true })} class="trigger">Disabled</button>
		<button {...$trigger('tab4')} class="trigger">Settings</button>
	</div>
	<div {...$content('tab1')} class="content">
		<p class="description">Make changes to your account here. Click save when you're done.</p>
		<fieldset>
			<label for="name"> Name </label>
			<input id="name" value="Thomas G. Lopes" />
		</fieldset>

		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div {...$content('tab2')} class="content">
		<p class="description">Change your password here. Click save when you're done.</p>
		<fieldset>
			<label for="new"> New password </label>
			<input id="new" type="password" />
		</fieldset>
		<div class="actions">
			<button>Save changes</button>
		</div>
	</div>
	<div {...$content('tab4')} class="content">
		<p class="description">Change your settings here. Click save when you're done.</p>

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
	/* Tab Parts */
	.root {
		@apply flex flex-col overflow-hidden rounded-md shadow-lg data-[orientation=vertical]:flex-row;
	}

	.list {
		@apply border-magnum-100 flex shrink-0 border-b bg-white data-[orientation=vertical]:flex-col
			data-[orientation=vertical]:border-r;
	}

	.trigger {
		@apply text-magnum-900 flex h-11 flex-1 cursor-default select-none
      items-center justify-center rounded-none bg-white px-5 leading-none
			outline-none focus:relative focus:ring-2 focus:ring-black;
	}

	.trigger[data-orientation='vertical'] {
		@apply border-b-magnum-100 w-full flex-grow-0 rounded-none border-b border-r-2 border-transparent py-4  last:border-b-0;
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

	.content {
		@apply grow bg-white p-5 outline-none focus:ring-2 focus:ring-black;
	}

	/* Content Elements */
	.description {
		@apply text-magnum-950 mb-5 leading-normal;
	}

	fieldset {
		@apply mb-4 flex w-full flex-col justify-start;
	}

	label {
		@apply text-magnum-950 mb-2.5 block text-sm leading-none;
	}

	input {
		@apply text-magnum-900 focus:ring-magnum-800 h-8 shrink-0 grow rounded border px-2.5 leading-none outline-none focus:ring-2;
	}

	.actions {
		@apply mt-5 flex justify-end;
	}

	button {
		@apply inline-flex h-8 cursor-default items-center justify-center rounded bg-green-100 px-[15px] font-medium leading-none text-green-900 outline-none focus:ring-2 focus:ring-black;
	}
</style>
