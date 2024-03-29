import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import DialogTest from './DialogTest.svelte';
import { userEvent } from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { assertActiveFocusTrap, testKbd as kbd, touch } from '../utils.js';
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
		await waitFor(() => expect(content).not.toBeVisible());
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
		const { getByTestId, content, user } = await open();
		getByTestId('escape-interceptor').focus();
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

	it("Doesn't close on pointerup if the previous pointerdown occurred inside the dialog", async () => {
		const { user, overlay, content } = await open();
		expect(overlay).toBeVisible();
		await user.pointer({ target: content, offset: 2, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, offset: 2, keys: '[/MouseLeft]' });
		expect(content).toBeVisible();
	});

	it('Closes on pointerup if the previous pointerdown occurred outside the dialog', async () => {
		const { user, overlay, content } = await open();

		expect(overlay).toBeVisible();
		await user.pointer({ target: overlay, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, keys: '[/MouseLeft]' });
		await waitFor(() => expect(content).not.toBeVisible());
	});

	it("Doesn't deactivate focus trap on escape provided `closeOnEscape` false", async () => {
		const { user, content } = await open({ closeOnEscape: false });
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
		await assertActiveFocusTrap(user, content);
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
		const { getByTestId, user, trigger } = await open();
		await user.click(getByTestId('toggle-open'));
		expect(trigger).toHaveFocus();
	});

	it('Respects the `closeFocus` prop when manually setting `open` state to false', async () => {
		const { getByTestId, user } = await open({
			closeFocus: () => document.getElementById('closeFocus'),
		});
		await user.click(getByTestId('toggle-open'));
		expect(getByTestId('closeFocus')).toHaveFocus();
	});

	it("Doesn't deactivate focus trap on escape that is intercepted", async () => {
		const { getByTestId, user, content } = await open();
		getByTestId('escape-interceptor').focus();
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
		await assertActiveFocusTrap(user, content);
	});

	it("Doesn't deactivate focus trap on outside click that is intercepted", async () => {
		const { getByTestId, user, content } = await open();
		await user.click(getByTestId('click-interceptor'));
		await assertActiveFocusTrap(user, content);
	});

	describe('Mouse Device', () => {
		it("Doesn't close when interacting outside with click interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			const clickInterceptor = getByTestId('click-interceptor');
			await user.click(clickInterceptor);
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerdown interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await user.click(getByTestId('pointerdown-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerup interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await user.click(getByTestId('pointerup-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mousedown interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await user.click(getByTestId('mousedown-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mouseup interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await user.click(getByTestId('mouseup-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});
	});

	describe('Touch Device', () => {
		it("Doesn't close when interacting outside with click interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			const clickInterceptor = getByTestId('click-interceptor');
			await touch(clickInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerdown interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await touch(getByTestId('pointerdown-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerup interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await touch(getByTestId('pointerup-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mousedown interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await touch(getByTestId('mousedown-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mouseup interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			await touch(getByTestId('mouseup-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with touchstart interceptor", async () => {
			const { getByTestId, user, content, overlay } = await open();
			const touchstartInterceptor = getByTestId('touchstart-interceptor');
			await touch(touchstartInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with touchend interceptor", async () => {
			const { getByTestId, user, overlay, content } = await open();
			const touchendInterceptor = getByTestId('touchend-interceptor');
			await touch(touchendInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it('Closes on touchend if the previous touchstart occurred outside the dialog', async () => {
			const { content, overlay } = await open();
			expect(overlay).toBeVisible();
			await fireEvent(overlay, new TouchEvent('pointerdown', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('touchstart', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('pointerup', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('touchend', { bubbles: true }));
			await sleep(20);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		/**
		 * This makes sure we reset `interceptedEvents` not only after a click event.
		 * On touch devices, actions like pressing, moving the finger, and lifting it off
		 * the screen may not trigger a `click` event.
		 */
		it('Resets `interceptedEvents` when calling `preventDefault()` on touch event', async () => {
			const { getByTestId, user, overlay, content } = await open();
			const touchendPreventDefault = getByTestId('touchend-prevent-default-interceptor');
			await fireEvent(touchendPreventDefault, new TouchEvent('touchstart', { bubbles: true }));
			await fireEvent(touchendPreventDefault, new TouchEvent('touchend', { bubbles: true }));
			await sleep(20);
			expect(content).toBeVisible();

			/**
			 * Clicking the overlay and the dialog getting closed
			 * will be possible only if we reset `interceptedEvents`
			 * from the previous interaction.
			 */
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});
	});
});
