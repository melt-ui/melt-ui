import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import PopoverTest from './PopoverTest.svelte';
import { userEvent } from '@testing-library/user-event';
import type { CreatePopoverProps } from '$lib/index.js';
import { assertActiveFocusTrap, testKbd as kbd } from '../utils.js';
import { sleep } from '$lib/internal/helpers/index.js';

function setup(props: CreatePopoverProps = {}) {
	const user = userEvent.setup();
	const returned = render(PopoverTest, props);
	const trigger = returned.getByTestId('trigger');
	const content = returned.getByTestId('content');
	return {
		user,
		trigger,
		content,
		...returned,
	};
}

const open = async (props: CreatePopoverProps = {}) => {
	const returned = setup(props);
	const { user, trigger, content } = returned;
	expect(content).not.toBeVisible();
	await user.click(trigger);
	expect(content).toBeVisible();
	return returned;
};

describe('Popover (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(PopoverTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on click', async () => {
		await open();
	});

	test('Closes on escape', async () => {
		const { content, user } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(content).not.toBeVisible();
	});

	test('Closes when click outside content', async () => {
		const { content, user, getByTestId } = await open();
		await user.click(content);
		expect(content).toBeVisible();
		const outside = getByTestId('outside');
		expect(outside).toBeVisible();
		await user.click(outside);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('doesnt close when preventDefault called in `onOutsideClick`', async () => {
		const { content, user, getByTestId } = await open({
			onOutsideClick: (e) => e.preventDefault(),
		});
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const outside = getByTestId('outside');
		await user.click(outside);
		expect(outside).toBeVisible();
		await user.click(outside);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Toggles open state on trigger click', async () => {
		const { content, trigger, user } = await open();
		await user.click(trigger);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Respects `openFocus` prop', async () => {
		const { getByTestId } = await open({
			openFocus: () => document.getElementById('openFocus'),
		});
		const openFocus = getByTestId('openFocus');
		await sleep(1);
		expect(openFocus).toHaveFocus();
	});

	test('Respects `closeFocus` prop', async () => {
		const { content, user, getByTestId } = await open({
			closeFocus: () => document.getElementById('closeFocus'),
		});
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(content).not.toBeVisible());
		const closeFocus = getByTestId('closeFocus');
		await sleep(1);
		expect(closeFocus).toHaveFocus();
	});

	test('Custom ids are applied when provided', async () => {
		const ids = {
			content: 'id-content',
			trigger: 'id-trigger',
		};
		const { getByTestId } = setup({
			ids,
		});

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(trigger.id).toBe(ids.trigger);
		expect(content.id).toBe(ids.content);
	});

	it("Doesn't deactivate focus trap on escape provided `escapeBehavior` false", async () => {
		const { getByTestId, user, content } = await open({ escapeBehavior: 'ignore' });
		await user.keyboard(kbd.ESCAPE);
		expect(content).toBeVisible();
		expect(getByTestId('content')).toHaveFocus();
		await assertActiveFocusTrap(user, content);
	});

	it("Doesn't deactivate focus trap on outside click provided `closeOnOutsideClick` false", async () => {
		const { getByTestId, user, content } = await open({ closeOnOutsideClick: false });
		await user.click(getByTestId('outside'));
		expect(content).toBeVisible();
		await assertActiveFocusTrap(user, content);
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
		expect(content).toBeVisible();
		await assertActiveFocusTrap(user, content);
	});
});
