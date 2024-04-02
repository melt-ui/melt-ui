import { describe, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import InteractOutsideRoot from './InteractOutside.svelte';
import type { CreateDialogProps } from '$lib/index.js';
import { sleep } from '$lib/internal/helpers/sleep.js';

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
		it('`clickOutsideBehavior: close` on child should only close child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				clickOutsideBehavior: 'close',
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

		it('`clickOutsideBehavior: ignore` on child should neither close child nor parent', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				clickOutsideBehavior: 'ignore',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();
			await user.click(rootOverlay);
			expect(getContent()).toBeVisible();
			expect(getRootContent()).toBeVisible();
		});

		it('`clickOutsideBehavior: defer` on child should close both parent and child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				clickOutsideBehavior: 'defer',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();
			await user.click(rootOverlay);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeNull();
		});

		it('updating parent `clickOutsideBehavior` should not intercept outside click', async () => {
			const { user, getByTestId, queryByTestId, getRootContent, rootOverlay } = await setup({
				clickOutsideBehavior: 'close',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			await user.click(trigger);
			expect(getContent()).toBeVisible();

			/**
			 * If we update parent `clickOutsideBehavior` to `ignore` and clicking outside,
			 * parent element should stay open and child element should close.
			 * If the parent element's position in the stack was reset, on outside click, no element would be closed
			 * because the parent would be at the "top" of the stack and it's set to ignore outside clicks.
			 */
			await user.click(getByTestId(`${componentName}-set-parent-click-outside-behavior-ignore`));
			await user.click(rootOverlay);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeVisible();
			await user.click(rootOverlay);
			await sleep(20);
			expect(getRootContent()).toBeVisible();
		});
	});
});
