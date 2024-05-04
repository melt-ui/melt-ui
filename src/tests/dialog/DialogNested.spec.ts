import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import DialogNestedTest from './DialogNestedTest.svelte';
import { axe } from 'jest-axe';
import { vi, it, beforeEach, afterEach, describe } from 'vitest';
import { testKbd as kbd } from '../utils.js';

describe('Nested Dialogs', () => {
	beforeEach(() => {
		vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
			return window.setTimeout(() => fn(Date.now()), 16);
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('No accessibility violations', async () => {
		const { container } = render(DialogNestedTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when nested trigger is clicked', async () => {
		const user = userEvent.setup();
		const { queryByTestId, getByTestId } = render(DialogNestedTest);

		const trigger = getByTestId('trigger');
		expect(queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
		await waitFor(() => expect(queryByTestId('content')).toBeVisible());
		await waitFor(() => expect(getByTestId('triggerA')).toBeVisible());
		expect(queryByTestId('contentA')).toBeNull();
		await user.click(getByTestId('triggerA'));
		await waitFor(() => expect(queryByTestId('contentA')).not.toBeNull());
		await waitFor(() => expect(getByTestId('contentA')).toBeVisible());
	});

	it('Closes when closer is clicked', async () => {
		const user = userEvent.setup();
		const { queryByTestId, getByTestId } = render(DialogNestedTest);
		const trigger = getByTestId('trigger');

		expect(queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
		expect(queryByTestId('contentA')).toBeNull();
		await user.click(getByTestId('triggerA'));
		await waitFor(() => expect(queryByTestId('contentA')).not.toBeNull());
		await user.click(getByTestId('closerA'));
		await waitFor(() => expect(queryByTestId('contentA')).toBeNull());

		expect(queryByTestId('content')).not.toBeNull();
	});

	it('Closes when Escape is hit', async () => {
		const user = userEvent.setup();
		const { queryByTestId, getByTestId } = render(DialogNestedTest);
		const trigger = getByTestId('trigger');

		expect(trigger).toBeVisible();
		expect(queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId('content')).toBeNull());
	});

	it('Closes when overlay is clicked', async () => {
		const user = userEvent.setup();
		const { queryByTestId, getByTestId } = render(DialogNestedTest);
		const trigger = getByTestId('trigger');

		expect(queryByTestId('content')).toBeNull();
		expect(queryByTestId('overlay')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(getByTestId('content')).not.toBeNull());
		await waitFor(() => expect(getByTestId('overlay')).not.toBeNull());
		await user.click(getByTestId('overlay'));
		await waitFor(() => expect(queryByTestId('content')).toBeNull());
		expect(queryByTestId('content')).toBeNull();
	});

	it('Focuses first focusable item upon opening', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogNestedTest);

		const trigger = getByTestId('trigger');
		expect(queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(getByTestId('content'));
	});

	it('Tabbing on last item focuses first item', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogNestedTest);

		const trigger = getByTestId('trigger');

		expect(queryByTestId('content')).toBeNull();
		await user.click(trigger);
		await waitFor(() => expect(getByTestId('content')).not.toBeNull());
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(getByTestId('content'));
		await user.tab();
		expect(document.activeElement).toBe(getByTestId('content'));
	});
});
