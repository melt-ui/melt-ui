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
		it('`closeOnEscape: true` on child should only close child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				closeOnEscape: true,
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

		it('`closeOnEscape: false` on child should neither close child nor parent', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				closeOnEscape: false,
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

		it('`closeOnEscape: null` on child should close both parent and child', async () => {
			const { user, getByTestId, queryByTestId, getRootContent } = await setup({
				closeOnEscape: null,
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
	});
});
