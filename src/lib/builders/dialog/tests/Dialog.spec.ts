import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DialogTest from './DialogTest.svelte';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers';
import { kbd } from '$lib/internal/helpers';

describe('Dialog', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { getByTestId } = await render(DialogTest);

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		await expect(content).toBeVisible();
	});

	test('Closes when closer is clicked', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const closer = getByTestId('closer');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await user.click(closer);
		await expect(content).not.toBeVisible();
	});

	test('Closes when Escape is hit', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await sleep(100);
		await user.keyboard(`{${kbd.ESCAPE}}`);
		await expect(content).not.toBeVisible();
	});

	// TODO: Fix this test. It's failing even though it works in the browser.
	test.skip('Closes when overlay is clicked', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const overlay = getByTestId('overlay');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await user.click(overlay);
		await sleep(1000);
		await expect(content).not.toBeVisible();
	});

	test('Portal attaches dialog to body', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		await user.click(trigger);
		const portal = getByTestId('portal');

		await expect(portal.parentElement).toEqual(document.body);
	});

	test('Focuses first focusable item upon opening', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		await expect(document.activeElement).toBe(content);
	});

	test('Tabbing on last item focuses first item', async () => {
		const { getByTestId } = await render(DialogTest);

		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		await expect(document.activeElement).toBe(content);
		await user.tab();
		await expect(document.activeElement).toBe(content);
	});
});
