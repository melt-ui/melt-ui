import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import PopoverTest from './PopoverTest.svelte';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers/index.js';

describe('Popover (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(PopoverTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on click', async () => {
		const { getByTestId } = render(PopoverTest);
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes on escape', async () => {
		const { getByTestId } = render(PopoverTest);
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await userEvent.keyboard(`{${kbd.ESCAPE}}`);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Closes when click outside content', async () => {
		const { getByTestId } = render(PopoverTest);
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await userEvent.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const outside = getByTestId('outside');
		await userEvent.click(outside);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Respects `openFocus` prop', async () => {
		const { getByTestId } = render(PopoverTest, {
			openFocus: () => {
				return document.getElementById('openFocus');
			},
		});
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		const openFocus = getByTestId('openFocus');
		expect(openFocus).toHaveFocus();
	});

	test('Respects `closeFocus` prop', async () => {
		const { getByTestId } = render(PopoverTest, {
			closeFocus: () => {
				return document.getElementById('closeFocus');
			},
		});
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await userEvent.keyboard(`{${kbd.ESCAPE}}`);
		await waitFor(() => expect(content).not.toBeVisible());
		const closeFocus = getByTestId('closeFocus');
		expect(closeFocus).toHaveFocus();
	});
});
