import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import PopoverTest from './PopoverTest.svelte';
import userEvent from '@testing-library/user-event';
import { kbd } from '@melt-ui/svelte/internal/helpers';

describe('HoverCard (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(PopoverTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on click', async () => {
		const { getByTestId } = await render(PopoverTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes on escape', async () => {
		const { getByTestId } = await render(PopoverTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.keyboard(`{${kbd.ESCAPE}}`);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Closes when click outside content', async () => {
		const { getByTestId } = await render(PopoverTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const outside = getByTestId('outside');
		await user.click(outside);
		await waitFor(() => expect(content).not.toBeVisible());
	});
});
