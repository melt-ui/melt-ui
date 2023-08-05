import { kbd, sleep } from '$lib/internal/helpers/index.js';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import DialogNestedTest from './DialogNestedTest.svelte';
import { axe } from 'jest-axe';
import { vi, it, beforeEach, afterEach, describe } from 'vitest';

describe.skip('Nested Dialogs', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
			return window.setTimeout(() => fn(Date.now()), 16);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('No accessibility violations', async () => {
		const { container } = await render(DialogNestedTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when nested trigger is clicked', async () => {
		await render(DialogNestedTest);

		const trigger = screen.getByTestId('trigger');
		await expect(screen.queryByTestId('content')).toBeNull();
		await expect(trigger).toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(screen.queryByTestId('content')).not.toBeNull());
		await waitFor(() => expect(screen.queryByTestId('content')).toBeVisible());
		await waitFor(() => expect(screen.getByTestId('triggerA')).toBeVisible());
		await expect(screen.queryByTestId('contentA')).toBeNull();
		await userEvent.click(screen.getByTestId('triggerA'));
		await waitFor(() => expect(screen.queryByTestId('contentA')).not.toBeNull());
		await waitFor(() => expect(screen.getByTestId('contentA')).toBeVisible());
	});

	it(
		'Closes when closer is clicked',
		async () => {
			await render(DialogNestedTest);

			const trigger = screen.getByTestId('trigger');

			await expect(screen.queryByTestId('content')).toBeNull();
			await expect(trigger).toBeVisible();
			await userEvent.click(trigger);
			await waitFor(() => expect(screen.queryByTestId('content')).not.toBeNull());
			await waitFor(() => expect(screen.getByTestId('triggerA')).toBeVisible());
			await expect(screen.queryByTestId('contentA')).toBeNull();
			await userEvent.click(screen.getByTestId('triggerA'));
			await expect(screen.queryByTestId('contentA')).not.toBeNull();
			await waitFor(() => expect(screen.getByTestId('closerA')).toBeVisible());
			await userEvent.click(screen.getByTestId('closerA'));
			await waitForElementToBeRemoved(() => screen.getByTestId('contentA'));

			await expect(screen.queryByTestId('content')).not.toBeNull();
		},
		{ retry: 1 }
	);

	it('Closes when Escape is hit', async () => {
		await render(DialogNestedTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');

		await expect(trigger).toBeVisible();
		await expect(screen.queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(screen.queryByTestId('content')).toBeVisible());
		await user.keyboard(`{${kbd.ESCAPE}}`);
		await waitForElementToBeRemoved(() => screen.getByTestId('content'));

		await waitFor(() => expect(screen.queryByTestId('content')).toBeNull());
	});

	it(
		'Closes when overlay is clicked',
		async () => {
			await render(DialogNestedTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await expect(screen.queryByTestId('overlay')).toBeNull();
			await user.click(trigger);
			await waitFor(() => expect(screen.getByTestId('content')).toBeVisible());
			await waitFor(() => expect(screen.getByTestId('overlay')).toBeVisible());
			await sleep(100);
			await user.click(screen.getByTestId('overlay'));
			await waitForElementToBeRemoved(() => screen.getByTestId('content'));

			expect(screen.queryByTestId('content')).toBeNull();
		},
		{ retry: 1 }
	);

	it(
		'Focuses first focusable item upon opening',
		async () => {
			await render(DialogNestedTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await user.click(trigger);
			await waitFor(() => expect(screen.getByTestId('content')).toBeVisible());
			// Testing focus-trap is a bit flaky. So the focusable element is
			// always content here.
			await expect(document.activeElement).toBe(screen.getByTestId('content'));
		},
		{ retry: 1 }
	);

	it(
		'Tabbing on last item focuses first item',
		async () => {
			await render(DialogNestedTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await user.click(trigger);
			await waitFor(() => expect(screen.getByTestId('content')).toBeVisible());
			// Testing focus-trap is a bit flaky. So the focusable element is
			// always content here.
			await waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('content')));
			await user.tab();
			await waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('content')));
		},
		{ retry: 1 }
	);
});
