import { describe, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import EscapeKeydownRoot from './EscapeKeydownRoot.svelte';
import type { CreateDialogProps } from '$lib/index.js';
import { testKbd } from '../utils.js';

async function setup(props: CreateDialogProps) {
	const user = userEvent.setup();
	const returned = render(EscapeKeydownRoot, props);
	const rootTrigger = returned.getByTestId('root-dialog-trigger');
	const getRootContent = () => returned.queryByTestId('root-dialog-content');
	expect(getRootContent()).toBeNull();
	await user.click(rootTrigger);
	expect(getRootContent()).toBeVisible();
	return { user, ...returned, rootTrigger, getRootContent };
}

const components = [
	'dialog',
	'combobox',
	'link-preview',
	'menubar',
	'menu',
	'popover',
	'select',
	'tooltip',
] as const;

const componentsToHover = new Set<(typeof components)[number]>(['tooltip', 'link-preview']);

describe('Nested Escape Keydown Behaviors', () => {
	describe.each(components)('dialog + %s', (componentName) => {
		it('`escapeBehavior: close` on child should only close child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				escapeBehavior: 'close',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			if (componentsToHover.has(componentName)) {
				await user.hover(trigger);
			} else {
				await user.click(trigger);
			}

			expect(getContent()).toBeVisible();
			await user.keyboard(testKbd.ESCAPE);
			expect(getContent()).toBeNull();
			expect(getRootContent()).toBeVisible();
		});

		it('`escapeBehavior: ignore` on child should neither close child nor parent', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				escapeBehavior: 'ignore',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			if (componentsToHover.has(componentName)) {
				await user.hover(trigger);
			} else {
				await user.click(trigger);
			}

			expect(getContent()).toBeVisible();
			await user.keyboard(testKbd.ESCAPE);
			expect(getContent()).toBeVisible();
			expect(getRootContent()).toBeVisible();
		});

		it('`escapeBehavior: defer-otherwise-close` on child should close both parent and child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				escapeBehavior: 'defer-otherwise-close',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			if (componentsToHover.has(componentName)) {
				await user.hover(trigger);
			} else {
				await user.click(trigger);
			}

			expect(getContent()).toBeVisible();
			await user.keyboard(testKbd.ESCAPE);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeNull();
		});

		it('`escapeBehavior: defer-otherwise-ignore` on child should close both parent and child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				escapeBehavior: 'defer-otherwise-ignore',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			if (componentsToHover.has(componentName)) {
				await user.hover(trigger);
			} else {
				await user.click(trigger);
			}

			expect(getContent()).toBeVisible();
			await user.keyboard(testKbd.ESCAPE);
			await waitFor(() => expect(getContent()).toBeNull());
			expect(getRootContent()).toBeNull();
		});

		it('updating parent `escapeBehavior` should not intercept escape key press', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				escapeBehavior: 'close',
			});
			const trigger = getByTestId(`${componentName}-trigger`);
			const getContent = () => queryByTestId(`${componentName}-content`);

			if (componentsToHover.has(componentName)) {
				await user.hover(trigger);
			} else {
				await user.click(trigger);
			}

			expect(getContent()).toBeVisible();

			/**
			 * If we update parent `escapeBehaivor` to `ignore` and escape is pressed,
			 * parent element should stay open and child element should close.
			 * If the parent element's position in the stack was reset, on escape no element would be closed
			 * because the parent would be at the "top" of the stack and it's set to ignore escape key presses.
			 */
			await user.click(getByTestId(`${componentName}-set-parent-escape-behavior-ignore`));
			await user.keyboard(testKbd.ESCAPE);
			expect(getContent()).toBeNull();
			expect(getRootContent()).toBeVisible();
		});
	});
});
