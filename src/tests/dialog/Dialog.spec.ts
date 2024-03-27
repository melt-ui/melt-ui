import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import DialogTest from './DialogTest.svelte';
import { userEvent } from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import { testKbd as kbd, touch } from '../utils.js';
import type { CreateDialogProps } from '$lib/index.js';

function setup(props: CreateDialogProps = {}) {
	const user = userEvent.setup();
	const returned = render(DialogTest, props);
	const trigger = returned.getByTestId('trigger');
	return {
		trigger,
		user,
		...returned,
	};
}

describe('Dialog', () => {
	it('No accessibility violations', async () => {
		const { container } = render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it('Opens when trigger is clicked', async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.click(trigger);
		const now = performance.now();
		expect(content).toBeVisible();
		const elapsed = performance.now() - now;
		expect(elapsed).toBeLessThan(10);
	});

	it('Closes when closer is clicked', async () => {
		const { getByTestId, user, trigger } = setup();
		const closer = getByTestId('closer');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(closer);
		expect(content).not.toBeVisible();
	});

	it('Closes when Escape is hit', async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.keyboard(kbd.ESCAPE);
		expect(content).not.toBeVisible();
	});

	it('Closes when overlay is clicked', async () => {
		const { getByTestId, user, trigger } = setup();
		const overlay = getByTestId('overlay');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await user.click(overlay);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	it('Prevents closing on outside click if `defaultPrevented` in `onOutsideClick` callback', async () => {
		const { getByTestId, user, trigger } = setup({
			onOutsideClick: (e) => {
				e.preventDefault();
			},
		});
		const overlay = getByTestId('overlay');
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await user.click(overlay);
		expect(content).toBeVisible();
	});

	it('Portalled el attaches dialog to body', async () => {
		const { getByTestId, user, trigger } = setup();
		await user.click(trigger);

		const portalled = getByTestId('portalled');

		expect(portalled.parentElement).toEqual(document.body);
	});

	it('Attaches portal el to the portal target if prop provided', async () => {
		const { getByTestId, user, trigger } = setup({
			portal: '#portal-target',
		});
		await user.click(trigger);
		const portalled = getByTestId('portalled');
		const portalTarget = getByTestId('portal-target');

		expect(portalled.parentElement).toEqual(portalTarget);
	});

	it('Does not portal if `null` is passed as portal prop', async () => {
		const { getByTestId, user, trigger } = setup({
			portal: null,
		});
		await user.click(trigger);
		const portalled = getByTestId('portalled');
		const main = getByTestId('main');

		expect(portalled.parentElement).toEqual(main);
	});

	it('Focuses first focusable item upon opening', async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
	});

	it('Tabbing on last item focuses first item', async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(content);
		await user.tab();
		expect(document.activeElement).toBe(content);
	});

	it("Doesn't close when clicking content", async () => {
		const { getByTestId, user, trigger } = setup();
		const content = getByTestId('content');
		const closer = getByTestId('closer');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
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
		const { getByTestId, user, trigger } = setup({
			openFocus: () => document.getElementById('openFocus'),
		});

		await user.click(trigger);
		await waitFor(() => expect(getByTestId('openFocus')).toHaveFocus());
	});

	it('Respects the `closeFocus` prop', async () => {
		const { getByTestId, user, trigger } = setup({
			closeFocus: () => document.getElementById('closeFocus'),
		});
		await user.click(trigger);
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(getByTestId('closeFocus')).toHaveFocus());
	});

	it('Respects the `closeOnOutsideClick` prop', async () => {
		const { getByTestId, user, trigger } = setup({
			closeOnOutsideClick: false,
		});
		const content = getByTestId('content');
		const overlay = getByTestId('overlay');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await user.click(overlay);
		expect(content).toBeVisible();
	});

	it('When closeOnOutsideClick is false, clicking floating closer closes dialog', async () => {
		const { getByTestId, user, trigger } = setup({
			closeOnOutsideClick: false,
		});
		const content = getByTestId('content');

		expect(trigger).toBeVisible();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		const closer = getByTestId('floating-closer');
		await waitFor(() => expect(closer).toBeVisible());
		await user.click(closer);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	it('Respects the `closeOnEscape` prop', async () => {
		const { getByTestId, user, trigger } = setup({
			closeOnEscape: false,
		});
		expect(trigger).toBeVisible();
		const content = getByTestId('content');
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
	});

	it("Doesn't close on escape if child intercepts event", async () => {
		const { getByTestId, user, trigger } = setup();
		await user.click(trigger);
		const content = getByTestId('content');
		expect(content).toBeVisible();
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
		const { getByTestId } = setup({
			ids,
		});

		const content = getByTestId('content');
		const title = getByTestId('title');
		const description = getByTestId('description');
		expect(content.id).toBe(ids.content);
		expect(title.id).toBe(ids.title);
		expect(description.id).toBe(ids.description);
	});

	it("Doesn't close on pointerup if the previous pointerdown didn't occur inside the dialog", async () => {
		const { getByTestId, user, trigger } = setup();
		const overlay = getByTestId('overlay');
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await user.pointer({ target: content, offset: 2, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, offset: 2, keys: '[/MouseLeft]' });
		expect(content).toBeVisible();
	});

	it('Closes on pointerup if the previous pointerdown occurred outside the dialog', async () => {
		const { getByTestId, user, trigger } = setup();
		const overlay = getByTestId('overlay');
		const content = getByTestId('content');

		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await sleep(100);
		expect(overlay).toBeVisible();
		await user.pointer({ target: overlay, keys: '[MouseLeft>]' });
		await user.pointer({ target: overlay, keys: '[/MouseLeft]' });
		await waitFor(() => expect(content).not.toBeVisible());
	});

	it("Doesn't deactivate focus trap on escape provided `closeOnEscape` false", async () => {
		const { getByTestId, user, trigger } = setup({
			closeOnEscape: false,
		});
		const content = getByTestId('content');
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
		expect(getByTestId('content')).toHaveFocus();
		await user.tab({ shift: true });
		expect(getByTestId('floating-closer')).not.toHaveFocus();
	});

	it("Doesn't deactivate focus trap on outside click provided `closeOnOutsideClick` false", async () => {
		const { getByTestId, user, trigger } = setup({
			closeOnOutsideClick: false,
		});
		const content = getByTestId('content');
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(getByTestId('overlay'));
		expect(content).toBeVisible();
		expect(getByTestId('content')).toHaveFocus();
		await user.tab({ shift: true });
		expect(getByTestId('floating-closer')).not.toHaveFocus();
	});

	describe('Mouse Device', () => {
		it("Doesn't close when interacting outside with click interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const clickInterceptor = getByTestId('click-interceptor');
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await user.click(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await user.click(clickInterceptor);
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerdown interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await user.click(trigger);
			await sleep(100);
			expect(content).toBeVisible();
			await user.click(getByTestId('pointerdown-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerup interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await user.click(trigger);
			await sleep(100);
			expect(content).toBeVisible();
			await user.click(getByTestId('pointerup-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mousedown interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await user.click(trigger);
			await sleep(100);
			expect(content).toBeVisible();
			await user.click(getByTestId('mousedown-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mouseup interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await user.click(trigger);
			await sleep(100);
			expect(content).toBeVisible();
			await user.click(getByTestId('mouseup-interceptor'));
			expect(content).toBeVisible();
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});
	});

	describe('Touch Device', () => {
		it("Doesn't close when interacting outside with click interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const clickInterceptor = getByTestId('click-interceptor');
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(clickInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerdown interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(getByTestId('pointerdown-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with pointerup interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(getByTestId('pointerup-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mousedown interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(getByTestId('mousedown-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with mouseup interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(getByTestId('mouseup-interceptor'));
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with touchstart interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const touchstartInterceptor = getByTestId('touchstart-interceptor');
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(touchstartInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it("Doesn't close when interacting outside with touchend interceptor", async () => {
			const { getByTestId, user, trigger } = setup();
			const touchendInterceptor = getByTestId('touchend-interceptor');
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			expect(content).not.toBeVisible();
			await touch(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			await touch(touchendInterceptor);
			expect(content).toBeVisible();
			await sleep(20);
			await user.click(overlay);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it('Closes on touchend if the previous touchstart occurred outside the dialog', async () => {
			const { getByTestId, user, trigger } = setup();
			const overlay = getByTestId('overlay');
			const content = getByTestId('content');

			expect(content).not.toBeVisible();
			await user.click(trigger);
			expect(content).toBeVisible();
			await sleep(100);
			expect(overlay).toBeVisible();
			await fireEvent(overlay, new TouchEvent('pointerdown', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('touchstart', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('pointerup', { bubbles: true }));
			await fireEvent(overlay, new TouchEvent('touchend', { bubbles: true }));
			await sleep(20);
			await waitFor(() => expect(content).not.toBeVisible());
		});

		it('Resets `interceptedEvents` when calling `preventDefault()` on touch event', async () => {
			const { getByTestId, user, trigger } = setup();
			const content = getByTestId('content');
			const overlay = getByTestId('overlay');
			const touchendPreventDefault = getByTestId('touchend-prevent-default-interceptor');

			expect(content).not.toBeVisible();
			await user.click(trigger);
			expect(content).toBeVisible();
			await sleep(100);
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
