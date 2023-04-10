<script lang="ts">
	import { Dialog } from '$lib';
</script>

<Dialog.Root>
	<Dialog.Trigger data-testid="trigger">Open Dialog</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay data-testid="overlay" />
		<Dialog.Content data-testid="content">
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>

			<fieldset>
				<label for="name"> Name </label>
				<input id="name" value="Thomas G. Lopes" data-testid="focusable" />
			</fieldset>
			<fieldset>
				<label for="username"> Username </label>
				<input id="username" value="@thomasglopes" />
			</fieldset>
			<div class="mt-[25px] flex justify-end gap-4">
				<Dialog.Close data-testid="close">Cancel</Dialog.Close>
				<Dialog.Close>Save changes</Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
