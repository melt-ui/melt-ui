import { render } from '@testing-library/svelte';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import { kbd } from '$lib/internal/helpers/keyboard';
import Spinbutton from './Spinbutton.svelte';

describe('Spinbutton', () => {
	it('should have the required attributes', () => {
		const { getByTestId } = render(Spinbutton);
		const root = getByTestId('spinbutton-root');
		const label = getByTestId('spinbutton-label');

		expect(root).toHaveAttribute('role', 'group');

		// NOTE: the label is referenced by aria-labelledby in the root element
		const labelID = label.getAttribute('id');
		const rootLabelID = root.getAttribute('aria-labelledby');
		expect(rootLabelID).toBe(labelID);

		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');
		const increase = getByTestId('spinbutton-increase');

		// NOTE: only the spinbutton element is focusable not the buttons
		expect(spinbutton).toHaveAttribute('role', 'spinbutton');
		expect(spinbutton).toHaveAttribute('tabindex', '0');
		expect(increase).toHaveAttribute('tabindex', '-1');
		expect(decrease).toHaveAttribute('tabindex', '-1');
	});

	it('should have a min and a max value', () => {
		const { getByTestId } = render(Spinbutton);
		const spinbutton = getByTestId('spinbutton');

		const min = spinbutton.getAttribute('aria-valuemin');
		const max = spinbutton.getAttribute('aria-valuemax');

		expect(Number(min)).toEqual(1);
		expect(Number(max)).toEqual(12);
	});

	it('should have a default value of January', () => {
		const { getByTestId } = render(Spinbutton);
		const spinbutton = getByTestId('spinbutton');

		expect(spinbutton.textContent).toBe('January');
		expect(spinbutton).toHaveAttribute('aria-valuenow', '1');
	});

	it('should allow setting a default value', () => {
		const { getByTestId } = render(Spinbutton, { defaultValue: 'October' });
		const spinbutton = getByTestId('spinbutton');

		expect(spinbutton.textContent).toBe('October');
		expect(spinbutton).toHaveAttribute('aria-valuenow', '10');
	});

	it('should update the currentValue to 2 when using the buttons', async () => {
		const user = userEvent.setup();

		let currentValue = 0;
		const { getByTestId } = render(Spinbutton);

		const spinbutton = getByTestId('spinbutton');
		const increase = getByTestId('spinbutton-increase');
		const decrease = getByTestId('spinbutton-decrease');

		await user.click(increase);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(2);
		expect(spinbutton.textContent).toBe('February');

		await user.click(decrease);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(1);
		expect(spinbutton.textContent).toBe('January');
	});

	it('should update the currentValue to 12 when decrementing for the first time', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton);
		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');

		await user.click(decrease);
		const currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(12);
		expect(spinbutton.textContent).toBe('December');
	});

	it('should update the currentValue when using the keyboard', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { steps: 2 });
		const spinbutton = getByTestId('spinbutton');

		spinbutton.focus();

		// NOTE: Update the value
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(spinbutton.textContent).toBe('December');

		await user.keyboard(`{${kbd.ARROW_UP}}`);
		expect(spinbutton.textContent).toBe('January');

		// NOTE: Update the value by a large step
		await user.keyboard(`{${kbd.PAGE_UP}}`);
		expect(spinbutton.textContent).toBe('March');

		// NOTE: Update to the max and min values
		await user.keyboard(`{${kbd.HOME}}`);
		expect(spinbutton.textContent).toBe('January');

		await user.keyboard(`{${kbd.END}}`);
		expect(spinbutton.textContent).toBe('December');
	});

	it("should not allow modifications when using the buttons while disabled", async () => {
    const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { disabled: true });
    const spinbutton = getByTestId('spinbutton');
    const increase = getByTestId('spinbutton-increase');

    await user.click(increase);
    expect(spinbutton.textContent).toBe('January');
	});

	it('should update the currentValue when using the keyboard while disabled', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { steps: 2, disabled: true });
		const spinbutton = getByTestId('spinbutton');

		spinbutton.focus();

		// NOTE: Update the value
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		expect(spinbutton.textContent).toBe('January');


		// NOTE: Update the value by a large step
		await user.keyboard(`{${kbd.PAGE_UP}}`);
		expect(spinbutton.textContent).toBe('January');

		// NOTE: Update to the max and min values
		await user.keyboard(`{${kbd.HOME}}`);
		expect(spinbutton.textContent).toBe('January');
	});
});
