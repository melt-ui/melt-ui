import { act, render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import { testKbd as kbd } from '../utils.js';
import ComboboxTest from './ComboboxTest.svelte';
import type { ComboboxOptionProps } from '$lib/index.js';
import ComboboxForceVisibleTest from './ComboboxForceVisibleTest.svelte';

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
			{ label: '1234', value: { id: 1234, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '4321', value: { id: 4321, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '2341', value: { id: 2341, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '3412', value: { id: 3412, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '5656', value: { id: 5656, station: 'Station 1', lastTransmission: '2023-01-01' } },
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
	});

	test('Applies custom ids when provided', async () => {
		const ids = {
			label: 'id-label',
			menu: 'id-menu',
			trigger: 'id-trigger',
		};

		const { getByTestId } = render(ComboboxTest, {
			ids,
		});

		const trigger = getByTestId('input');
		const menu = getByTestId('menu');
		const label = getByTestId('label');
		expect(trigger.id).toBe(ids.trigger);
		expect(menu.id).toBe(ids.menu);
		expect(label.id).toBe(ids.label);
	});

	test("Doesn't close on outside click if defaultPrevented on `onOutsideClick` handler", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ComboboxTest, { onOutsideClick: (e) => e.preventDefault() });
		const input = getByTestId('input');

		await user.click(input);
		expect(getByTestId('menu')).toBeVisible();

		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		expect(getByTestId('menu')).toBeVisible();
	});

	test.skip('Closes on outside click by default', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ComboboxTest);
		const input = getByTestId('input');

		await user.click(input);
		const menu = getByTestId('menu');
		expect(menu).toBeVisible();

		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		await waitFor(() => expect(menu).not.toBeVisible());
	});

	test('Closes on escape by default', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ComboboxTest);

		const input = getByTestId('input');
		const menu = getByTestId('menu');

		await user.click(input);
		expect(menu).toBeVisible();

		await user.keyboard(kbd.ESCAPE);
		expect(menu).not.toBeVisible();
	});

	test('Respects the `closeOnEscape` prop', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ComboboxTest, { closeOnEscape: false });

		const input = getByTestId('input');
		const menu = getByTestId('menu');

		await user.click(input);
		expect(menu).toBeVisible();

		await user.keyboard(kbd.ESCAPE);
		expect(menu).toBeVisible();
	});

	test('Can programatically open the combobox with the `open` store', async () => {
		//
		const user = userEvent.setup();
		const { getByTestId } = render(ComboboxTest);

		const toggleBtn = getByTestId('toggle-btn');
		const menu = getByTestId('menu');

		expect(menu).not.toBeVisible();
		await user.click(toggleBtn);
		expect(menu).toBeVisible();
	});

	test.todo('Selects multiple items when `multiple` is true');
	test.todo('Manually setting the value updates the label');
	test.todo('Updating options and setting the value updates the label');
	test.todo('Respects the `closeOnOutsideClick` prop');
	test.todo('Disabled combobox cannot be opened');
	test.todo('Options loop when loop prop is set');
});

/**
 *
 * -----------------------------------------------
 *
 * FORCE VISIBLE
 *
 * -----------------------------------------------
 */

describe('Combobox (forceVisible)', () => {
	test('No accessibility violations', async () => {
		const { container } = render(ComboboxForceVisibleTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens/Closes when input is clicked', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest);
		const input = getByTestId('input');
		const getMenu = () => queryByTestId('menu');

		expect(getMenu()).toBeNull();

		await user.click(input);
		expect(getMenu()).not.toBeNull();

		await user.click(input);
		expect(getMenu()).toBeNull();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest);
		const trigger = getByTestId('input');
		const getMenu = () => queryByTestId('menu');

		expect(getMenu()).toBeNull();
		await act(() => trigger.focus());
		await user.keyboard(key);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();
	});

	test('Selects item when clicked', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest, { options });
		const input = getByTestId('input');
		const getMenu = () => queryByTestId('menu');

		expect(input).not.toHaveValue(options[0].label);

		expect(getMenu()).toBeNull();
		await user.click(input);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();

		const firstItem = getMenu()?.querySelector('[data-melt-combobox-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		expect(getMenu()).toBeNull();

		expect(input).toHaveValue(options[0].label);

		await user.click(input);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();

		const secondItem = getMenu()?.querySelectorAll('[data-melt-combobox-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		expect(queryByTestId('menu')).toBeNull();
		expect(input).toHaveValue(options[1].label);
	});

	test('Shows correct label when defaultValue is provided', async () => {
		const { getByTestId } = render(ComboboxForceVisibleTest, { defaultValue: 'Chocolate' });
		const input = getByTestId('input');

		expect(input).toHaveValue('Chocolate');
	});

	test('Options with undefined values can be selected', async () => {
		const options: ComboboxOptionProps[] = [
			{ label: '1234', value: { id: 1234, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '4321', value: { id: 4321, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '2341', value: { id: 2341, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '3412', value: { id: 3412, station: undefined, lastTransmission: '2023-01-01' } },
			{ label: '5656', value: { id: 5656, station: 'Station 1', lastTransmission: '2023-01-01' } },
		];

		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest, { options });
		const input = getByTestId('input');
		const getMenu = () => queryByTestId('menu');
		const getFirstItem = () => {
			const firstItem = getMenu()?.querySelector('[data-melt-combobox-option]');
			if (!firstItem) throw new Error('No option found');
			return firstItem;
		};

		expect(input).not.toHaveValue(options[0].label);

		expect(getMenu()).toBeNull();
		await user.click(input);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();

		await user.click(getFirstItem());

		expect(getMenu()).toBeNull();
		expect(input).toHaveValue(options[0].label);

		await user.click(input);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();
		expect(getFirstItem()).toHaveAttribute('data-selected');
	});

	test('Applies custom ids when provided', async () => {
		const user = userEvent.setup();
		const ids = {
			label: 'id-label',
			menu: 'id-menu',
			trigger: 'id-trigger',
		};

		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest, {
			ids,
		});

		const trigger = getByTestId('input');
		const getMenu = () => queryByTestId('menu');
		const label = getByTestId('label');
		expect(trigger.id).toBe(ids.trigger);
		await user.click(trigger);
		expect(getMenu()).not.toBeNull();
		expect(getMenu()?.id).toBe(ids.menu);
		expect(label.id).toBe(ids.label);
	});

	test("Doesn't close on outside click if defaultPrevented on `onOutsideClick` handler", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest, {
			onOutsideClick: (e) => e.preventDefault(),
		});
		const input = getByTestId('input');

		await user.click(input);
		const getMenu = () => queryByTestId('menu');
		expect(getMenu()).not.toBeNull();
		expect(getMenu()).toBeVisible();

		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		expect(getMenu()).not.toBeNull();
	});

	test.skip('Closes on outside click by default', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxTest);
		const input = getByTestId('input');

		const getMenu = () => queryByTestId('menu');

		await user.click(input);
		expect(getMenu).not.toBeNull();

		const outsideClick = getByTestId('outside-click');
		await user.click(outsideClick);
		await waitFor(() => expect(getMenu()).not.toBeVisible());
		``;
	});

	test('Closes on escape by default', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest);

		const input = getByTestId('input');
		const getMenu = () => queryByTestId('menu');

		await user.click(input);
		expect(getMenu()).not.toBeNull();

		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(getMenu()).toBeNull());
	});

	test('Respects the `closeOnEscape` prop', async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest, {
			closeOnEscape: false,
		});

		const input = getByTestId('input');
		const getMenu = () => queryByTestId('menu');

		await user.click(input);
		expect(getMenu()).not.toBeNull();

		await user.keyboard(kbd.ESCAPE);
		expect(getMenu()).not.toBeNull();
	});

	test('Can programatically open the combobox with the `open` store', async () => {
		//
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(ComboboxForceVisibleTest);

		const toggleBtn = getByTestId('toggle-btn');
		const getMenu = () => queryByTestId('menu');

		expect(getMenu()).toBeNull();
		await user.click(toggleBtn);
		expect(getMenu()).not.toBeNull();
	});

	test.todo('Selects multiple items when `multiple` is true');
	test.todo('Manually setting the value updates the label');
	test.todo('Updating options and setting the value updates the label');
	test.todo('Disabled combobox cannot be opened');
	test.todo('Options loop when loop prop is set');
});
