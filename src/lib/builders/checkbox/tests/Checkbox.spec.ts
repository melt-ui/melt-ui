import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CheckboxTest from './CheckboxTest.svelte';
import userEvent from '@testing-library/user-event';

describe('Checkbox', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(CheckboxTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles when clicked', async () => {
		const { getByTestId } = await render(CheckboxTest);

		const checkbox = getByTestId('checkbox');

		await expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		await checkbox.click();
		await expect(checkbox.getAttribute('data-state')).toBe('checked');
		await checkbox.click();
		await expect(checkbox.getAttribute('data-state')).toBe('unchecked');
	});

	test('Should be checked when checked prop is true', async () => {
		const { getByTestId } = render(CheckboxTest, { checked: true });
		await expect(getByTestId('checkbox').getAttribute('data-state')).toBe('checked');
	});

	test('Should be unchecked when checked prop is false', async () => {
		const { getByTestId } = render(CheckboxTest, { checked: false });
		await expect(getByTestId('checkbox').getAttribute('data-state')).toBe('unchecked');
	});

	test('Should trigger on space keydown', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const checkbox = getByTestId('checkbox');

		await expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		await checkbox.focus();
		await user.keyboard(' ');
		await expect(checkbox.getAttribute('data-state')).toBe('checked');
		await user.keyboard(' ');
		await expect(checkbox.getAttribute('data-state')).toBe('unchecked');
	});

	test('Should not trigger on Enter keydown', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const checkbox = getByTestId('checkbox');

		await expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		await checkbox.focus();
		await user.keyboard('{enter}');
		await expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
	});
});
