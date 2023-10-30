<script lang="ts">
	import { cn } from '$docs/utils';
	import { createTabs, melt } from '$lib/index.js';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	const {
		elements: { root, list, content, trigger },
		states: { value },
	} = createTabs({
		defaultValue: 'tab-1',
	});

	let className = '';
	export { className as class };

	const triggers = [
		{ id: 'tab-1', title: 'Account' },
		{ id: 'tab-2', title: 'Password' },
		{ id: 'tab-3', title: 'Settings' },
	];

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});
</script>

<div
	use:melt={$root}
	class={cn(
		'flex max-w-[25rem] flex-col overflow-hidden rounded-xl shadow-lg	data-[orientation=vertical]:flex-row',
		className,
	)}
>
	<div
		use:melt={$list}
		class="flex shrink-0 overflow-x-auto bg-neutral-100
		data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
		aria-label="Manage your account"
	>
		{#each triggers as triggerItem}
			<button use:melt={$trigger(triggerItem.id)} class="trigger relative">
				{triggerItem.title}
				{#if $value === triggerItem.id}
					<div
						in:send={{ key: 'trigger' }}
						out:receive={{ key: 'trigger' }}
						class="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-magnum-400"
					/>
				{/if}
			</button>
		{/each}
	</div>
	<div use:melt={$content('tab-1')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-neutral-900">
			Make changes to your account here. Click save when you're done.
		</p>
		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-neutral-900"
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
	<div use:melt={$content('tab-2')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-neutral-900">
			Change your password here. Click save when you're done.
		</p>
		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-neutral-900"
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
	<div use:melt={$content('tab-3')} class="grow bg-white p-5">
		<p class="mb-5 leading-normal text-neutral-900">
			Change your settings here. Click save when you're done.
		</p>

		<fieldset class="mb-4 flex w-full flex-col justify-start">
			<label
				class="mb-2.5 block text-sm leading-none text-neutral-900"
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

<style lang="scss">
	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;

		cursor: default;
		user-select: none;

		border-radius: 0;
		/*		background-color: _Theme(colors.neutral.100);*/

		/*		color: _Theme(colors.neutral.900);*/
		font-weight: 500;
		line-height: 1;

		flex: 1;
		/*		height: _Theme(spacing.12);*/
		/*		padding-inline: _Theme(spacing.2);*/

		&:focus {
			position: relative;
		}

		&:focus-visible {
			@apply z-10 ring-2;
		}

		&[data-state='active'] {
			@apply focus:relative;
			background-color: white;
			/*			color: _Theme('colors.magnum.900');*/
		}
	}

	input {
		/*		height: _Theme(spacing.8);*/
		flex-shrink: 0;
		flex-grow: 1;
		/*		border-radius: _Theme(borderRadius.md);*/
		/*		border: 1px solid _Theme(colors.neutral.200);*/
		/*		padding-inline: _Theme(spacing[2.5]);*/
		line-height: 1;
		/*		color: _Theme(colors.neutral.900);*/

		&:focus {
			/*			border-color: _Theme(colors.magnum.400);*/
		}
	}

	.save {
		display: inline-flex;
		/*		height: _Theme(spacing.8);*/
		cursor: default;
		align-items: center;
		justify-content: center;
		/*		border-radius: _Theme(borderRadius.md);*/
		/*		background-color: _Theme(colors.magnum.200);*/
		/*		padding-inline: _Theme(spacing.4);*/
		line-height: 1;
		/*		font-weight: _Theme(fontWeight.semibold);*/
		/*		color: _Theme(colors.magnum.900);*/
		@apply transition;

		&:hover {
			opacity: 0.75;
		}

		&:focus {
			@apply !ring-green-600;
		}
	}
</style>
