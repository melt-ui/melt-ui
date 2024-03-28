import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import DialogTest from './DialogTest.svelte';
import { userEvent } from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { testKbd as kbd } from '../utils.js';
import type { CreateDialogProps } from '$lib/index.js';

function setup(props: CreateDialogProps = {}) {
	const user = userEvent.setup();
	const returned = render(DialogTest, props);
	const trigger = returned.getByTestId('trigger');
	const content = returned.getByTestId('content');
	const overlay = returned.getByTestId('overlay');
	const portalled = returned.getByTestId('portalled');
	return {
		trigger,
		content,
		overlay,
		portalled,
		user,
		...returned,
	};
}

async function open(props: CreateDialogProps = {}) {
	const returned = setup(props);
	const { user, trigger, content } = returned;
	expect(content).not.toBeVisible();
	await user.click(trigger);
	await sleep(100);
	expect(content).toBeVisible();
	return returned;
}

describe('Dialog', () => {
	it('No accessibility violations', async () => {
		const { container } = render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		await open();
	});

	it('Closes when closer is clicked', async () => {
		const { getByTestId, user, content } = await open();
		const closer = getByTestId('closer');

		await user.click(closer);
		expect(content).not.toBeVisible();
	});

	it('Closes when Escape is hit', async () => {
		const { user, content } = await open();

		await user.keyboard(kbd.ESCAPE);
		expect(content).not.toBeVisible();
	});

	it('Closes when overlay is clicked', async () => {
		const { user, overlay, content } = await open();

		expect(overlay).toBeVisible();
		await user.click(overlay);
		expect(content).not.toBeVisible();
	});

	it('Prevents closing on outside click if `defaultPrevented` in `onOutsideClick` callback', async () => {
		const { user, overlay, content } = await open({
			onOutsideClick: (e) => {
				e.preventDefault();
			},
		});

		expect(overlay).toBeVisible();
		await user.click(overlay);
		expect(content).toBeVisible();
	});

	it('Portalled el attaches dialog to body', async () => {
		const { portalled } = await open();
		expect(portalled.parentElement).toEqual(document.body);
	});

	it('Attaches portal el to the portal target if prop provided', async () => {
		const { getByTestId, portalled } = await open({
			portal: '#portal-target',
		});
		const portalTarget = getByTestId('portal-target');

		expect(portalled.parentElement).toEqual(portalTarget);
	});

	it('Does not portal if `null` is passed as portal prop', async () => {
		const { getByTestId, portalled } = await open({
			portal: null,
		});
		const main = getByTestId('main');

		expect(portalled.parentElement).toEqual(main);
	});

	it('Focuses first focusable item upon opening', async () => {
		const { content } = await open();

		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
	});

	it('Tabbing on last item focuses first item', async () => {
		const { user, content } = await open();

		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
		await user.tab();
		expect(document.activeElement).toBe(content);
	});

	it("Doesn't close when clicking content", async () => {
		const { getByTestId, user, trigger, content } = await open();
		const closer = getByTestId('closer');

		await user.click(content);
		expect(content).toBeVisible();

		// Close
		await user.click(closer);
		expect(content).not.toBeVisible();

		// Open again to retest
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(content);
		expect(content).toBeVisible();
	});

	it('Respects the `openFocus` prop', async () => {
		const { getByTestId } = await open({
			openFocus: () => document.getElementById('openFocus'),
		});

		await waitFor(() => expect(getByTestId('openFocus')).toHaveFocus());
	});

	it('Respects the `closeFocus` prop', async () => {
		const { getByTestId, user } = await open({
			closeFocus: () => document.getElementById('closeFocus'),
		});
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(getByTestId('closeFocus')).toHaveFocus());
	});

	it('Respects the `closeOnOutsideClick` prop', async () => {
		const { user, content, overlay } = await open({
			closeOnOutsideClick: false,
		});

		expect(overlay).toBeVisible();
		await user.click(overlay);
		expect(content).toBeVisible();
	});

	it('When closeOnOutsideClick is false, clicking floating closer closes dialog', async () => {
		const { getByTestId, user, content } = await open({
			closeOnOutsideClick: false,
		});
		const closer = getByTestId('floating-closer');

		await waitFor(() => expect(closer).toBeVisible());
		await user.click(closer);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	it('Respects the `closeOnEscape` prop', async () => {
		const { user, content } = await open({
			closeOnEscape: false,
		});

		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
	});

	it("Doesn't close on escape if child intercepts event", async () => {
		const { getByTestId, user, content } = await open();

		const input = getByTestId('input-keydown-interceptor');
		input.focus();
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
	});

	it('Applies custom ids when provided', async () => {
		const ids = {
			content: 'id-content',
			title: 'id-title',
			description: 'id-description',
		};
		const { getByTestId, content } = setup({
			ids,
		});

		const title = getByTestId('title');
		const description = getByTestId('description');
		expect(content.id).toBe(ids.content);
		expect(title.id).toBe(ids.title);
		expect(description.id).toBe(ids.description);
	});

	it("Doesn't close on pointerup if the previous pointerdown didn't occur inside the dialog", async () => {
		const { user, overlay, content } = await open();

		expect(overlay).toBeVisible();
		await user.pointer({ target: content, offset: 2, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, offset: 2, keys: '[/MouseLeft]' });
		expect(content).toBeVisible();
	});

	it('Closes on pointerup if the previous pointerdown occurred outside the dialog', async () => {
		const { user, overlay, content } = await open();

		expect(overlay).toBeVisible();
		await user.pointer({ target: overlay, offset: 2, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, offset: 2, keys: '[/MouseLeft]' });
		expect(content).not.toBeVisible();
	});

	it("Doesn't deactivate focus trap on escape provided `closeOnEscape` false", async () => {
		const { getByTestId, user, content } = await open({
			closeOnEscape: false,
		});
		const closer = getByTestId('floating-closer');

		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
		expect(content).toHaveFocus();
		await user.tab({ shift: true });
		expect(closer).not.toHaveFocus();
	});

	it("Doesn't deactivate focus trap on outside click provided `closeOnOutsideClick` false", async () => {
		const { getByTestId, user, overlay, content } = await open({
			closeOnOutsideClick: false,
		});
		const closer = getByTestId('floating-closer');

		await user.click(overlay);
		expect(content).toBeVisible();
		expect(content).toHaveFocus();
		await user.tab({ shift: true });
		expect(closer).not.toHaveFocus();
	});

	it('Returns focus to trigger when manually setting `open` state to false', async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');

		expect(trigger).not.toHaveFocus();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(getByTestId('toggle-open'));
		expect(trigger).toHaveFocus();
	});

	it('Respects the `closeFocus` prop when manually setting `open` state to false', async () => {
		const { getByTestId, user, trigger } = setup({
			closeFocus: () => document.getElementById('closeFocus'),
		});
		const content = getByTestId('content');

		expect(trigger).not.toHaveFocus();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(getByTestId('toggle-open'));
		expect(getByTestId('closeFocus')).toHaveFocus();
	});
});
