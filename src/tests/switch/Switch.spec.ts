import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import SwitchTest from './SwitchTest.svelte';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers';
import { writable } from 'svelte/store';
import { tick } from 'svelte';

describe('Switch', () => {
	it('No accessibility violations', async () => {
		const { container } = render(SwitchTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it('toggles when clicked', async () => {
		const { getByTestId } = render(SwitchTest);
		const switchEl = getByTestId('switch');

		await userEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'checked');
		expect(switchEl).toHaveAttribute('aria-checked', 'true');

		await userEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');
	});

	it('toggles on enter/space', async () => {
		const { getByTestId } = render(SwitchTest);
		const switchEl = getByTestId('switch');

		const keys = [kbd.SPACE, kbd.ENTER];
		switchEl.focus();
		expect(switchEl).toHaveFocus();

		for (const key of keys) {
			await userEvent.keyboard(`{${key}}`);
			expect(switchEl).toHaveAttribute('data-state', 'checked');
			expect(switchEl).toHaveAttribute('aria-checked', 'true');

			await userEvent.keyboard(`{${key}}`);
			expect(switchEl).toHaveAttribute('data-state', 'unchecked');
			expect(switchEl).toHaveAttribute('aria-checked', 'false');
		}
	});

	it('does not toggle when disabled', async () => {
		const { getByTestId } = render(SwitchTest, {
			disabled: true,
		});
		const switchEl = getByTestId('switch');

		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');

		await userEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');

		switchEl.focus();
		expect(switchEl).not.toHaveFocus();
	});

	it('does not focus when disabled', async () => {
		const { getByTestId } = render(SwitchTest, {
			disabled: true,
		});
		const switchEl = getByTestId('switch');

		switchEl.focus();
		expect(switchEl).not.toHaveFocus();
	});

	it('applies the name prop to the input', async () => {
		const { getByTestId } = render(SwitchTest, {
			name: 'test',
		});

		const input = getByTestId('input');
		expect(input).toHaveAttribute('name', 'test');
	});

	it('applies the required prop to the input', async () => {
		const { getByTestId } = render(SwitchTest, {
			required: true,
		});

		const input = getByTestId('input');
		expect(input).toHaveAttribute('required');
	});

	it('respects the defaultChecked prop', async () => {
		const { getByTestId } = render(SwitchTest, {
			defaultChecked: true,
		});

		const switchEl = getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'checked');
		expect(switchEl).toHaveAttribute('aria-checked', 'true');
	});

	it('respects the checked store prop', async () => {
		const { getByTestId } = render(SwitchTest, {
			checked: writable(true),
		});

		const switchEl = getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'checked');
		expect(switchEl).toHaveAttribute('aria-checked', 'true');
	});

	it('favors the checked store value over the defaultChecked value', async () => {
		const checkedStore = writable(false);
		const { getByTestId } = render(SwitchTest, {
			defaultChecked: true,
			checked: checkedStore,
		});

		const switchEl = getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');
	});

	it('respects onCheckedChange prop', async () => {
		const { getByTestId } = render(SwitchTest, {
			onCheckedChange: () => {
				return false;
			},
		});

		const switchEl = getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');

		await userEvent.click(switchEl);
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');
	});

	it('allows programmatically setting the checked state via the store', async () => {
		const checkedStore = writable(true);
		const { getByTestId } = render(SwitchTest, {
			checked: checkedStore,
		});

		const switchEl = getByTestId('switch');
		expect(switchEl).toHaveAttribute('data-state', 'checked');
		expect(switchEl).toHaveAttribute('aria-checked', 'true');

		checkedStore.set(false);
		await tick();
		expect(switchEl).toHaveAttribute('data-state', 'unchecked');
		expect(switchEl).toHaveAttribute('aria-checked', 'false');
	});
});
