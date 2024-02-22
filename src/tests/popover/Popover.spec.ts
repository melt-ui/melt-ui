import { render, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import PopoverTest from './PopoverTest.svelte';
import { userEvent } from '@testing-library/user-event';
import type { CreatePopoverProps } from '$lib/index.js';
import { testKbd as kbd } from '../utils.js';
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

describe('Popover (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(PopoverTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens on click', async () => {
		const { content, trigger, user } = setup();

		expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Closes on escape', async () => {
		const { content, trigger, user } = setup();

		expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Closes when click outside content', async () => {
		const { content, trigger, user, getByTestId } = setup();

		expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const outside = getByTestId('outside');
		await sleep(100);
		expect(outside).toBeVisible();
		await user.click(outside);
		await sleep(100);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('doesnt close when preventDefault called in `onOutsideClick`', async () => {
		const { content, trigger, user, getByTestId } = setup({
			onOutsideClick: (e) => {
				e.preventDefault();
			},
		});

		expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(content);
		await waitFor(() => expect(content).toBeVisible());
		const outside = getByTestId('outside');
		await sleep(100);
		expect(outside).toBeVisible();
		await user.click(outside);
		await sleep(100);
		await waitFor(() => expect(content).toBeVisible());
	});

	test('Toggles open state on trigger click', async () => {
		const { content, trigger, user } = setup();

		expect(content).not.toBeVisible();
		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		await user.click(trigger);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Respects `openFocus` prop', async () => {
		const { content, trigger, user, getByTestId } = setup({
			openFocus: () => {
				return document.getElementById('openFocus');
			},
		});

		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
		const openFocus = getByTestId('openFocus');
		await sleep(1);
		expect(openFocus).toHaveFocus();
	});

	test('Respects `closeFocus` prop', async () => {
		const { content, trigger, user, getByTestId } = setup({
			closeFocus: () => {
				return document.getElementById('closeFocus');
			},
		});

		await user.click(trigger);
		await waitFor(() => expect(content).toBeVisible());
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
});
