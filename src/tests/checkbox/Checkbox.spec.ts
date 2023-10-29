import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CheckboxTest from './CheckboxTest.svelte';
import userEvent from '@testing-library/user-event';
import { testKbd as kbd } from '../utils';

describe('Checkbox', () => {
	test('No accessibility violations', async () => {
		const { container } = render(CheckboxTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles when clicked', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const checkbox = getByTestId('checkbox');

		expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		await user.click(checkbox);
		expect(checkbox.getAttribute('data-state')).toBe('checked');
		await user.click(checkbox);
		expect(checkbox.getAttribute('data-state')).toBe('unchecked');
	});

	test('Should be checked when checked prop is true', async () => {
		const { getByTestId } = render(CheckboxTest, { defaultChecked: true });
		expect(getByTestId('checkbox').getAttribute('data-state')).toBe('checked');
	});

	test('Should be unchecked when checked prop is false', async () => {
		const { getByTestId } = render(CheckboxTest, { defaultChecked: false });
		expect(getByTestId('checkbox').getAttribute('data-state')).toBe('unchecked');
	});

	test('Should trigger on space keydown', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const checkbox = getByTestId('checkbox');

		expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		checkbox.focus();
		await user.keyboard(kbd.SPACE);
		expect(checkbox.getAttribute('data-state')).toBe('checked');
		await user.keyboard(kbd.SPACE);
		expect(checkbox.getAttribute('data-state')).toBe('unchecked');
	});

	test('Should not trigger on Enter keydown', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const checkbox = getByTestId('checkbox');

		expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
		checkbox.focus();
		await user.keyboard(kbd.ENTER);
		expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
	});
});
