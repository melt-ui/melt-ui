import type { CreateRadioGroupProps } from '$lib';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it } from 'vitest';
import { testKbd as kbd } from '../utils.js';
import RadioGroupTest from './RadioGroupTest.svelte';

const items = [
	{
		value: 'a',
		disabled: false,
	},
	{
		value: 'b',
		disabled: false,
	},
	{
		value: 'c',
		disabled: false,
	},
	{
		value: 'd',
		disabled: false,
	},
];

function setup(
	props: CreateRadioGroupProps & { items?: { value: string; disabled: boolean }[] } = {}
) {
	const user = userEvent.setup();
	return { ...render(RadioGroupTest, props), user };
}

describe('Radio Group', () => {
	it('No accessibility violations', async () => {
		const { container } = render(RadioGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it('doesnt require a default value', async () => {
		const { getByTestId } = setup();
		expect(getByTestId('value')).toHaveTextContent('undefined');
	});

	it('allows changing value by clicking on a radio button', async () => {
		const { user, getByTestId } = setup();
		const a = getByTestId('a');
		const b = getByTestId('b');
		const value = getByTestId('value');
		await user.click(a);
		expect(value).toHaveTextContent('a');
		await user.click(b);
		expect(value).toHaveTextContent('b');
	});

	it('navigates through the buttons with arrow keys', async () => {
		const { user, getByTestId } = setup();

		const els = ['a', 'b', 'c', 'd'].map((v) => getByTestId(v));

		await user.click(els[0]);
		expect(els[0]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(els[1]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(els[2]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(els[3]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(els[0]).toHaveFocus();
	});

	it('skips over disabled buttons', async () => {
		const { user, getByTestId } = setup({
			items: items.map((item) => ({ ...item, disabled: item.value === 'b' })),
		});

		const els = ['a', 'b', 'c', 'd'].map((v) => getByTestId(v));

		await user.click(els[0]);
		expect(els[0]).toHaveFocus();
		await user.keyboard(kbd.ARROW_DOWN);
		expect(els[2]).toHaveFocus();
		expect(els[1]).not.toHaveFocus();
	});
});
