import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CollapsibleTest from './CollapsibleTest.svelte';
import userEvent from '@testing-library/user-event';
import type { CreateCollapsibleProps } from '$lib';
import { get, writable } from 'svelte/store';
import { sleep, type ChangeFn } from '$lib/internal/helpers';

function setup(props: CreateCollapsibleProps = {}) {
	const user = userEvent.setup();
	const returned = render(CollapsibleTest, props);
	return {
		...returned,
		user,
	};
}

describe('Collapsible', () => {
	test('No accessibility violations', async () => {
		const { container } = render(CollapsibleTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles when clicked', async () => {
		const { getByTestId, user } = setup();

		const trigger = getByTestId('trigger');

		expect(trigger).toBeVisible();

		expect(getByTestId('content')).not.toBeVisible();
		await user.click(trigger);
		expect(getByTestId('content')).toBeVisible();
		await user.click(trigger);
		expect(getByTestId('content')).not.toBeVisible();
	});

	test('Should be open when open prop is true', async () => {
		const { getByTestId } = setup({ defaultOpen: true });
		expect(getByTestId('content')).toBeVisible();
	});

	test('Should be closed when open prop is false', async () => {
		const { getByTestId } = setup({ defaultOpen: false });
		expect(getByTestId('content')).not.toBeVisible();
	});

	test('Correctly handles controlled store updates', async () => {
		const customOpen = writable(false);

		const { getByTestId, user } = setup({ open: customOpen });
		expect(getByTestId('content')).not.toBeVisible();

		customOpen.set(true);
		await sleep(1);
		expect(getByTestId('content')).toBeVisible();
		await user.click(getByTestId('trigger'));
		await sleep(1);
		expect(get(customOpen)).toBe(false);
	});

	test('Should be disabled when disabled prop is true', async () => {
		const { getByTestId, user } = setup({ disabled: true });
		expect(getByTestId('content')).not.toBeVisible();
		await user.click(getByTestId('trigger'));
		expect(getByTestId('content')).not.toBeVisible();
	});

	test('Respects `onOpenChange` callback when the open state changes', async () => {
		const onOpenChange: ChangeFn<boolean> = () => {
			return false;
		};
		const { getByTestId, user } = setup({ onOpenChange });
		expect(getByTestId('content')).not.toBeVisible();
		await user.click(getByTestId('trigger'));
		expect(getByTestId('content')).not.toBeVisible();
	});
});
