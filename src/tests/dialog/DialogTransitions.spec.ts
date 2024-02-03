import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, vi, it, beforeEach, afterEach } from 'vitest';
import { sleep } from '$lib/internal/helpers/index.js';
import { testKbd as kbd } from '../utils.js';
import DialogTransitionTest from './DialogTransitionTest.svelte';
import type { CreateDialogProps } from '$lib/index.js';

function setup(props: CreateDialogProps = {}) {
	const user = userEvent.setup();
	const returned = render(DialogTransitionTest, props);
	const trigger = returned.getByTestId('trigger');
	expect(trigger).toBeVisible();
	return {
		user,
		trigger,
		...returned,
	};
}

async function open(props: CreateDialogProps = {}) {
	const returned = setup(props);
	const { queryByTestId, user, trigger } = returned;
	expect(queryByTestId('content')).toBeNull();
	await user.click(trigger);
	await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
	return returned;
}

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
		const { container } = render(DialogTransitionTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		const { queryByTestId } = await open();
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
	});

	it('Closes when closer is clicked', async () => {
		const { user, queryByTestId, getByTestId } = await open();

		await waitFor(() => getByTestId('closer'));
		await user.click(getByTestId('closer'));
		await waitFor(() => expect(queryByTestId('content')).toBeNull());
	});

	it('Closes when Escape is pressed', async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(queryByTestId('content')).toBeNull());
	});

	it('Closes when overlay is clicked', async () => {
		const { user, queryByTestId, getByTestId } = await open();
		await sleep(100);
		await waitFor(() => expect(queryByTestId('content')).not.toBeNull());
		await waitFor(() => expect(queryByTestId('overlay')).not.toBeNull());
		await user.click(getByTestId('overlay'));
		await waitFor(() => expect(queryByTestId('content')).toBeNull());
	});

	it('Portals the portalled el into the body when no portal prop is passed', async () => {
		const { getByTestId } = await open();

		await waitFor(() => getByTestId('portalled'));
		const portalled = getByTestId('portalled');

		expect(portalled.parentElement).toEqual(document.body);
	});

	it('Portals the portalled el into the correct target if one is passed via the `portal` prop', async () => {
		const { getByTestId } = await open({ portal: '#portal-target' });
		const portalTarget = getByTestId('portal-target');
		await waitFor(() => getByTestId('portalled'));
		const portalled = getByTestId('portalled');
		expect(portalled.parentElement).toEqual(portalTarget);
	});

	it('Does not portal the portalled el if `null` is passed as the `portal` prop', async () => {
		const { getByTestId } = await open({ portal: null });
		const main = getByTestId('main');
		await waitFor(() => getByTestId('portalled'));
		const portalled = getByTestId('portalled');
		expect(portalled.parentElement).toEqual(main);
	});

	it('Focuses first focusable item upon opening', async () => {
		const { getByTestId } = await open();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(getByTestId('content'));
	});

	it('Tabbing on last item focuses first item', async () => {
		const { user, getByTestId } = await open();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(getByTestId('content'));
		await user.tab();
		expect(document.activeElement).toBe(getByTestId('content'));
	});
});
