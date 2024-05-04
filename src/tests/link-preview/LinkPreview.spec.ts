import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import LinkPreviewTest from './LinkPreviewTest.svelte';
import { userEvent } from '@testing-library/user-event';
import type { CreateLinkPreviewProps } from '$lib/index.js';
import { testKbd as kbd } from '../utils.js';

function setup(props: CreateLinkPreviewProps = {}) {
	const user = userEvent.setup();
	const returned = render(LinkPreviewTest, props);
	const trigger = returned.getByTestId('trigger');
	return {
		user,
		trigger,
		...returned,
	};
}

describe('LinkPreview (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(LinkPreviewTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on hover', async () => {
		const { getByTestId, trigger, user } = setup();
		const content = getByTestId('content');
		expect(content).not.toBeVisible();
		await user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes on escape', async () => {
		const { getByTestId, trigger, user } = setup();
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(content).not.toBeVisible());
	});
	test('Respects the `escapeBehavior` prop', async () => {
		const { getByTestId, trigger, user } = setup({
			escapeBehavior: 'ignore',
		});
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes when pointer moves outside', async () => {
		const { getByTestId, trigger, user } = setup();
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const start = getByTestId('start');
		await user.hover(start);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test.skip('Closes on outside click by default', async () => {
		const { getByTestId, trigger, user } = setup();
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const start = getByTestId('start');
		await user.click(start);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Custom ids are applied when provided', async () => {
		const ids = {
			content: 'id-content',
			trigger: 'id-trigger',
		};
		const { getByTestId } = setup({
			ids,
		});

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(trigger.id).toBe(ids.trigger);
		expect(content.id).toBe(ids.content);
	});
});
