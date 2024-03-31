import { describe, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import InteractOutsideRoot from './InteractOutside.svelte';
import type { CreateDialogProps } from '$lib/index.js';

async function setup(props: CreateDialogProps) {
	const user = userEvent.setup();
	const returned = render(InteractOutsideRoot, props);
	const rootTrigger = returned.getByTestId('root-dialog-trigger');
	const getRootContent = () => returned.queryByTestId('root-dialog-content');
	expect(getRootContent()).toBeNull();
	await user.click(rootTrigger);
	expect(getRootContent()).toBeVisible();
	const rootOverlay = returned.getByTestId('root-dialog-overlay');
	return { user, ...returned, rootTrigger, rootOverlay, getRootContent };
}

const components = ['combobox', 'menubar', 'menu', 'popover', 'select'] as const;

describe('Nested Interact Outside Behaviors', () => {
	describe.each(components)('dialog + %s', (componentName) => {
		it('`closeOnOutsideClick: true` on child should only close child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				closeOnOutsideClick: true,
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();
			await user.click(rootOverlay);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeVisible();
			await user.click(rootOverlay);
			await waitFor(() => expect(getRootContent()).toBeNull());
		});

		it('`closeOnOutsideClick: false` on child should neither close child nor parent', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				closeOnOutsideClick: false,
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();
			await user.click(rootOverlay);
			expect(getContent()).toBeVisible();
			expect(getRootContent()).toBeVisible();
		});

		it('`closeOnOutsideClick: null` on child should close both parent and child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				closeOnOutsideClick: null,
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();
			await user.click(rootOverlay);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeNull();
		});
	});
});
