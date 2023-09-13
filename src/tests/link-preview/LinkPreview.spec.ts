import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import LinkPreviewTest from './LinkPreviewTest.svelte';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers/index.js';

describe('LinkPreview (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(LinkPreviewTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on hover', async () => {
		const { getByTestId } = await render(LinkPreviewTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.hover(getByTestId('trigger'));
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes on escape', async () => {
		const { getByTestId } = await render(LinkPreviewTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.hover(getByTestId('trigger'));
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		await user.keyboard(`{${kbd.ESCAPE}}`);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Closes when pointer moves outside', async () => {
		const { getByTestId } = await render(LinkPreviewTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.hover(getByTestId('trigger'));
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const start = getByTestId('start');
		await user.hover(start);
		await waitFor(() => expect(content).not.toBeVisible());
	});
});
