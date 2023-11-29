import { act, render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import { testKbd as kbd } from '../utils';
import ComboboxTest from './ComboboxTest.svelte';
import type { ComboboxOptionProps } from '$lib';

const options: ComboboxOptionProps[] = [
	{
		label: 'Kentaro Miura',
		value: 'Kentaro Miura',
	},
	{
		label: 'ONE',
		value: 'ONE',
	},
];

const OPEN_KEYS = [kbd.SPACE, kbd.A];

describe('Combobox', () => {
	test('No accessibility violations', async () => {
		const { container } = render(ComboboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens/Closes when input is clicked', async () => {
		const { getByTestId } = render(ComboboxTest);
		const input = getByTestId('input');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(input);
		expect(getByTestId('menu')).toBeVisible();

		await user.click(input);
		expect(menu).not.toBeVisible();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = render(ComboboxTest);
		const trigger = getByTestId('input');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(key);
		expect(menu).toBeVisible();
	});

	test('Selects item when clicked', async () => {
		const { getByTestId } = render(ComboboxTest, { options });
		const input = getByTestId('input');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(input).not.toHaveValue(options[0].label);

		expect(menu).not.toBeVisible();
		await user.click(input);
		expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-combobox-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		expect(menu).not.toBeVisible();
		expect(input).toHaveValue(options[0].label);

		await user.click(input);
		expect(menu).toBeVisible();

		const secondItem = menu.querySelectorAll('[data-melt-combobox-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		expect(menu).not.toBeVisible();
		expect(input).toHaveValue(options[1].label);
	});


	test('Shows correct label when defaultValue is provided', async () => {
		const { getByTestId } = render(ComboboxTest, { defaultValue: 'Chocolate' });
		const input = getByTestId('input');

		expect(input).toHaveValue('Chocolate');
	});

	test('Options with undefined values can be selected', async () => {
		const options: ComboboxOptionProps[] = [
			{ label: '1234', value: { id: 1234, station: undefined, lastTransmission: "2023-01-01" } },
			{ label: '4321', value: { id: 4321, station: undefined, lastTransmission: "2023-01-01" } },
			{ label: '2341', value: { id: 2341, station: undefined, lastTransmission: "2023-01-01" } },
			{ label: '3412', value: { id: 3412, station: undefined, lastTransmission: "2023-01-01" } },
			{ label: '5656', value: { id: 5656, station: "Station 1", lastTransmission: "2023-01-01" } },
		];

		const { getByTestId } = render(ComboboxTest, { options });
		const input = getByTestId('input');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(input).not.toHaveValue(options[0].label);

		expect(menu).not.toBeVisible();
		await user.click(input);
		expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-combobox-option]');
		if (!firstItem) throw new Error('No option found');

		await user.click(firstItem);

		expect(menu).not.toBeVisible();
		expect(input).toHaveValue(options[0].label);

		await user.click(input);
		expect(menu).toBeVisible();
		expect(firstItem).toHaveAttribute('data-selected');
	})

	test.todo('Selects multiple items when `multiple` is true')
	test.todo('Manually setting the value updates the label');
	test.todo('Updating options and setting the value updates the label');
	test.todo('Respects the `closeOnEscape` prop');
	test.todo('Respects the `closeOnOutsideClick` prop');
	test.todo('Disabled combobox cannot be opened');
	test.todo('Options loop when loop prop is set');
});
