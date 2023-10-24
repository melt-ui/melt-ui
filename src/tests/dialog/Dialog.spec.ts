import { render, screen } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import DialogTest from './DialogTest.svelte';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { kbd } from '$lib/internal/helpers/index.js';
import { tick } from 'svelte';

describe('Dialog', () => {
	it('No accessibility violations', async () => {
		const { container } = render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		const now = performance.now();
		expect(content).toBeVisible();
		const elapsed = performance.now() - now;
		expect(elapsed).toBeLessThan(10);
	});

	it('Closes when closer is clicked', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const closer = screen.getByTestId('closer');
		const content = screen.getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		await userEvent.click(closer);
		expect(content).not.toBeVisible();
	});

	it('Closes when Escape is hit', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		await userEvent.keyboard(`{${kbd.ESCAPE}}`);
		expect(content).not.toBeVisible();
	});

	it('Closes when overlay is clicked', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const overlay = screen.getByTestId('overlay');
		const content = screen.getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await userEvent.click(overlay);
		await sleep(100);
		expect(content).not.toBeVisible();
	});

	it('Portalled el attaches dialog to body', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		await userEvent.click(trigger);

		const portalled = screen.getByTestId('portalled');

		expect(portalled.parentElement).toEqual(document.body);
	});

	it('Focuses first focusable item upon opening', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
	});

	it('Tabbing on last item focuses first item', async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
		await userEvent.tab();
		expect(document.activeElement).toBe(content);
	});

	it("Doesn't close when cliking content", async () => {
		render(DialogTest);

		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		const closer = screen.getByTestId('closer');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		await userEvent.click(content);
		expect(content).toBeVisible();

		// Close
		await userEvent.click(closer);
		expect(content).not.toBeVisible();

		// Open again to retest
		await userEvent.click(trigger);
		expect(content).toBeVisible();
		await userEvent.click(content);
		expect(content).toBeVisible();
	});

	it('Respects the `openFocus` prop', async () => {
		render(DialogTest, {
			openFocus: () => {
				return document.getElementById('openFocus');
			},
		});

		const trigger = screen.getByTestId('trigger');

		await userEvent.click(trigger);
		await tick();
		const openFocus = screen.getByTestId('openFocus');

		expect(openFocus).toHaveFocus();
	});

	it('Respects the `closeFocus` prop', async () => {
		render(DialogTest, {
			closeFocus: () => {
				return document.getElementById('closeFocus');
			},
		});

		const closeFocus = screen.getByTestId('closeFocus');
		const trigger = screen.getByTestId('trigger');

		await userEvent.click(trigger);
		await tick();
		await userEvent.keyboard(`{${kbd.ESCAPE}}`);

		expect(closeFocus).toHaveFocus();
	});
});
