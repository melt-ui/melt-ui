import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import { testKbd as kbd } from '../utils.js';
import PinInputTest from './PinInputTest.svelte';
import { writable } from 'svelte/store';

describe('PIN Input', () => {
	it('has no accessibility violations', async () => {
		const { container } = render(PinInputTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("doesn't display the hidden input", async () => {
		const { getByTestId } = render(PinInputTest);
		const hiddenInput = getByTestId('hidden-input');
		expect(hiddenInput).not.toBeVisible();
	});

	it('uses the `placeholder` prop as the placeholder', async () => {
		const valueStore = writable([]);
		const { getByTestId } = render(PinInputTest, { value: valueStore, placeholder: 'X' });
		expect(getByTestId('input-1')).toHaveAttribute('placeholder', 'X');
	});

	it('uses the `type` prop to determine the input type', async () => {
		const { getByTestId } = render(PinInputTest, { type: 'password' });
		expect(getByTestId('input-1')).toHaveAttribute('type', 'password');
	});

	it('syncs the `name` prop to the hidden input', async () => {
		const { getByTestId } = render(PinInputTest, { name: 'test' });
		const hiddenInput = getByTestId('hidden-input');
		expect(hiddenInput).toHaveAttribute('name', 'test');
	});

	it('inputs should be disabled when the `disabled` prop is set to true', async () => {
		const { getByTestId } = render(PinInputTest, { disabled: true });
		expect(getByTestId('input-1')).toBeDisabled();
		expect(getByTestId('input-2')).toBeDisabled();
		expect(getByTestId('input-3')).toBeDisabled();
		expect(getByTestId('input-4')).toBeDisabled();
		expect(getByTestId('input-5')).toBeDisabled();
	});

	it('syncs the `value` prop to the hidden input', async () => {
		const value = ['0', '1', '1', '3', '4'];
		const valueStore = writable(value);
		const valueStr = value.join('');
		const { getByTestId } = render(PinInputTest, { value: valueStore });
		const hiddenInput = getByTestId('hidden-input');
		expect(hiddenInput).toHaveValue(valueStr);
	});

	it('inputs should fire the `onChange` callback when changing', async () => {
		let newValue = undefined;

		const { getByTestId } = render(PinInputTest, {
			onValueChange: ({ next }) => {
				newValue = next;
				return next;
			},
		});

		const user = userEvent.setup();

		const input3 = getByTestId('input-3');
		input3.focus();
		await user.type(input3, '6');
		expect(newValue).toStrictEqual(['1', '2', '6', '4', '5']);
	});

	it('navigates between the inputs using the arrow keys', async () => {
		const { getByTestId } = render(PinInputTest);
		const user = userEvent.setup();

		getByTestId('input-1').focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId('input-2')).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId('input-3')).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId('input-4')).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId('input-5')).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId('input-5')).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(getByTestId('input-4')).toHaveFocus();
	});

	it('navigates to the next input when typing', async () => {
		const { getByTestId } = render(PinInputTest);
		const user = userEvent.setup();

		const input1 = getByTestId('input-1');
		const input2 = getByTestId('input-2');
		const input3 = getByTestId('input-3');
		const input4 = getByTestId('input-4');
		const input5 = getByTestId('input-5');
		const hiddenInput = getByTestId('hidden-input');

		input1.focus();
		await user.type(input1, '1');
		expect(input2).toHaveFocus();
		await user.type(input2, '2');
		expect(input3).toHaveFocus();
		await user.type(input3, '3');
		expect(input4).toHaveFocus();
		await user.type(input4, '4');
		expect(input5).toHaveFocus();
		await user.type(input5, '5');
		expect(input5).toHaveFocus();
		await user.type(input5, '5');
		expect(input5).toHaveFocus();
		expect(hiddenInput).toHaveValue('12345');
	});

	it('deletes current input when pressing delete', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(PinInputTest);

		const input1 = getByTestId('input-1');
		const input2 = getByTestId('input-2');
		const input3 = getByTestId('input-3');
		const input4 = getByTestId('input-4');
		const input5 = getByTestId('input-5');
		const hiddenInput = getByTestId('hidden-input');

		expect(hiddenInput).toHaveValue('12345');
		input1.focus();
		expect(input1).toHaveValue('1');
		await user.keyboard(kbd.DELETE);
		expect(input1).toHaveValue('');
		expect(input1).toHaveFocus();
		expect(hiddenInput).toHaveValue('2345');
		input2.focus();
		expect(input2).toHaveValue('2');
		await user.keyboard(kbd.DELETE);
		expect(input2).toHaveValue('');
		expect(input2).toHaveFocus();
		expect(hiddenInput).toHaveValue('345');
		input3.focus();
		expect(input3).toHaveValue('3');
		await user.keyboard(kbd.DELETE);
		expect(input3).toHaveValue('');
		expect(input3).toHaveFocus();
		expect(hiddenInput).toHaveValue('45');
		input4.focus();
		expect(input4).toHaveValue('4');
		await user.keyboard(kbd.DELETE);
		expect(input4).toHaveValue('');
		expect(input4).toHaveFocus();
		expect(hiddenInput).toHaveValue('5');
		input5.focus();
		expect(input5).toHaveValue('5');
		await user.keyboard(kbd.DELETE);
		expect(input5).toHaveValue('');
		expect(input5).toHaveFocus();
		expect(hiddenInput).toHaveValue('');
	});

	it('deletes current input when pressing backspace, if empty moves to previous input and deletes that value as well.', async () => {
		const { getByTestId } = render(PinInputTest);
		const user = userEvent.setup();

		const input1 = getByTestId('input-1');
		const input2 = getByTestId('input-2');
		const input3 = getByTestId('input-3');
		const input4 = getByTestId('input-4');
		const input5 = getByTestId('input-5');
		const hiddenInput = getByTestId('hidden-input');

		expect(hiddenInput).toHaveValue('12345');
		input5.focus();
		expect(input5).toHaveValue('5');
		await user.keyboard(kbd.BACKSPACE);
		expect(input5).toHaveValue('');
		expect(input5).toHaveFocus();
		expect(input4).toHaveValue('4');
		await user.keyboard(kbd.BACKSPACE);
		expect(input4).toHaveValue('');
		expect(input4).toHaveFocus();
		expect(input3).toHaveValue('3');
		await user.keyboard(kbd.BACKSPACE);
		expect(input3).toHaveValue('');
		expect(input3).toHaveFocus();
		expect(input2).toHaveValue('2');
		await user.keyboard(kbd.BACKSPACE);
		expect(input2).toHaveValue('');
		expect(input2).toHaveFocus();
		expect(input1).toHaveValue('1');
		await user.keyboard(kbd.BACKSPACE);
		expect(input1).toHaveValue('');
		expect(input1).toHaveFocus();
		expect(hiddenInput).toHaveValue('');
	});
});
