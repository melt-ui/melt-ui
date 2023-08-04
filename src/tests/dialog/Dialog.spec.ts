import { render, screen } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import DialogTest from './DialogTest.svelte';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { kbd } from '$lib/internal/helpers/index.js';

describe('Dialog', () => {
	it('No accessibility violations', async () => {
		const { container } = await render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		await render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		await expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		const now = performance.now();
		await expect(content).toBeVisible();
		const elapsed = performance.now() - now;
		expect(elapsed).toBeLessThan(10);
	});

	it('Closes when closer is clicked', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		const closer = screen.getByTestId('closer');
		const content = screen.getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await user.click(closer);
		await expect(content).not.toBeVisible();
	});

	it('Closes when Escape is hit', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await user.keyboard(`{${kbd.ESCAPE}}`);
		await expect(content).not.toBeVisible();
	});

	it('Closes when overlay is clicked', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		const overlay = screen.getByTestId('overlay');
		const content = screen.getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		await sleep(100);
		await expect(overlay).toBeVisible();
		await user.click(overlay);
		await sleep(100);
		await expect(content).not.toBeVisible();
	});

	it('Portalled el attaches dialog to body', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		await user.click(trigger);

		const portalled = screen.getByTestId('portalled');

		await expect(portalled.parentElement).toEqual(document.body);
	});

	it('Focuses first focusable item upon opening', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.click(trigger);
		await expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		await expect(document.activeElement).toBe(content);
	});

	it('Tabbing on last item focuses first item', async () => {
		await render(DialogTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

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
