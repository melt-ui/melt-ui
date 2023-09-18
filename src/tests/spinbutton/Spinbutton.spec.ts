import { render } from '@testing-library/svelte';
import Spinbutton from './Spinbutton.svelte';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers/keyboard';

describe('Spinbutton', () => {
	it('should have the required attributes are present on the elements', () => {
		const { getByTestId } = render(Spinbutton);
		const root = getByTestId('spinbutton-root');
		const label = getByTestId('spinbutton-label');

		expect(root).toHaveAttribute('role', 'group');

		// NOTE: the label is referenced by aria-labelledby
		const labelID = label.getAttribute('id');
		const rootLabelID = root.getAttribute('aria-labelledby');
		expect(rootLabelID).toBe(labelID);

		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');
		const increase = getByTestId('spinbutton-increase');

		// NOTE: only the spinbutton is focusable, the buttons are not.
		expect(spinbutton).toHaveAttribute('role', 'spinbutton');
		expect(spinbutton).toHaveAttribute('tabindex', '0');
		expect(increase).toHaveAttribute('tabindex', '-1');
		expect(decrease).toHaveAttribute('tabindex', '-1');
	});

	it('should have a min and a max value defined and the current value is 1', () => {
		const minValue = 1;
		const maxValue = 10;

		const { getByTestId } = render(Spinbutton, { minValue, maxValue });
		const spinbutton = getByTestId('spinbutton');

		const min = spinbutton.getAttribute('aria-valuemin');
		const max = spinbutton.getAttribute('aria-valuemax');
		const currentValue = spinbutton.getAttribute('aria-valuenow');

		expect(Number(min)).toEqual(minValue);
		expect(Number(max)).toEqual(maxValue);
		expect(Number(currentValue)).toEqual(minValue);
	});

	it('should update the currentValue to 2 when using the buttons', async () => {
		const user = userEvent.setup();

		const minValue = 1;
		const maxValue = 10;

		let currentValue = 0;
		const { getByTestId } = render(Spinbutton, { minValue, maxValue });

		const spinbutton = getByTestId('spinbutton');
		const increase = getByTestId('spinbutton-increase');
		const decrease = getByTestId('spinbutton-decrease');

		await user.click(increase);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(2);

		await user.click(decrease);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(1);
	});

	it('should update the currentValue to 10 when decrementing for the first time', async () => {
		const user = userEvent.setup();

		const minValue = 1;
		const maxValue = 10;

		const { getByTestId } = render(Spinbutton, { minValue, maxValue });
		const spinbutton = getByTestId('spinbutton');
		const decrease = getByTestId('spinbutton-decrease');

		await user.click(decrease);
		const currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(maxValue);
	});

	it('should update the currentValue when using the keyboard', async () => {
		const user = userEvent.setup();

		const { getByTestId } = render(Spinbutton, { steps: 2 });
		const spinbutton = getByTestId('spinbutton');
		let currentValue = 0;

		spinbutton.focus();

		// NOTE: Update the value
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(10);

		await user.keyboard(`{${kbd.ARROW_UP}}`);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(1);

		// NOTE: Update the value by a large step
		await user.keyboard(`{${kbd.PAGE_UP}}`);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(3);

		// NOTE: Update to the max and min values
		await user.keyboard(`{${kbd.HOME}}`);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(1);

		await user.keyboard(`{${kbd.END}}`);
		currentValue = Number(spinbutton.getAttribute('aria-valuenow'));
		expect(currentValue).toEqual(10);
	});
});
