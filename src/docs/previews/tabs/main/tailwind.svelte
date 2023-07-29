<script lang="ts">
	import { createTabs } from '@melt-ui/svelte';

	const {
		elements: { root, list, content, trigger },
	} = createTabs({
		defaultValue: 'tab1',
	});
</script>

<div
	melt={$root}
	class="flex max-w-[25rem] flex-col overflow-hidden rounded-md shadow-lg
	data-[orientation=vertical]:flex-row"
>
	<div
		melt={$list}
		class="flex shrink-0 overflow-x-auto border-b border-magnum-100 bg-white
		data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
		aria-label="Manage your account"
	>
		<button melt={$trigger('tab1')} class="trigger">Account</button>
		<button melt={$trigger('tab2')} class="trigger">Password</button>
		<button melt={$trigger('tab3')} class="trigger">Settings</button>
	</div>
	<div melt={$content('tab1')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-magnum-950">
			Make changes to your account here. Click save when you're done.
		</p>
		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-magnum-950"
				for="name"
			>
				Name
			</label>
			<input id="name" value="Thomas G. Lopes" />
		</fieldset>

		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
	<div melt={$content('tab2')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-magnum-950">
			Change your password here. Click save when you're done.
		</p>
		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-magnum-950"
				for="new"
			>
				New password
			</label>
			<input id="new" type="password" />
		</fieldset>
		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
	<div melt={$content('tab3')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-magnum-950">
			Change your settings here. Click save when you're done.
		</p>

		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-magnum-950"
				for="new"
			>
				New email
			</label>
			<input id="new" type="password" />
		</fieldset>
		<div class="mt-5 flex justify-end">
			<button class="save">Save changes</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.trigger {
		display: flex;
		height: theme(spacing.11);
		flex: 1;
		cursor: default;
		user-select: none;
		align-items: center;
		justify-content: center;
		border-radius: 0;
		background-color: theme(colors.white);
		padding-inline: theme(spacing.2);
		line-height: 1;
		color: theme(colors.magnum.900);

		&:focus {
			position: relative;
		}

		&[data-orientation='vertical'] {
			@apply w-full flex-grow-0 rounded-none border-b border-r-2;
			@apply border-transparent border-b-magnum-100 py-4 last:border-b-0;
		}

		&[data-state='active'] {
			@apply text-magnum-700 focus:relative;
		}

		&[data-state='active'][data-orientation='horizontal'] {
			@apply shadow-[inset_0_-1px_0_0,0_1px_0_0] shadow-current focus:relative;
		}

		&[data-state='active'][data-orientation='vertical'] {
			@apply border-r-magnum-500;
		}
	}

	input {
		height: theme(spacing.8);
		flex-shrink: 0;
		flex-grow: 1;
		border-radius: theme(borderRadius.md);
		border: 1px solid theme(colors.neutral.200);
		padding-inline: theme(spacing[2.5]);
		line-height: 1;
		color: theme(colors.magnum.900);

		&:focus {
			border-color: theme(colors.magnum.400);
		}
	}

	.save {
		display: inline-flex;
		height: theme(spacing.8);
		cursor: default;
		align-items: center;
		justify-content: center;
		border-radius: theme(borderRadius.md);
		background-color: theme(colors.green.100);
		padding-inline: theme(spacing.4);
		line-height: 1;
		font-weight: theme(fontWeight.semibold);
		color: theme(colors.green.900);

		&:hover {
			background-color: theme(colors.green.200);
		}

		&:focus {
			@apply !ring-green-600;
		}
	}
</style>
