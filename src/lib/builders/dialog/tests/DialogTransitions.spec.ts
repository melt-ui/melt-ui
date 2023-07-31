import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, vi, it, beforeEach, afterEach } from 'vitest';
import { tick } from 'svelte';
import { kbd, sleep } from '@melt-ui/svelte/internal/helpers';
import DialogTransitionTest from './DialogTransitionTest.svelte';

describe('Dialog with Transitions', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
			return window.setTimeout(() => fn(Date.now()), 16);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('No accessibility violations', async () => {
		const { container } = await render(DialogTransitionTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		await render(DialogTransitionTest);

		const trigger = screen.getByTestId('trigger');

		await expect(screen.queryByTestId('content')).toBeNull();
		await expect(trigger).toBeVisible();
		await userEvent.click(trigger);
		await waitFor(() => expect(screen.queryByTestId('content')).not.toBeNull());
		await waitFor(() => expect(screen.queryByTestId('content')).toBeVisible());
	});

	it(
		'Closes when closer is clicked',
		async () => {
			await render(DialogTransitionTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await expect(screen.queryByTestId('closer')).toBeNull();
			await user.click(trigger);
			await tick();
			await tick();
			await expect(screen.queryByTestId('content')).not.toBeNull();
			await waitFor(() => screen.getByTestId('closer'));
			await user.click(screen.getByTestId('closer'));
			await tick();
			await waitForElementToBeRemoved(() => screen.getByTestId('content'));

			expect(screen.queryByTestId('content')).toBeNull();
		},
		{ retry: 3 }
	);

	it(
		'Closes when Escape is pressed',
		async () => {
			await render(DialogTransitionTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await user.click(trigger);
			await expect(screen.queryByTestId('content')).toBeVisible();
			await user.keyboard(`{${kbd.ESCAPE}}`);
			await waitForElementToBeRemoved(() => screen.getByTestId('content'));

			expect(screen.queryByTestId('content')).toBeNull();
		},
		{ retry: 3 }
	);

	it(
		'Closes when overlay is clicked',
		async () => {
			await render(DialogTransitionTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await expect(screen.queryByTestId('overlay')).toBeNull();
			await user.click(trigger);
			await tick();
			await expect(screen.getByTestId('content')).toBeVisible();
			await expect(screen.getByTestId('overlay')).toBeVisible();
			await sleep(100);
			await user.click(screen.getByTestId('overlay'));
			await waitForElementToBeRemoved(() => screen.getByTestId('content'));

			expect(screen.queryByTestId('content')).toBeNull();
		},
		{ retry: 3 }
	);

	it(
		'Content Portal attaches dialog to body',
		async () => {
			render(DialogTransitionTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');
			await user.click(trigger);

			await waitFor(() => screen.getByTestId('content'));
			const content = screen.getByTestId('content');

			await expect(content.parentElement).toEqual(document.body);
		},
		{
			retry: 3,
		}
	);

	it(
		'Overlay Portal attaches dialog to body',
		async () => {
			const { getByTestId } = await render(DialogTransitionTest);
			const user = userEvent.setup();
			const trigger = getByTestId('trigger');
			await user.click(trigger);

			const overlay = getByTestId('overlay');

			await expect(overlay.parentElement).toEqual(document.body);
		},
		{
			retry: 3,
		}
	);

	it('Focuses first focusable item upon opening', async () => {
		await render(DialogTransitionTest);

		const user = userEvent.setup();
		const trigger = screen.getByTestId('trigger');

		await expect(trigger).toBeVisible();
		await expect(screen.queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(screen.getByTestId('content')).toBeVisible());
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		await expect(document.activeElement).toBe(screen.getByTestId('content'));
	});

	it(
		'Tabbing on last item focuses first item',
		async () => {
			await render(DialogTransitionTest);

			const user = userEvent.setup();
			const trigger = screen.getByTestId('trigger');

			await expect(trigger).toBeVisible();
			await expect(screen.queryByTestId('content')).toBeNull();
			await user.click(trigger);
			await waitFor(() => expect(screen.getByTestId('content')).toBeVisible());
			// Testing focus-trap is a bit flaky. So the focusable element is
			// always content here.
			await expect(document.activeElement).toBe(screen.getByTestId('content'));
			await user.tab();
			await expect(document.activeElement).toBe(screen.getByTestId('content'));
		},
		{ retry: 3 }
	);
});
